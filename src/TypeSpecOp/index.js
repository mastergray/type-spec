// Dependencies:
import TypeSpec from "../TypeSpec/index.js";                    // Type checking
import TypeSpecError from "../TypeSpecError/index.js";          // Error handling
import TypeSpecTransform from "../TypeSpecTransform/index.js"   // Defines transforms between values

// Implements a type-spec "operation" as a the transform of one object instance into another object instace 
export default class TypeSpecOp {

    /* Instance Fields */

    _inputType;         // The "type" an object literal must be when passed as the input of an operation
    _outputType;        // The "type" of an object literal must be when returned as the output of this operation
    _transforms = [];   // Transfrorms which are applied to the input when an operation is "run"
 
    // CONSTRUCTOR :: TYPESPEC, TYPESPEC -> this
    constructor(inputType, outputType) {
        this.inputType = inputType;
        this.outputType = outputType;
    }

    /**
     * 
     *  Properties 
     * 
     */

    /*===========*
     * inputType *
     *===========*/

    // SETTER :: TYPESPEC -> VOID
    set inputType(inputType) {
        if (inputType instanceof TypeSpec) {
            this._inputType = inputType
        } else {
            throw new TypeSpecError(`Input type of TypeSpecOp must be an instance of TYPESPEC`, TypeSpecError.CODE.INVALID_VALUE);
        }
    }

    // GETTER :: VOID -> TYPESPEC
    get inputType() {
        return this._inputType;
    }
    
    /*============*
     * outputType *
     *============*/

    // SETTER :: TYPESPEC -> VOID
    set outputType(outputType) {
        if (outputType instanceof TypeSpec) {
            this._outputType = outputType
        } else {
            throw new TypeSpecError(`Output type of TypeSpecOp must be an instance of TYPESPEC`, TypeSpecError.CODE.INVALID_VALUE);
        }
    }
    
    // GETTER :: VOID -> TYPESPEC
    get outputType() {
        return this._outputType;
    }

    /**
     * 
     *  Lookups (GETTERs without SETTERs) 
     * 
     */


    // GETTER :: VOID -> [FUNCTION]
    get transforms () {
        return this._transforms;
    }
    
    /**
     * 
     *  Instace Methods 
     * 
     */

    // :: [*], ([*] -> *)
    // Compute signature from given array of arguments, and then applies those argument to a given function using that signature:
    applyTransform(args, fn) {

          // Get arguments and signature:
          const [a,b,c] = args;
          const signature = TypeSpecOp.signature(args);
  
          // Match signature to how we need to handle those arguments:
          // NOTE: We store transform in an TRANSFORM instance to avoid trapping prop with a closure - because closure can be expensive:
          switch(signature) {
  
              // Applies transform function to entire value:
              case "function":
                  return fn({fn:a})
  
              // Transforms a specific property of the output using the same property of input:
              case "string,function":
                  return fn({from:[a], to:a, fn:b})
  
              // Transforms entire value using a list of properties of the input:
              case "array,function":
                  return fn({from:a, fn:b});
  
              // Transforms a specific property of the output into a specific property of the input:
              case "string,string,function":
                  return fn({from:[a], to:b, fn:c})
                  
              // Transforms a list of specific input properties into a specific output property:
              case "array,string,function":
                  return fn({from:a, to:b, fn:c})
              
              // Unsupported signature throws an error:
              default:
                  throw new TypeSpecError(`Invalid signature for transforming value of operation`, TypeSpecError.CODE.INVALID_VALUE); 
          
          }

    }

    // :: STRING|[STRING]|FUNCTION, STRING|[STRING]|FUNCTION|VOID, FUNCTION|VOID -> OBJECT
    // Stores transform to be applied to result of operation:
    ontoResult(...args) {
        return this.applyTransform(args, TypeSpecTransform.ontoResult).addTo(this);
    }

    // :: STRING|[STRING]|FUNCTION, STRING|[STRING]|FUNCTION|VOID, FUNCTION|VOID -> OBJECT
    // Stores transfrom to be applied to the enviroment of an operation:
    ontoEnv(...args) { 
        return this.applyTransform(args, TypeSpecTransform.ontoEnv).addTo(this);
    }

    // :: OBJECT, OBJECT|VOID -> OBJECT
    // Applies transform to "toValue" using values from "fromValue"
    run(inputValue, env) {

        // Check input value before processing transform:
        this.inputType.check(inputValue);

        // Perform transform using given shallow copies of the input value and enviroment to prevent side-effects:
        const [result] = this._transforms.reduce(([result, env], transform) => {
           return transform.process([{...result}, {...env}])
        }, [{...inputValue}, {...env}]);

        // Create instance from result of transform:
        return this.outputType.create(result);

    }

    // :: STRING|[STRING]|FUNCTION, STRING|[STRING]|FUNCTION|VOID, FUNCTION|VOID -> OBJECT
    // Alias for "ontoResult" transform, or how we apply a transform to the "left" argument when running an op:
    left(...args) {
        return this.ontoResult(...args);
    }

     // :: STRING|[STRING]|FUNCTION, STRING|[STRING]|FUNCTION|VOID, FUNCTION|VOID -> OBJECT
    // Alias for "ontoEnv" transform, or how we apply a transform to the "right" argument when running an op:
    right(...args) {
        return this.ontoEnv(...args);
    }

    /**
     *
     *  Static Methods 
     * 
     */

    // Static Factory Method :: TYPESPEC, TYPESPEC -> OP
    static init(inputType, outputType) {
        return new TypeSpecOp(inputType, outputType);
    }

    // :: [*] -> [STRING]
    // Generates "signature" from an array of values
    // NOTE: This is used to overload our instance method "transform":
    static signature(val) {
        if (TypeSpec.ARRAY(val) === true) {
            return val.map(arg => {
                const type = typeof(arg);
                return type === "object" && Array.isArray(arg) === true ? "array" : type;
            }).join(',');
        } else {
            throw new TypeSpecError(`Can only compute a signature from an ARRAY of values`, TypeSpecError.CODE.INVALID_VALUE);
        }
    }

}