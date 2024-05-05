// For handling errors thrown by type-spec classes:
export default class TypeSpecError extends Error {

    // Stores error "codes" as a static field: 
    static CODE = {
        "UNKNOWN":0,                // The specific nature of the error is not known
        "MISSING_PROPERTY":1,       // A property is missing that's needed to initalizae the instance of a type-spec with
        "INVALID_PROPERTY_TYPE":2,  // A property is bound to a value of an incorrect type when initializing an instance of a type-spec
        "UNSUPPORTED_PROPERTY":3,   // An instance of a type-spec is trying to be initialized with an unsupported property
        "INVALID_VALUE":4           // A value is of an incorrect type
    }

    // Used for looking up the code without constraining the value of the code - i.e. the error code doesn't have to be an index we are mapping to
    static ERROR_CODE_SET = new Set(Object.values(TypeSpecError.CODE));

    // Instance Fields
    _code;  // Stores error code for identifiying "type" of error 
   
    // CONSTRUCTOR :: STRING, NUMBER|VOID -> psedoTypeError
    constructor(message, code) {
        super(message ?? "Unknown Error");
        this.code = code ?? TypeSpecError.CODE.UNKNOWN;
    }

    /**
     * 
     *  Properties 
     * 
     */

    /*======*
     * code *
     *======*/

    // SETTER :: NUMBER -> VOID
    set code(code) {
        if (isNaN(code) || code === null || !TypeSpecError.ERROR_CODE_SET.has(code)) {
            throw new TypeSpecError("Unknown Error Code", TypeSpecError.CODE.INVALID_VALUE);
        }
        this._code = code;
    }

    // GETTER :: VOID -> NUMBER
    get code() {
        return this._code;
    }

    /**
     *
     *  Static Methods 
     * 
     */

    // :: STRING, STRING -> typeSpecError
    // For handling error when a property of of an instance is missing:
    static MISSING_PROP(typeName, propName) {
        return new TypeSpecError(`Property "${propName}" is missing from instance of TYPESPEC "${typeName}"`, TypeSpecError.CODE.MISSING_PROPERTY);
    }

    // :: STRING, STRING -> typeSpecError
    // For handling error when the property of an instance is not of the correct type:
    static INVALID_PROP(typeName, propName) {
        return new TypeSpecError(`Property "${propName}" is of incorrect type for instance of TYPESPEC "${typeName}"`, TypeSpecError.CODE.INVALID_PROPERTY_TYPE);
    }

    // :: STRING, STRING -> TypeSpecError
    // For handling error when the property of an instance if not supported by the given type:
    static UNSUPPORTED_PROP(typeName, propName) {
        return new TypeSpecError(`Property "${propName}" is not supported by TYPESPEC "${typeName}"`, TypeSpecError.CODE.UNSUPPORTED_PROPERTY);
    }

    // :: STRING, STRING -> typeSpecError
    // For handling error when a value is not of the given type:
    static INVALID_VALUE(valueName, typeName) {
        return new TypeSpecError(`Value "${valueName}" must be of type ${typeName}`, TypeSpecError.CODE.INVALID_VALUE);
    }

}