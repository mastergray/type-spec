// Dependencies:
import TypeSpec from "../TypeSpec/index.js";             // Type checking
import TypeSpecError from "../TypeSpecError/index.js";   // Error handling
import TypeSpecOp from "../TypeSpecTransform/index.js"   // OP Checking
import TypeSpecAsyncOp from "../TypeSpecTransform/index.js"   // OP Checking

// Allows both synchronus and asynchronous operations to be applied to some value
export default class TypeSpecProc {

    /* Instance Fields */

    _ops;   // Stores OPs to apply to some value

    // CONSTRUCTOR :: [OP|AsyncOP]|VOID -> this
    constructor(ops) {
        this.ops = ops ?? [];
    }

    /**
     * 
     * Properties
     *  
     */

    /*=====*
     * ops *
     *=====*/

    // SETTER :: [VOID|OP|AsyncOP] -> VOID
    set ops(ops) {
        if (TypeSpec.ARRAY(ops) === true && (ops.length === 0 || ops.every(TypeSpecProc.isOP))) {
            this._ops = ops;
        } else {
            throw new TypeSpecError("OPs of TypeSpecProc must be an emtpy ARRAY or an ARRAY of OPs", TypeSpecError.CODE.INVALID_VALUE);
        } 
     }

    // GETTER :: VOID -> [VOID|OP|AsyncOP]
    get ops() {
        return this._ops;
    }

    /**
     * 
     *  Instance Methods
     * 
     */

    // :: OP|AsyncOP, VOID|OBJECT ->  this
    // Add OP with optional args to apply to some value when PROC calls "run":
    op(op, args) {

        // Ensure we are either adding an OP or AsyncOP:
        if (TypeSpecProc.isOP(op) === true) {
            this.ops.push(async (state) => await op.run(state, args));
            return this;
        }

        // Otherwise throw an error:
        throw new TypeSpecError("OP of TypeSpecProc must be an instance of TypeSpecOp", TypeSpecError.CODE.INVALID_VALUE);
    
    }

    // :: PROC -> this
    // Combines the OPs of the given PROC with the OPs of this PROC:
    compose(proc) {
        if (TypeSpecProc.isPROC(proc) === true) {
            this._ops = this._ops.concat(proc.ops);
            return this;
        }
        throw new TypeSpecError("Can only compose instance of TypeSpecProc with another instance of TypeSpecProc", TypeSpecError.CODE.INVALID_VALUE)
    }

    // OBJECT|PROMISE(OBJECT) -> PROMISE(OBJECT)
    // Applies stored OPs to some value:
    // NOTE: Because OPs are required to return a specific type of value, applying OPs to some value effectively "empties the queue" of OPs so we can use the same PROC instance regardless of the type of value an OP requires:
    async run(state) {
        
        let result = state instanceof Promise 
            ? await state 
            : state;

        if (TypeSpec.OBJECT(result) === true) {
            
            // Make shallow copy of value to enforce immutability:
            result = {...state};
  
            // Apply every OP to value:
            while (this.ops.length > 0) {
                result = await this.ops.shift()(result);
            }

            // Return PROMISE of value when all OPs have been applied:
            return result;
        }

        // ...Otherwise throw an error:
        throw new TypeSpecError("TypeSpecProc can only be applied to an OBJECT", TypeSpecError.CODE.INVALID_VALUE);

    }

    /**
     * 
     *  Static Methods 
     * 
     */

    // Static Factory Method ::  [OP|AsyncOP]|VOID -> PROC
    static init(ops) {
        return new TypeSpecProc(ops);
    }

    // :: * -> BOOL
    // Returns BOOL for if OP is instance of TypeSpecOp or TypeSpecAsyncOp:
    // NOTE: OP checking resorts to duck typing because Javascript...
    static isOP(op) {
        return op instanceof TypeSpecOp || op.constructor.name === "TypeSpecOp" || op.constructor.name === "TypeSpecAsyncOp";
    }

     // :: * -> BOOL
    // Returns BOOL for if OP is instance of TypeSpecOp or TypeSpecAsyncOp:
    // NOTE: PROC checking resorts to duck typing because Javascript...
    static isPROC(proc) {
        return proc instanceof TypeSpecProc || proc.constructor.name === "TypeSpecProc";
    }

}