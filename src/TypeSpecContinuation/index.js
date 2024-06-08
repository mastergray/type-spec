// Implements a "continuation" as a series of functions we can apply to some value, where the next function in that series is either explicity called or the continuattion is terminated
export default class TypeSpecContinuation {

    // CONSTRUCTOR :: [(*, * -> *, * -> * -> VOID)] -> this
    constructor(steps) {
        this.steps = steps ?? []   // Functions we are applying to some value
    }

    /**
     * 
     *  Instance Methods
     * 
     */

    // :: (*, * -> *, * -> * -> VOID) -> this
    // Adds "step" function to continuation:
    step(fn) {
        this.steps.push(fn);
        return this;
    }

    // :: CONTINUATION -> this
    // Composes the step of a given continuation instance with this instance:
    chain(continuation) {
        this.steps = this.steps.concat(continuation.steps);
        return this;
    }

    // :: *, (* -> *) -> *
    // Applies steps of this continuation to a given value, otherwise runs given function if continuation is terminated:
    run(intialValue, onHalt) {

        let step = 0;             // Keeps track of step count
        let value = intialValue;  // Reference to value that steps are being applied to
        let halted = false;       // Determines if continuation has terminated or not          

        // How to process next step of continuation:
        const nextStep = (nextValue) => {
            if (!halted) {
                value = nextValue;
                step += 1;
            }
        }

        // How to handle terminated continuation:
        const haltStep = (haltValue) => {
            halted = true; 
            value = typeof(haltValue) === "function" 
                ? onHalt(haltValue)
                : haltValue
        }

        // Process each step of the continuation using a deferred function to avoid recursive stack overflow:
        const processStep = () => {
            if (step < this.steps.length && !halted) {
                this.steps[step](value, nextStep, haltStep);
                return () => processStep();
            }
            return value;
        };

        // Return processed value of continuation:
        return TypeSpecContinuation.trampoline(processStep)();
    
    }

     /**
     * 
     *  Static Methods
     *  
     */

    // Static method to create a new continuation
    static init(steps) {
        return new TypeSpecContinuation(steps);
     }
 
     // Implement a trampoline for preventing recursive stack overflow:
     static trampoline(fn) {
         return (...args) => {
             let result = fn(...args);
             while (typeof result === 'function') {
                 result = result();
             }
             return result;
         };
     }
 
 }