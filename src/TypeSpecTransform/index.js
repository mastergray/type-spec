// Dependencies:
import TypeSpec from "../TypeSpec/index.js";             // Type checking
import TypeSpecError from "../TypeSpecError/index.js";   // Error handling

// Establishes how we can define a transform used by TypeSpecOp to transfrom one value into another:
export default class TypeSpecTransform {

    /* Instance Fields */

    _fromProps;    // Properties we are mapping from
    _toProp;       // Property we are mapping to 
    _fn;           // How we are mapping those properties
    _process;      // How we are applying values to the transform 

    // CONSTRUCTOR :: [STRING], STRING|VOID, ([*]|*, {OBJECT, OBJECT} -> *)
    constructor({fromProps, toProp, fn}) {
        this.fromProps = fromProps;
        this.toProp = toProp;
        this.fn = fn;
    }

    /**
     * 
     *  Properties 
     * 
     */

    /*===========*
     * fromProps *
     *===========*/

    // SETTER :: VOID|[STRING] -> VOID
    set fromProps(fromProps) {
        if (TypeSpec.VOID(fromProps) === true || (TypeSpec.ARRAY(fromProps) === true && fromProps.every(TypeSpec.STRING))) {
            this._fromProps = fromProps;
        } else {
            throw new TypeSpecError(`Properties to map from must either be UNDEFINED or an ARRAY of STRING`, TypeSpecError.CODE.INVALID_VALUE); 
        }
    }

    // GETTER :: VOID -> [STRING]|VOID
    get fromProps() {
        return this._fromProps;
    }

    /*========*
     * toProp *
     *========*/

    // SETTER :: VOID|STRING -> VOID
    set toProp(toProp) {
        if (TypeSpec.VOID(toProp) === true || TypeSpec.STRING(toProp) === true) {
            this._toProp = toProp;
        } else {
            throw new TypeSpecError(`Property to map to must be a STRING or UNDEFINED`, TypeSpecError.CODE.INVALID_VALUE); 
        }
    }

    // GETTER :: VOID -> STRING|VOID
    get toProp() {
        return this._toProp;
    }

    /*====*
     * fn *
     *====*/

    // SETTER :: FUNCTION|VOID -> VOID
    // If no function is set, defaults to an "identity function":
    set fn(fn) {
        if (TypeSpec.VOID(fn) === true) {
            this._fn = x => x;
        } else if (TypeSpec.FUNCTION(fn) === true) {
            this._fn = fn;
        } else {
            throw new TypeSpecError(`Transform function must be a FUNCTION or UNDEFINED`, TypeSpecError.CODE.INVALID_VALUE); 
        }
    }

    // GETTER :: VOID -> FUNCTION|VOID
    get fn() {
        return this._fn;
    }

    /*=========*
     * process *
     *=========*/

    // SETTER :: ([OBJECT, OBJECT] -> [OBJECT, OBJECT]) -> VOID
    set process(process) {
        if (TypeSpec.FUNCTION(process) === true) {
            this._process = process; 
        } else {
            throw new TypeSpecError(`Transform process must be a FUNCTION`, TypeSpecError.CODE.INVALID_VALUE);
        }
    }

    // GETTER :: VOID -> [OBJECT, OBJECT] -> [OBJECT, OBJECT])
    get process() {
        return this._process;
    }

    /**
     * 
     *  Instace Methods 
     * 
     */

    // :: OBJECT, [OBJECT, OBJECT] -> OBJECT
    // Define a generic "transform" procedure for mapping specific values to specfic properties of a value:
    // NOTE: If "fromProps" are not provided, then transform function is applied only to result and enviorment:
    processValue(value, [result, env]) {

        // If "fromProps" is an array:
        if (TypeSpec.ARRAY(this.fromProps) === true) {

            // Determine fromValue using "fromProps" of value:
            const fromValue = this.fromProps.map(prop=>value[prop]);

            // Compute new value we are mapping using from value, result, and enviorment:
            return this.fn(fromValue.length === 1 ? fromValue[0] : fromValue, [result, env]);

        }

        // ...otherwise the transfrom function is applied to the result and enviorment directly:
        return this._fn([result, env]);
            
    }
    
    // :: [OBJECT, OBJECT] -> [OBJECT, OBJECT]
    // Defines a generic "transform" procedure for transforming OP result:
    processResult([result, env]) {
            
        // Compute value we are going to map to result:
        const toValue = this.processValue(result, [result, env]);
   
        // An undefined "toProp" means we are returning the result of the transfrom function as the new result of the OP:
        if (this.toProp === undefined) {
            return [toValue, env];
        } 
        
        // Otherwise we bind the new value to the store "toProp" indentifier:
        result[this.toProp] = toValue;
        return [result, env];

    }

    // :: [OBJECT, OBJECT] -> [OBJECT, OBJECT]
    // Defines a generic "transform" procedure for transforming OP enviroment:
    processEnv([result, env]) {
            
        // Compute value we are going to map to result:
        const toValue = this.processValue(env, [result, env]);

        // An undefined "toProp" means we are returning the result of the transfrom function as the new result of the OP:
        if (this.toProp === undefined) {
            return [result, toValue];
        } 
        
        // Otherwise we bind the new value to the store "toProp" indentifier:
        env[this.toProp] = toValue;
        return [result, env];

    }

    // :: OP -> OP
    // Add this transform to an instance of TypeSpecOp:
    addTo(op) {
        op.transforms.push(this);
        return op;
    }

    /**
     * 
     *  Static Methods 
     * 
     */

    // Static Factory Method :: STRING], STRING|VOID, ([*]|*, {OBJECT, OBJECT} -> *)
    static init({fromProps, toProp, fn}) {
        return new TypeSpecTransform({fromProps, toProp, fn});
    }

    // :: {STRING|[STRING], STRING|VOID, ([*], {result, env} -> *)} -> TRANSFORM
    // Initailizes a transform for the "result" of an OP:
    static ontoResult({from, to, fn}) {
        // Initialize transform :
        const transform = TypeSpecTransform.init({
            "fromProps":from, 
            "toProp":to, 
            "fn":fn
        })
        // Set process and return transform:
        transform.process = transform.processResult;
        return transform;
    } 

    // :: {STRING|[STRING], STRING|VOID, ([*], {result, env} -> *)} -> TRANSFORM
    // Initialize a transform for the "enviroment" of an OP:
    static ontoEnv({from, to, fn}) {
        // Initialize transform :
        const transform = TypeSpecTransform.init({
            "fromProps":from, 
            "toProp":to, 
            "fn":fn
        })
        // Set process and return transform:
        transform.process = transform.processEnv;
        return transform;
    } 

}