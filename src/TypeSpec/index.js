// Dependencies:
import TypeSpecError from "../TypeSpecError/index.js"; // For handling errors throw by TypeSpec:

//  Implements a rudimentary "type system" that represents instance of a "type" as an  object literal with constrained properties:
export default class TypeSpec {

    /* Instance Fields */
    
    _typeName;      // Store name of type
    _props = {};    // Stores supported properties of type
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
        if (TypeSpec.NONEMPTY_STRING(typeName) === true) {
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
    // NOTE: This only returns properties for this type - it does not include parent properties:
    get props() {
        return this._props;
    }

    /*============*
     * parentType *
     *============*/

    // SETTER :: TYPESPEC|VOID -> VOID
    set parentType(parentType) {
        if (parentType !== undefined  && !(parentType instanceof TypeSpec)) {
            throw new TypeSpecError(`Parent type of "${this.typeName} must be an instance of TypeSpec`, TypeSpecError.CODE.INVALID_VALUE); 
        }
        this._parentType = parentType;

    }

    // GETTER :: VOID -> TYPESPEC|VOID
    get parentType() {
        return this._parentType;
    }

    /**
     * 
     *  Lookups (GETTERs without SETTERs)
     * 
     */

    // :: VOID -> SET(STRING)
    // Returns all property names as a set of STRINGs - including property names from the parent type:
    get propNames() {
        return this.parentType !== undefined 
            ? new Set([...Object.keys(this.props), ...this.parentType.propNames])
            : new Set(Object.keys(this.props));
    }

    /**
     * 
     *  Instance Methods 
     * 
     */

    // ::  name:STRING, constraint:(* -> BOOL)|TYPESPEC, defaultValue:*|VOID -> this 
    // Binds name to predicate or TYPESPEC to check property of type instance with
    // NOTE: Optional "defaultValue" is used when property is not provided when creating instance of type:
    prop(name, constraint, defaultValue) {

        // Ensure name is STRING:
        if (TypeSpec.STRING(name) === false) {
            throw TypeSpecError.INVALID_VALUE("Property Name", "STRING");
        }

        // Use TYPSPEC check method as predicate if constraint is TYPSPEC
        const pred = constraint instanceof TypeSpec
            ? (val) => constraint.isOf(val)
            : constraint;
 
        // Ensure predicate is a FUNCTION:
        if (TypeSpec.FUNCTION(pred) === false) {
            throw new TypeSpecError(`Check for property "${name} of TYPE "${this.typeName}" must be either a FUNCTION or TYPESPEC`, TypeSpecError.CODE.INVALID_PROPERTY_TYPE);
        }

        // Check to see if this property has already been defined:
        if (this.props[name] !== undefined && this.props[name].typeName === this.typeName) {
            throw new TypeSpecError(`Property "${name}" has already been defined for type "${this.typeName}"`, TypeSpecError.CODE.INVALID_PROPERTY_TYPE);
        }

        // Ensure default value is valid for this property:
        if (defaultValue !== undefined && pred(defaultValue) === false) {
            throw new TypeSpecError("Default value is not valid for given predicate", TypeSpecError.CODE.INVALID_VALUE);
        }

        // Add new property "definition" of type:
        this._props = Object.defineProperty(this.props, name, {
            "get":() => ({
                "typeName":this.typeName,              // This is used to determine if we can overwrite the property or not
                "check":pred,                          // The function we are using to validate with
                "required":defaultValue === undefined, // A property is "required" only if no default is given
                "defaultValue":defaultValue            // What to use if no value is given at initialization
            }),
            // This is so we can't ovewrite the property definition once it's defined:
            "set":() => {
                throw new TypeSpecError(`Property "${name}" has already been defined for type "${this.typeName}"`, TypeSpecError.CODE.INVALID_PROPERTY_TYPE);
            },
            "configurable":false,
            "enumerable":true
        });

        // Returns itself so call is chaninable:
        return this;

    }

    // :: STRING, * -> this
    // Set explicit value for property that's immutable:
    constant(name, value) {
        return this.prop(name, arg=> TypeSpec.isEqual(value, arg), value);
    }

    // :: STRING -> OBJECT
    // Return prop definition by name:
    // NOTE: This will throw an exception if the the property definition can't be found:
    propDefinition(propName) {
        
        // Check for property definition in stored props:
        if (this.props[propName] !== undefined) {
            return this.props[propName];
        }

        // Check fro property definition in parent:
        if (this.parentType !== undefined) {
            return this.parentType.propDefinition(propName)
        }

        // Otherwise throw an error:
        throw TypeSpecError.MISSING_PROP(this.typeName, propName);

    }

    // :: OBJECT -> OBJECT
    // Returns given value if valid for stored props - otherwise throws an error
    check(instance) {
      
        // Ensure instance we are checking is an OBJECT:
        if (TypeSpec.OBJECT(instance) === false || instance instanceof TypeSpec) {
            throw new TypeSpecError(`Must check instance of TYPESPEC "${this.typeName}" using OBJECT`, TypeSpecError.CODE.INVALID_VALUE);
        }

        // Stores names so we can insure instance we checking only includes all properties of a type
        const instanceNames = []
        const propNames = this.propNames;

        // Iterate through instance properties to ensure they're valid:
        for (const [name, value] of Object.entries(instance)) {
      
            // Check if instance property is a supported property of this type:
            if (propNames.has(name) === false) {
                throw TypeSpecError.UNSUPPORTED_PROP(this.typeName, name);
            }

            // Check if value of instance is valid:
            if (this.propDefinition(name).check(value) === false) {
                throw new TypeSpecError(`Value of "${value}" of property "${name}" failed check for type "${this.typeName}"`, TypeSpecError.CODE.INVALID_VALUE);
            }

            // Add valid property to check against before returning validated instance:
            instanceNames.push(name);

        } 

        // Check to make sure all properties have been validated:
        if (instanceNames.length !== propNames.size) {
            throw new TypeSpecError(`Only the properties of "${instanceNames.join()}" were provided when checking this instance of "${this.typeName}"`, TypeSpecError.CODE.MISSING_PROPERTY);
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

        // Initialize instance using stored property definitions:
        const instance = Array.from(this.propNames).reduce((result, propName) => {

            // Value we are checking
            const value = args[propName];
            
            // Definition that we checking the value against:
            const definition = this.propDefinition(propName);

             // Handle unset properties with "default" values:
             if (definition.required === false && value === undefined) {
                result[propName] =  definition.defaultValue;
                return result;
            }

            // Throw error if property is missing from initializer:
            if (definition.required === true && value === undefined) {
                throw TypeSpecError.MISSING_PROP(this.typeName, propName);
            }

            // Bind value to name of result if check is sucsseful, otherswise throw an error:
            if (definition.check(value) === true) {
                result[propName] = value;
                return result;
            }

            // Otherwise throw an exception if check fails:
            throw new TypeSpecError(`Value of "${value}" for property "${propName}" failed check for type "${this.typeName}"`, TypeSpecError.CODE.INVALID_VALUE);

        }, {});

        // Returns instance as frozen object to help reinforce immutability: 
        return Object.freeze(instance);

    }

    // :: OBJECT, OBJECT -> OBJECT
    // Updates properties of instance
    // NOTE: This is to avoid mutation and encourage immutability:
    update(instance, newProps) {

        // Create new object to store updated properties in:
        const updatedInstance = {};

        // Iterate over property names for type definition:
        for (const propName of this.propNames) {

            // See if we should use a new value or the existing instance value:
            const value = newProps[propName] !== undefined 
                ? newProps[propName]
                : instance[propName];
              
            // Ensure value is valid before storing, otherwise throw an excpetion if the check fails: 
            if (this.propDefinition(propName).check(value) === true) {
                updatedInstance[propName] = value;
            } else {
                throw TypeSpecError.INVALID_PROP(this.typeName, propName);
            }

        }

        // Return frozen instance to encourage immutabilitiy:
        return Object.freeze(updatedInstance)

    }

    // :: * -> BOOL
    // Returns TRUE if value "is of" this instance of TYPESPEC
    isOf(value) {
        try {
            this.check(value);
            return true;
        } catch (err) {
            return false;
        }
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
    // Returns TRUE if value is a BOOL, otherwise returns FALSE:
    static BOOL(value) {
        return typeof(value) === 'boolean';
    }

    // :: * -> BOOL
    // Return TRUE if value is UNDEFINED, otherwise retuns FALSE:
    static VOID(value) {
        return typeof value === 'undefined';
    }

    // :: * -> BOOL 
    // Returns TRUE is value is NULL, otherwise returns FALSE:
    static NOTHING(value) {
        return value === null;
    }

    // :: * -> BOOL
    // Returns TRUE if value is type STRING, otherwise returns FALSE:
    static STRING(value) {
        return typeof(value) === "string";
    }
    
    // :: * -> BOOL
    // Returns TRUE if value is type STRING, but is more than just whitespace - otherwise returns FALSE:
    static NONEMPTY_STRING(value) {
        return TypeSpec.STRING(value) && value.trim().length > 0;
    }

    // :: * -> BOOL
    // Returns TRUE if value is type NUMBER, otherwise returns FALSE:
    static NUMBER(value) {
        return typeof(value) === "number";
    }

    // :: * -> BOOL
    // Returns TURE if value is an integer, otherwise returns false:
    static INT(value) {
        return Number.isInteger(value);
    }

    // :: * -> BOOL
    // Returns TRUE if value is a non-negative integer:
    static UNSIGNED_INT(value) {
        return TypeSpec.INT(value) && value >= 0;
    }

    // :: * -> BOOL
    // Returns TRUE if value is type FUNCTION, otherwise returns FALSE:
    static FUNCTION(value) {
        return typeof(value) === "function";
    }

    // :: * -> BOOL
    // Returns TRUE if value is type OBJECT, otherwise returns FALSE: 
    static OBJECT(value) {
        return value !== null && typeof(value) === 'object' && !Array.isArray(value);
    }

    // :: * -> BOOL
    // Returns TRUE if value is an ARRAY, otherwise returns FALSE:
    static ARRAY(value) {
        return Array.isArray(value);
    }

    // :: TYPESPEC|(* -> BOOL), BOOL|VOID -> ARRAY -> BOOL
    // Returns function that applies to an array for checking each element of that array with:
    // NOTE: Second argument allows empty array to pass check
    static ARRAY_OF(constraint, allowEmpty) {
        if (constraint instanceof TypeSpec || TypeSpec.FUNCTION(constraint) === true) {
            return (arr) => {
                if (TypeSpec.ARRAY(arr) === true ) {
                    const check = constraint instanceof TypeSpec
                        ? (val) => constraint.check(val) 
                        : constraint
                    return allowEmpty === true & arr.length === 0
                        ? true 
                        : arr.every(check);
                } 
                throw new TypeSpecError(`ARRAY_OF can only be applied to an ARRAY`, TypeSpecError.CODE.INVALID_VALUE);
            }
        }
        throw new TypeSpecError(`ARRAY_OF can only use check from a FUNCTION or an instance of TYPESPEC`, TypeSpecError.CODE.INVALID_VALUE);
    }

    // :: [*] -> * -> BOOL
    // Checks if a value is a member of the given array:
    // NOTE: Check is only guantreed for primitive values:
    static EITHER(arr) {
        if (TypeSpec.ARRAY(arr) === true) {
            return (val) => {
                for (const elem of arr) {
                    if (elem instanceof TypeSpec) {
                        if (elem.isOf(val) === true) {
                            return true;
                        }
                    }
                    if (TypeSpec.isEqual(elem, val)) {
                        return true;
                    }
                }
                return false;
            }
        }
        throw new TypeSpecError(`EITHER can only be applied to an ARRAY`, TypeSpecError.CODE.INVALID_VALUE);
    }

    // Returns TRUE if both values are equal, otherwise returns FALSE:
    // NOTE: This is restricted to equality between primitive values, OBJECTs, ARRAYs of primitive values, and ARRAYs of OBJECTs:
    static isEqual(a,b) {

        // Use a simple array as a queue
        const queue = [[a, b]];

        while (queue.length) {

            // Dequeue the first pair of values
            const [a, b] = queue.shift();

            // If the values are strictly equal, they are considered equal
            if (a === b) continue;

            // If the types are different, the values are not equal
            const typeA = typeof a;
            const typeB = typeof b;
            if (typeA !== typeB) return false;

            if (typeA === 'object') {
                if (a === null || b === null) return false; // One of them is null

                // Check if both values are arrays
                const isArrayA = Array.isArray(a);
                const isArrayB = Array.isArray(b);

                // If one is an array and the other is not, they are not equal
                if (isArrayA !== isArrayB) return false;

                if (isArrayA && isArrayB) {
                    // Compare array lengths
                    if (a.length !== b.length) return false;

                    // Enqueue each pair of elements for comparison
                    for (let i = 0; i < a.length; i++) {
                        queue.push([a[i], b[i]]);
                    }
                } else {
                    // Compare objects
                    const aPropNames = Object.keys(a);
                    const bPropNames = new Set(Object.keys(b));

                    // If objects have different numbers of properties, they are not equal
                    if (aPropNames.length !== bPropNames.size) return false;

                    // Enqueue each pair of property values for comparison
                    for (const propName of aPropNames) {
                        if (!bPropNames.has(propName)) return false;
                        queue.push([a[propName], b[propName]]);
                    }
                }
            } else {
                // For primitive types, if they are not strictly equal, return false
                return false;
            }
        }

        // If all comparisons are equal, return true
        return true;
    }
 
}