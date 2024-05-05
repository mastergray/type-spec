import TypeSpecError from "../TypeSpecError/index.js";

//  Implements a rudimentary "type system" that represents instance of a "type" as an  object literal with constrained properties:
export default class TypeSpec {

    // Instance Fields:
    _typeName;      // Store name of type
    _props = {};    // Store supported properties of type
    _parentType;    // Stores parent type of this type

    // CONSTRUCTOR :: STRING, TYPESPEC|VOID -> this
    constructor(typeName, parentType) {
        this.typeName = typeName;
        this.parentType = parentType;
    }

    /**
     * 
     *  Properties 
     * 
     */

    /*==========*
     * typeName *
     *==========*/

    // SETTER :: STRING -> VOID
    set typeName (typeName) {
        if (TypeSpec.STRING(typeName) === true) {
            this._typeName = typeName;
        } else {
           throw TypeSpecError.INVALID_VALUE("Type Name", "STRING");
        }
        
    }

    // GETTER :: VOID -> STRING
    get typeName() {
        return this._typeName;
    }

    /*=======*
     * props *
     *=======*/

    // SETTER :: OBJECT -> VOID
    set props (props) {
        this._props = props;
    }

    // GETTER :: VOID -> OBJECT
    // NOTE: // We do a shallow copy of parent type properties to check against while also overwriting any of those properties if defined for a subtype
    get props() {
        return this.parentType !== undefined
            ? Object.assign({}, this.parentType.props, this._props) 
            : this._props;
    }

    /*============*
     * parentType *
     *============*/

    // SETTER :: TYPESPEC -> VOID
    set parentType(parentType) {
        if (parentType !== undefined) {
            if (parentType instanceof TypeSpec) {
                this._parentType = parentType;
            } else {
                throw new TypeSpecError(`Parent type of "${this.typeName} must be an instance of TypeSpec`, TypeSpecError.CODE.INVALID_VALUE);
            }
        }

    }

    // GETTER :: VOID -> TYPESPEC
    get parentType() {
        return this._parentType;
    }

    /**
     * 
     *  Instance Methods 
     * 
     */

    // ::  name:STRING, pred:(* -> BOOL), defaultValue:*|VOID -> this 
    // Binds name to predicate to check property of type instance with
    // NOTE: Optional "defaultValue" is used when property is not provided when creating instance of type:
    prop(name, pred, defaultValue) {

        if (TypeSpec.STRING(name) === false) {
            throw TypeSpecError.INVALID_VALUE("Property Name", "STRING");
        }

        if (TypeSpec.FUNCTION(pred) === false) {
            throw TypeSpecError.INVALID_VALUE("Property Predicate", "FUNCTION");
        }

        if (this.props[name] !== undefined && this.props[name].typeName === this.typeName) {
            throw new TypeSpecError(`Property "${name}" has already been defined for type "${this.typeName}"`, TypeSpecError.CODE.INVALID_PROPERTY_TYPE);
        }

        if (defaultValue !== undefined && pred(defaultValue) === false) {
            throw new TypeSpecError("Default value is not valid for given predicate", TypeSpecError.CODE.INVALID_VALUE);
        }

        // Property "definition" of the type:
        // NOTE: We directly update _props since the getter returns both this instance's props as well as it's parent's properties
        this._props[name] = {
            "typeName":this.typeName,              // This is used to determine if we can overwrite the property or not
            "check":pred,                          // The function we are using to validate with
            "required":defaultValue === undefined, // A property is "required" only if no default is given
            "defaultValue":defaultValue            // What to use if no value is given at initialization
        };

        return this;
    }

    // :: STRING, * -> this
    // Set explicit value for property that's immutable:
    constant(name, value) {
        return this.prop(name, arg=> TypeSpec.isEqual(value, arg), value);
    }

    // :: OBJECT -> OBJECT
    // Returns given value if valid for stored props - otherwise throws an error
    check(instance) {
        
        // Ensure instance we are checking is an OBJECT:
        if (TypeSpec.OBJECT(instance) === false) {
            throw new TypeSpecError(`Must check instance of type-spec "${this.typeName}" using OBJECT`, TypeSpecError.CODE.INVALID_VALUE);
        }

        // Stores names so we can insure instance we checking only includes all properties of a type
        const instanceNames = []
        const propNames = Object.keys(this.props);

        // Iterate through instance properties to ensure they're valid:
        for (const [name, value] of Object.entries(instance)) {
           
            // Check if instance property is a supported property of this type:
            if (propNames.indexOf(name) === -1) {
                throw TypeSpecError.UNSUPPORTED_PROP(this.typeName, name);
            }

            // Check if value of instance is valid:
            if (this.props[name].check(value) === false) {
                throw TypeSpecError.INVALID_PROP(this.typeName, name);
            }

            // Add valid property to check against before returning validated instance:
            instanceNames.push(name);

        } 

        // Check to make sure all properties have been validated:
        if (instanceNames.length !== propNames.length) {
            throw new TypeSpecError(`Only the properties of "${instanceNames.join()}" were provided for this instance of "${this.typeName}"`, TypeSpecError.CODE.MISSING_PROPERTY);
        }

        // Returns instance only if everything is valid:
        return instance;

    }

