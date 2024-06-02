// Dependencies:
import TypeSpecOp from "../TypeSpecOp/index.js";                          // Base class we are extending from:
import TypeSpecError from "../TypeSpecError/index.js";                    // Error handling
import TypeSpecAsyncTransform from "../TypeSpecAsyncTransform/index.js"   // Defines asynchronous transforms between values

// Extends TypeSpecOp to suppport asynchronos operations:
export default class TypeSpecAsyncOp extends TypeSpecOp {

   // CONSTRUCTOR :: TYPESPEC, TYPESPEC -> this
   constructor(inputType, outputType) {
      super(inputType, outputType);
   }

   /**
    * 
    *  Instance Methods 
    * 
    */

   // :: STRING|[STRING]|FUNCTION, STRING|[STRING]|FUNCTION|VOID, FUNCTION|VOID -> PROMISE(OBJECT)
   // Stores asynchronous transform to be applied to result of operation:
   ontoResult(...args) {
      return this.applyTransform(args, TypeSpecAsyncTransform.ontoResult).addTo(this);
   }

   // :: STRING|[STRING]|FUNCTION, STRING|[STRING]|FUNCTION|VOID, FUNCTION|VOID -> PROMISE(OBJECT)
   // Stores asynchronous transfrom to be applied to the enviroment of an operation:
   ontoEnv(...args) { 
      return this.applyTransform(args, TypeSpecAsyncTransform.ontoEnv).addTo(this);
   }

   // @Override :: AsyncOP -> this
   // Combines this OP with another OP:
   // NOTE: Since transforms are stored by reference - changes to the orignal OP will be impacted by the composed OP:
   compose(asyncOp) {
      if (asyncOp instanceof TypeSpecOp) {
         this._transforms = this._transforms.concat(asyncOp.transforms);
         return this;
     }
     throw new TypeSpecError("Can only compose instance of TypeSpecAsyncOp with another instance of TypeSpecAsyncOp", TypeSpecError.CODE.INVALID_VALUE)
   }

   // @Override :: OBJECT, OBJECT|VOID -> PROMISE(OBJECT)
   // Applies asynchronous transforms to the promise of an "input value" using values from an "enviorment":
   async run(inputValue, env) {

      // Lift value from promise of inputValue
      const valueToTransform = await inputValue;

      // Check input value before processing transform:
      this.inputType.check(valueToTransform);

      // Perform transform using given shallow copies of the input value and enviroment to prevent side-effects:
      const result = await this._transforms.reduce(async (promise, transform) => {
         const [result, env] = await promise;
         return transform.process([{...result}, {...env}])
      }, Promise.resolve([{...valueToTransform}, {...env}]));

      // Create instance from result of transform:
      // NOTE: We reference result value by index since deconstructing doesn't seem to work when returning a PROMISE of an ARRAY:
      return this.outputType.create(result[0]);

   }

   /**
    * 
    * Static Methods 
    * 
    */

   // Static Factory Method :: TYPESPEC, TYPESPEC -> AsyncOP
   static init(inputType, outputType) {
      return new TypeSpecAsyncOp(inputType, outputType);
   }

}