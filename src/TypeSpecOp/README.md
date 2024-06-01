###TypeSpecOp Class Documentation
The `TypeSpecOp` class implements a type-spec operation by transforming one object instance into another object instance. This class leverages well-defined input and output types, along with a series of transformations applied to the input when an operation is executed. 

### Constructor

#### `constructor(inputType: TypeSpec, outputType: TypeSpec)`
- **Parameters**:
  - `inputType`: A `TypeSpec` instance representing the type that the input object must conform to.
  - `outputType`: A `TypeSpec` instance representing the type that the output object must conform to.
- **Description**:
  - Initializes a new `TypeSpecOp` instance with specified input and output types.

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
  - `get transforms()`: Retrieves the list of transformation functions applied during the operation.

### Methods

#### `applyTransform(args: Array, fn: Function): any`
- **Parameters**:
  - `args`: An array of arguments to apply to the function.
  - `fn`: The function to apply the signature to.
- **Returns**: The result of applying the signature to the function.
- **Description**: Computes the signature from the given array of arguments and then applies those arguments to a given function using that signature. This method is used to manage different types of transformations.

#### `ontoResult(...args: any[]): Object`
- **Parameters**:
  - `args`: Arguments defining the transformation to be applied to the result of the operation.
- **Returns**: An object representing the transformation.
- **Description**: Stores a transformation to be applied to the result of the operation.

#### `ontoEnv(...args: any[]): Object`
- **Parameters**:
  - `args`: Arguments defining the transformation to be applied to the environment of the operation.
- **Returns**: An object representing the transformation.
- **Description**: Stores a transformation to be applied to the environment of the operation.

#### `left(...args: any[]): Object`
- **Parameters**:
  - `args`: Arguments defining the transformation to be applied to the left argument when running an operation.
- **Returns**: An object representing the transformation.
- **Description**: Alias for `ontoResult`, or how a transformation is applied to the left argument when running an operation.

#### `right(...args: any[]): Object`
- **Parameters**:
  - `args`: Arguments defining the transformation to be applied to the right argument when running an operation.
- **Returns**: An object representing the transformation.
- **Description**: Alias for `ontoEnv`, or how a transformation is applied to the right argument when running an operation.

#### `compose(op: TypeSpecOp): this`
- **Parameters**:
  - `op`: A `TypeSpecOp` instance to be composed with the current instance.
- **Returns**: The current `TypeSpecOp` instance.
- **Description**: Composes the current `TypeSpecOp` instance with another `TypeSpecOp` instance by concatenating their transformations. Note that transforms are stored by reference, so changes to the original `TypeSpecOp` will impact the composed `TypeSpecOp`.

#### `run(inputValue: Object, env?: Object): Object`
- **Parameters**:
  - `inputValue`: An object representing the input value to be transformed.
  - `env`: Optional; an object representing the environment in which the transformation occurs.
- **Returns**: The transformed output object.
- **Description**: Applies transformations to the input value using the specified environment, ensuring the input value conforms to the input type. The result is an object of the output type.

### Static Methods

#### `init(inputType: TypeSpec, outputType: TypeSpec): TypeSpecOp`
- **Parameters**:
  - `inputType`: A `TypeSpec` instance representing the type that the input object must conform to.
  - `outputType`: A `TypeSpec` instance representing the type that the output object must conform to.
- **Returns**: A new `TypeSpecOp` instance.
- **Description**: Factory method to create and initialize a new `TypeSpecOp` instance with specified input and output types.

#### `signature(val: Array): [string]`
- **Parameters**:
  - `val`: An array of values to generate a signature from.
- **Returns**: An array of strings representing the signature of the provided values.
- **Description**: Generates a "signature" from an array of values. This is used to overload the `applyTransform` method to handle different types of transformations.

### Examples

#### Example 1: Creating a Simple TypeSpecOp
```javascript
const inputType = new TypeSpec('InputType')
  .prop('name', TypeSpec.STRING)
  .prop('age', TypeSpec.UNSIGNED_INT);

const outputType = new TypeSpec('OutputType')
  .prop('fullName', TypeSpec.STRING)
  .prop('isAdult', TypeSpec.BOOL);

const op = new TypeSpecOp(inputType, outputType);

op.ontoResult('name', 'fullName', (name) => `Full Name: ${name}`)
  .ontoResult(['age'], 'isAdult', (age) => age >= 18);

const input = { name: 'John Doe', age: 25 };
const output = op.run(input);

console.log(output); // { fullName: 'Full Name: John Doe', isAdult: true }
```

#### Example 2: Handling Errors with TypeSpecOp
```javascript
try {
  const invalidInput = { name: 'John Doe', age: 'twenty-five' };
  op.run(invalidInput);
} catch (error) {
  if (error instanceof TypeSpecError) {
    console.error(error.message); // Outputs relevant error message
  }
}
```

#### Example 3: Composing TypeSpecOps
```javascript
const op1 = new TypeSpecOp(inputType, outputType)
  .ontoResult('name', 'fullName', (name) => `Full Name: ${name}`);

const op2 = new TypeSpecOp(outputType, outputType)
  .ontoResult('age', 'isAdult', (age) => age >= 18);

const composedOp = op1.compose(op2);

const input = { name: 'John Doe', age: 25 };
const output = composedOp.run(input);

console.log(output); // { fullName: 'Full Name: John Doe', isAdult: true }
```