    // :: OBJECT -> OBJECT
    // Creates "instance" of type using given arguments:
    create(args) {

        // Ensure instance we are checking is an OBJECT:
        if (TypeSpec.OBJECT(args) === false) {
            throw new TypeSpecError(`Must intialize instance of TYPESPEC "${this.typeName}" using OBJECT`, TypeSpecError.CODE.INVALID_VALUE);
        }

        // Intializes instance with set default values:
        return Object.entries(this.props).reduce((result, [name, definition]) => {

            // Value we are checking against:
            const value = args[name];

            // Handle unset properties with "default" values:
            if (definition.required === false && value === undefined) {
                result[name] =  definition.defaultValue;
                return result;
            }

            // Throw error if property is missing from initializer:
            if (definition.required === true && value === undefined) {
                throw TypeSpecError.MISSING_PROP(this.typeName, name);
            }

            // Bind value to name of result if check is sucsseful, otherswise throw an error:
            if (definition.check(value) === true) {
                result[name] = value;
                return result;
            }

            // Otherwise throw an exception if check fails:
            throw TypeSpecError.INVALID_PROP(this.typeName, name);
          
        }, {});
    }

    // :: OBJECT, OBJECT -> OBJECT
    // Updates properties of instance
    // NOTE: This is to avoid mutation and encourage immutability:
    update(instance, props) {

        return Object.entries(this.props).reduce((result, [name, definition]) => {

            // See if we should use a new value or the existing instance value:
            const value = props[name] !== undefined 
                ? props[name]
                : instance[name]

            // Ensure value is valid before storing:
            if (definition.check(value) === true) {
                result[name] = value;
                return result;
            }

            // Otherwise throw an exception if check fails:
            throw TypeSpecError.INVALID_PROP(this.typeName, name);

        }, {});

    }

    /**
     * 
     *  Static Methods 
     * 
     */

    // Static Factory Method :: STRING, TYPESPEC|VOID -> typeSpec
    static init(typeName, parentType) {
        return new TypeSpec(typeName, parentType);
    }

    // :: * -> BOOL
    // Returns TRUE if value is type STRING, otherwise returns FALSE:
    static STRING(value) {
        return typeof(value) === "string";
    }
    
    // :: * -> BOOL
    // Returns TRUE if value is type STRING, but is more than just whitespace - otherwise returns FALSE:
    static NONEMPTY_STRING(value) {
        return TypeSpec.STRING && value.trim().length > 0;
    }

    // :: * -> BOOL
    // Returns TRUE if value is type NUMBER, otherwise returns FALSE:
    static NUMBER(value) {
        return typeof(value) === "number";
    }

    // :: * -> BOOL
    // Returns TRUE if value is type FUNCTION, otherwise returns FALSE:
    static FUNCTION(value) {
        return typeof(value) === "function";
    }

    // :: * -> BOOL
    // Returns TRUE if value is type OBJECT, otherwise returns FALSE: 
    static OBJECT(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    // :: * -> BOOL
    // Returns TRUE if value is an ARRAY, otherwise returns FALSE:
    static ARRAY(value) {
        return Array.isArray(value);
    }

    // Returns TRUE if both values are equal, otherwise returns FALSE:
    // NOTE: This is restricted to equality between primitive values, OBJECTs, ARRAYs of primitive values, and ARRAYs of OBJECTs:
    static isEqual(a,b) {

        // Compare arrays:
        if (TypeSpec.ARRAY(a) && TypeSpec.ARRAY(b)) {
            
            // Checks fails if arrays are of different length:
            if (a.length !== b.length) {
                return false;
            }
            
            // Recursively compare array elements:
            for (let i = 0; i < a.length; i++) {             
                if (!TypeSpec.isEqual(a[i], b[i]))  {
                    return false;
                }
            }

            // Returns TRUE if everything is "equal":
            return true;

        }

        // Compare objects:
        if (TypeSpec.OBJECT(a) && TypeSpec.OBJECT(b)) {
            
            // Get property names for comparing with:
            const aPropNames = Object.keys(a);
            const bPropNames = Object.keys(b);
            
            // Check fails if number of property names are differnt:
            if (aPropNames.length !== bPropNames.length) {
                return false;
            }

            // Recursively compare object properties:
            for (const propName of aPropNames) {
                if (!bPropNames.includes(propName) || !TypeSpec.isEqual(a[propName], b[propName])) {
                    return false
                }
            }

             // Returns TRUE if everything is "equal":
             return true;

        }

        // Otherwise compare primitive values:
        return a === b;

    }

}