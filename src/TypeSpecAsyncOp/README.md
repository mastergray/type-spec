## TypeSpecAsyncOp Class Documentation
The `TypeSpecAsyncOp` class extends `TypeSpecOp` to support asynchronous operations by transforming one object instance into another object instance asynchronously. This class leverages well-defined input and output types, along with a series of asynchronous transformations applied to the input when an operation is executed. This approach is suitable for dynamic environments like React-based web applications and RESTful APIs, especially when dealing with asynchronous data.

### Constructor

#### `constructor(inputType: TypeSpec, outputType: TypeSpec)`
- **Parameters**:
  - `inputType`: A `TypeSpec` instance representing the type that the input object must conform to.
  - `outputType`: A `TypeSpec` instance representing the type that the output object must conform to.
- **Description**:
  - Initializes a new `TypeSpecAsyncOp` instance with specified input and output types.

### Properties

#### `inputType`
- **Type**: `TypeSpec`
- **Accessors**:
  - `set inputType(inputType: TypeSpec)`: Sets the input type, verifying that it is an instance of `TypeSpec`.
  - `get inputType()`: Retrieves the current input type.

#### `outputType`
- **Type**: `TypeSpec`
- **Accessors**:
  - `set outputType(outputType: TypeSpec)`: Sets the output type, verifying that it is an instance of `TypeSpec`.
  - `get outputType()`: Retrieves the current output type.

#### `transforms`
- **Type**: `[Function]`
- **Accessor**:
  - `get transforms()`: Retrieves the list of asynchronous transformation functions applied during the operation.

### Methods

#### `applyTransform(args: Array, fn: Function): any`
- **Parameters**:
  - `args`: An array of arguments to apply to the function.
  - `fn`: The function to apply the signature to.
- **Returns**: The result of applying the signature to the function.
- **Description**: Computes the signature from the given array of arguments and then applies those arguments to a given function using that signature. This method is used to manage different types of transformations.

#### `ontoResult(...args: any[]): Promise<Object>`
- **Parameters**:
  - `args`: Arguments defining the transformation to be applied to the result of the operation.
- **Returns**: A promise that resolves to an object representing the transformation.
- **Description**: Stores an asynchronous transformation to be applied to the result of the operation.

#### `ontoEnv(...args: any[]): Promise<Object>`
- **Parameters**:
  - `args`: Arguments defining the transformation to be applied to the environment of the operation.
- **Returns**: A promise that resolves to an object representing the transformation.
- **Description**: Stores an asynchronous transformation to be applied to the environment of the operation.

#### `compose(op: TypeSpecOp): this`
- **Parameters**:
  - `op`: A `TypeSpecAysncOp` instance to be composed with the current instance.
- **Returns**: The current `TypeSpecAysncOp` instance.
- **Description**: Composes the current `TypeSpecAysncOp` instance with another `TypeSpecAysncOp` instance by concatenating their transformations. Note that transforms are stored by reference, so changes to the original `TypeSpecAysncOp` will impact the composed `TypeSpecAysncOp`.


#### `run(inputValue: Object, env?: Object): Promise<Object>`
- **Parameters**:
  - `inputValue`: An object representing the input value to be transformed.
  - `env`: Optional; an object representing the environment in which the transformation occurs.
- **Returns**: A promise that resolves to the transformed output object.
- **Description**: Applies asynchronous transformations to the input value using the specified environment, ensuring the input value conforms to the input type. The result is an object of the output type.

### Static Methods

#### `init(inputType: TypeSpec, outputType: TypeSpec): TypeSpecAsyncOp`
- **Parameters**:
  - `inputType`: A `TypeSpec` instance representing the type that the input object must conform to.
  - `outputType`: A `TypeSpec` instance representing the type that the output object must conform to.
- **Returns**: A new `TypeSpecAsyncOp` instance.
- **Description**: Factory method to create and initialize a new `TypeSpecAsyncOp` instance with specified input and output types.

### Examples

#### Example 1: Creating a Simple TypeSpecAsyncOp
```javascript
const inputType = new TypeSpec('InputType')
  .prop('name', TypeSpec.STRING)
  .prop('age', TypeSpec.UNSIGNED_INT);

const outputType = new TypeSpec('OutputType')
  .prop('fullName', TypeSpec.STRING)
  .prop('isAdult', TypeSpec.BOOL);

const op = new TypeSpecAsyncOp(inputType, outputType);

op.ontoResult('name', 'fullName', async (name) => `Full Name: ${name}`)
  .ontoResult(['age'], 'isAdult', async (age) => age >= 18);

const input = { name: 'John Doe', age: 25 };
op.run(input).then(output => console.log(output)); // { fullName: 'Full Name: John Doe', isAdult: true }
```

#### Example 2: Handling Errors with TypeSpecAsyncOp
```javascript
try {
  const invalidInput = { name: 'John Doe', age: 'twenty-five' };
  op.run(invalidInput).catch(error => {
    if (error instanceof TypeSpecError) {
      console.error(error.message); // Outputs relevant error message
    }
  });
} catch (error) {
  console.error("An unexpected error occurred:", error);
}
```