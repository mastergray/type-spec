### TypeSpecProc Class Documentation

The `TypeSpecProc` class allows both synchronous and asynchronous operations to be applied to a value. It provides a mechanism to sequentially apply a series of operations, which can be a mix of synchronous and asynchronous transformations, to an input value.

### Constructor

#### `constructor(ops: Array<TypeSpecOp | TypeSpecAsyncOp> = [])`
- **Parameters**:
  - `ops`: An array of `TypeSpecOp` or `TypeSpecAsyncOp` instances representing the operations to apply.
- **Description**:
  - Initializes a new `TypeSpecProc` instance with an optional array of operations.

### Properties

#### `ops`
- **Type**: `Array<TypeSpecOp | TypeSpecAsyncOp>`
- **Accessors**:
  - `set ops(ops: Array<TypeSpecOp | TypeSpecAsyncOp>)`: Validates and sets the operations to apply.
  - `get ops()`: Retrieves the current list of operations.

### Methods

#### `op(op: TypeSpecOp | TypeSpecAsyncOp, args?: Object): this`
- **Parameters**:
  - `op`: An instance of `TypeSpecOp` or `TypeSpecAsyncOp` to add to the list of operations.
  - `args`: Optional; arguments to apply to the operation when it is run.
- **Returns**: The `TypeSpecProc` instance for chaining.
- **Description**: Adds an operation with optional arguments to the list of operations to apply when the `run` method is called.

#### `compose(proc: TypeSpecProc): this`
- **Parameters**:
  - `proc`: An instance of `TypeSpecProc` to be composed with the current instance.
- **Returns**: The current `TypeSpecProc` instance for chaining.
- **Description**: Combines the operations of the provided `TypeSpecProc` with the current instance's operations. Note that operations are stored by reference, so changes to the original `TypeSpecProc` will impact the composed `TypeSpecProc`.

#### `run(state: Object | Promise<Object>): Promise<Object>`
- **Parameters**:
  - `state`: An object or a promise that resolves to an object representing the initial state to transform.
- **Returns**: A promise that resolves to the transformed output object.
- **Description**: Applies the stored operations to the initial state. If the state is a promise, it waits for the promise to resolve. The method applies each operation sequentially and returns a promise that resolves to the final transformed object.

### Static Methods

#### `init(ops: Array<TypeSpecOp | TypeSpecAsyncOp> = []): TypeSpecProc`
- **Parameters**:
  - `ops`: An array of `TypeSpecOp` or `TypeSpecAsyncOp` instances representing the operations to apply.
- **Returns**: A new `TypeSpecProc` instance.
- **Description**: Factory method to create and initialize a new `TypeSpecProc` instance with an optional array of operations.

#### `isOP(op: any): boolean`
- **Parameters**:
  - `op`: The object to check.
- **Returns**: `true` if the object is an instance of `TypeSpecOp` or `TypeSpecAsyncOp`, otherwise `false`.
- **Description**: Checks if the provided object is an instance of `TypeSpecOp` or `TypeSpecAsyncOp`. This method resorts to duck typing due to JavaScript's dynamic nature.

#### `isPROC(proc: any): boolean`
- **Parameters**:
  - `proc`: The object to check.
- **Returns**: `true` if the object is an instance of `TypeSpecProc`, otherwise `false`.
- **Description**: Checks if the provided object is an instance of `TypeSpecProc`. This method resorts to duck typing due to JavaScript's dynamic nature.

### Examples

#### Example 1: Creating and Running a TypeSpecProc with Synchronous Operations
```javascript
const inputType = new TypeSpec('InputType')
  .prop('name', TypeSpec.STRING)
  .prop('age', TypeSpec.UNSIGNED_INT);

const outputType = new TypeSpec('OutputType')
  .prop('description', TypeSpec.STRING);

const op1 = new TypeSpecOp(inputType, outputType);
op1.ontoResult(['name', 'age'], 'description', ([name, age]) => `${name} is ${age} years old.`);

const proc = new TypeSpecProc();
proc.op(op1);

const input = { name: 'John', age: 25 };
proc.run(input).then(output => console.log(output)); // { description: 'John is 25 years old.' }
```

#### Example 2: Creating and Running a TypeSpecProc with Asynchronous Operations
```javascript
const asyncTransform = new TypeSpecAsyncTransform({
  fromProps: ['name', 'age'],
  toProp: 'description',
  fn: async ([name, age]) => `${name} is ${age} years old.`
});

const inputType = new TypeSpec('InputType')
  .prop('name', TypeSpec.STRING)
  .prop('age', TypeSpec.UNSIGNED_INT);

const outputType = new TypeSpec('OutputType')
  .prop('description', TypeSpec.STRING);

const asyncOp = new TypeSpecAsyncOp(inputType, outputType);
asyncTransform.addTo(asyncOp);

const proc = new TypeSpecProc();
proc.op(asyncOp);

const input = { name: 'John', age: 25 };
proc.run(input).then(output => console.log(output)); // { description: 'John is 25 years old.' }
```

This documentation should provide a clear and comprehensive guide to the `TypeSpecProc` class, making it easier to understand and utilize its capabilities effectively.