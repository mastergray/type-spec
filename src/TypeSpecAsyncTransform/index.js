// Dependencies:
import TypeSpecTransform from "../TypeSpecTransform/index.js";  // Base class we are extending from:
import TypeSpecError from "../TypeSpecError/index.js";          // Error handling
import TypeSpecAsyncOp from "../TypeSpecAsyncOp/index.js";      // OP checking

// Extends TypeSpecTransform to suppport asynchronous transforms:
export default class TypeSpecAsyncTransform extends TypeSpecTransform {

    // CONSTRUCTOR :: [STRING], STRING|VOID, ([*]|*, {OBJECT, OBJECT} -> *)
    constructor({fromProps, toProp, fn}) {
       super({fromProps, toProp, fn});
    }

    /**
     * 
     *  Instance Methods 
     * 
     */

    // @Override :: [OBJECT, OBJECT] -> PROMISE([OBJECT, OBJECT])
    // Defines a generic "transform" procedure for asynchronously transforming OP result:
    // NOTE: While it's possible to process synchronous transforms, this would create overhead by using unnecessary promises
    async processResult([result, env]) {

        // Compute value we are going to map to result:
        const toValue = await this.processValue(result, [result, env]);
        
        // An undefined "toProp" means we are returning the result of the transfrom function as the new result of the OP:
        if (this.toProp === undefined) {
            return [toValue, env];
        } 
        
        // Otherwise we bind the new value to the store "toProp" indentifier:
        result[this.toProp] = toValue;
        return [result, env];

    }

    // @Override :: [OBJECT, OBJECT] -> PROMISE([OBJECT, OBJECT])
    // Defines a generic "transform" procedure for asynchronously transforming OP enviroment:
    // NOTE: While it's possible to process synchronous transforms, this would create overhead by using unnecessary promises
    async processEnv([result, env]) {

        // Compute value we are going to map to result:
        const toValue = await this.processValue(env, [result, env]);

        // An undefined "toProp" means we are returning the result of the transfrom function as the new result of the OP:
        if (this.toProp === undefined) {
            return [result, toValue];
        } 
        
        // Otherwise we bind the new value to the store "toProp" indentifier:
        env[this.toProp] = toValue;
        return [result, env];

    }

    // @Override :: AsyncOP -> AsyncOP
    // Add this transform to an instance of TypeSpecAsyncOp:
    addTo(op) {
        
        // Adds this transform to an asynchronous OP:
        if (op instanceof TypeSpecAsyncOp) {
            op.transforms.push(this);
            return op;
        }

        // Throw error to enforce that only asynchronous transforms can be added to asynchronous operations:
        throw new TypeSpecError("Instance of TypeSpecAsyncTransform can only be added to instance of TypeSpecAsyncOp", TypeSpecError.CODE.INVALID_VALUE);
       
    }

    /**
     * 
     *  Static Methods 
     * 
     */

    // Static Factory Method :: STRING], STRING|VOID, ([*]|*, {OBJECT, OBJECT} -> *) -> AsyncTRANSFORM
    static init({fromProps, toProp, fn}) {
        return new TypeSpecAsyncTransform({fromProps, toProp, fn});
    }

    // :: {STRING|[STRING], STRING|VOID, ([*], {result, env} -> *)} -> AsyncTRANSFORM
    // Initailizes a transform for the "result" of an OP:
    static ontoResult({from, to, fn}) {
        
        // Initialize transform :
        const transform = TypeSpecAsyncTransform.init({
            "fromProps":from, 
            "toProp":to, 
            "fn":fn
        })
        
        // Set process and return transform:
        transform.process = transform.processResult;
        return transform;

    } 

    // :: {STRING|[STRING], STRING|VOID, ([*], {result, env} -> *)} -> AsyncTRANSFORM
    // Initialize a transform for the "enviroment" of an OP:
    static ontoEnv({from, to, fn}) {
        
        // Initialize transform :
        const transform = TypeSpecAsyncTransform.init({
            "fromProps":from, 
            "toProp":to, 
            "fn":fn
        })
        
        // Set process and return transform:
        transform.process = transform.processEnv;
        return transform;

    } 

}