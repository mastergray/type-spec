import TypeSpecError from "../TypeSpecError/index.js";

//  Implements a rudimentary "type system" that represents instance of a "type" as an  object literal with constrained properties:
export default class TypeSpec {

    // Instance Fields:
    _typeName;    // Store name of type
    _props = {};  // Store supported properties of type

    // CONSTRUCTOR :: STRING -> this
    constructor(typeName) {
        this.typeName = typeName;
    }

    /**
     * 
     *  Properteries 
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
    get props() {
        return this._props;
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


        this.props[name] = {
            "typeName":this.typeName,
            "check":pred,
            "required":defaultValue === undefined, // A property is "required" only if no default is given
            "defaultValue":defaultValue
        };

        return this;
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
            throw new TypeSpecError(`Must intialize instance of type-spec "${this.typeName}" using OBJECT`, TypeSpecError.CODE.INVALID_VALUE);
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

            // Bind vlaue to name of result if check is sucsseful, otherswise throw an error:
            if (definition.check(value) === true) {
                result[name] = value;
                return result;
            }

            // Otherwise throw an exception if check fails:
            throw TypeSpecError.INVALID_PROP(this.typeName, name);
          
        }, this.parentType !== undefined ? this.parentType.create(args) : {});
        // This works becasuse "create" ignores properties that aren't defined
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

    // Static Factory Method :: STRING -> typeSpec
    static init(typeName) {
        return new TypeSpec(typeName);
    }

    // :: * -> BOOL
    // Returns TRUE if value is type STRING, otherwise returns FALSE:
    static STRING(value) {
        return typeof(value) === "string";
    }    

    // :: * -> BOOL
    // Returns TRUE if value is type FUNCTION, otherwise returns FALSE:
    static FUNCTION(value) {
        return typeof(value) === "function";
    }

    // :: * -> BOOL
    // Returns TRUE if value is type OBJECT, otherwise returns FALSE: 
    static OBJECT(value) {
        return value !== null && typeof(value) === "object";
    }

}