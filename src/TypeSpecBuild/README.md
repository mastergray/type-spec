## TypeSpecBuild Class Documentation
The `TypeSpecBuild` class creates an optimized instance of `TypeSpec` by using precomputed functions for checking, creating, and updating instances of `TypeSpec`. This class enhances performance by avoiding repeated computations and validations, making it efficient for large-scale applications.

### Constructor

#### `constructor(typeName: string, props: { [key: string]: Object })`
- **Parameters**:
  - `typeName`: A string representing the name of the type.
  - `props`: An object where keys are property names and values are property definitions, including validation functions.
- **Description**:
  - Initializes a new `TypeSpecBuild` instance with a specified type name and precomputed functions for checking and creating instances.

### Properties

#### `create`
- **Type**: `Function`
- **Accessors**:
  - `set create(create: Function)`: Validates and sets the precomputed create function.
  - `get create()`: Retrieves the precomputed create function.
- **Description**:
  - The `create` function is responsible for creating instances of the type defined by the `TypeSpec`. It ensures that all properties are validated and set correctly.

#### `check`
- **Type**: `Function`
- **Accessors**:
  - `set check(check: Function)`: Validates and sets the precomputed check function.
  - `get check()`: Retrieves the precomputed check function.
- **Description**:
  - The `check` function is responsible for validating instances of the type defined by the `TypeSpec`. It ensures that all required properties are present and valid.

### Methods

#### `isOf(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value adheres to the type definition, otherwise `false`.
- **Description**: Checks if a value is of the defined type by validating it against the precomputed check function.

### Static Methods

#### `init(typeName: string, props: { [key: string]: Object }): TypeSpecBuild`
- **Parameters**:
  - `typeName`: A string representing the name of the type.
  - `props`: An object where keys are property names and values are property definitions, including validation functions.
- **Returns**: A new `TypeSpecBuild` instance.
- **Description**: Factory method to create and initialize a new `TypeSpecBuild` instance with the specified type name and property definitions.

#### `buildCreate(typeName: string, props: { [key: string]: Object }): Function`
- **Parameters**:
  - `typeName`: A string representing the name of the type.
  - `props`: An object where keys are property names and values are property definitions, including validation functions.
- **Returns**: A function that creates instances of the specified type.
- **Description**: Precomputes the create function using `TypeSpec` property definitions, ensuring that all properties are validated and set correctly during instance creation.

#### `buildCheck(typeName: string, props: { [key: string]: Object }): Function`
- **Parameters**:
  - `typeName`: A string representing the name of the type.
  - `props`: An object where keys are property names and values are property definitions, including validation functions.
- **Returns**: A function that checks instances of the specified type.
- **Description**: Precomputes the check function using `TypeSpec` property definitions, ensuring that all required properties are present and valid during instance validation.
