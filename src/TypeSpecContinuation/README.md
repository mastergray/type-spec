## TypeSpecContinuation Class Documentation
The `TypeSpecContinuation` class provides a way to define a sequence of functions (steps) that can be applied to a value in order. The continuation can be halted at any step, and a custom function can be executed when the continuation is terminated. The class also includes a trampoline mechanism to handle deep recursions without causing a stack overflow.

### Constructor

#### `constructor(steps?: Array<Function>)`
- **Parameters**:
  - `steps`: An optional array of functions representing the steps to be applied to some value.
- **Description**:
  - Initializes a new `TypeSpecContinuation` instance with an optional series of functions.

### Instance Methods

#### `step(fn: Function): TypeSpecContinuation`
- **Parameters**:
  - `fn`: A function to be added to the continuation steps.
- **Returns**: The `TypeSpecContinuation` instance, allowing for method chaining.
- **Description**: Adds a "step" function to the continuation.

#### `chain(continuation: TypeSpecContinuation): TypeSpecContinuation`
- **Parameters**:
  - `continuation`: Another `TypeSpecContinuation` instance whose steps are to be composed with the current instance.
- **Returns**: The `TypeSpecContinuation` instance, allowing for method chaining.
- **Description**: Composes the steps of the given continuation instance with the current instance.

#### `run(initialValue: any, onHalt: Function): any`
- **Parameters**:
  - `initialValue`: The initial value to which the continuation steps will be applied.
  - `onHalt`: A function to be run if the continuation is terminated.
- **Returns**: The final value after all steps have been applied, or the result of the `onHalt` function if the continuation is terminated.
- **Description**: Applies the steps of this continuation to the given value. If the continuation is terminated, the `onHalt` function is run.

### Static Methods

#### `init(steps?: Array<Function>): TypeSpecContinuation`
- **Parameters**:
  - `steps`: An optional array of functions representing the steps to be applied to some value.
- **Returns**: A new `TypeSpecContinuation` instance.
- **Description**: Factory method to create and initialize a new `TypeSpecContinuation` instance with the specified steps.

#### `trampoline(fn: Function): Function`
- **Parameters**:
  - `fn`: A function that may return another function, creating a recursive loop.
- **Returns**: A function that processes the recursive calls without causing a stack overflow.
- **Description**: Implements a trampoline to prevent recursive stack overflow by continuously calling the returned function until a non-function value is obtained.

### Example Usage

Here's an example of how to use the `TypeSpecContinuation` class to define and run a continuation with multiple steps.

```javascript
// Define a continuation with multiple steps
const continuation = new TypeSpecContinuation()
    .step((value, next, halt) => {
        console.log(`Step 1: ${value}`);
        next(value + 1);
    })
    .step((value, next, halt) => {
        console.log(`Step 2: ${value}`);
        if (value < 3) {
            next(value + 1);
        } else {
            halt('Terminating at step 2');
        }
    })
    .step((value, next, halt) => {
        console.log(`Step 3: ${value}`);
        next(value + 1);
    });

// Run the continuation with an initial value and a halt function
const result = continuation.run(1, (haltValue) => {
    console.log(`Halted: ${haltValue}`);
    return `Halted with value: ${haltValue}`;
});

console.log(`Result: ${result}`);

// Output:
// Step 1: 1
// Step 2: 2
// Step 1: 3
// Step 2: 4
// Halted: Terminating at step 2
// Result: Halted with value: Terminating at step 2
```