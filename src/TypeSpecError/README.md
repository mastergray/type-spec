## TypeSpecError Class

### Description
`TypeSpecError` extends the native `Error` class to provide custom error handling for type specifications in JavaScript. It supports specific error codes and messages tailored to common issues encountered when using type-specifications.

### Constructor

#### `constructor(message?: string, code?: number)`
- **Parameters**:
  - `message`: An optional error message string describing the error. Defaults to `"Unknown Error"` if not provided.
  - `code`: An optional error code from predefined static codes. Defaults to `TypeSpecError.CODE.UNKNOWN` if not provided.
- **Description**:
  - Initializes a new `TypeSpecError` instance with an error message and code.

### Properties

#### `code`
- **Type**: `number`
- **Accessors**:
  - `set code(code: number)`: Sets the error code after validating it against the predefined codes. Throws an error if the provided code is invalid.
  - `get code()`: Returns the current error code.

### Static Fields

#### `CODE`
- **Type**: `Object`
- **Description**: 
  - A dictionary of predefined error codes that describe different types of errors:
    - `UNKNOWN`: 0 — The specific nature of the error is not known.
    - `MISSING_PROPERTY`: 1 — A required property is missing for initializing an instance.
    - `INVALID_PROPERTY_TYPE`: 2 — A property is bound to a value of an incorrect type.
    - `UNSUPPORTED_PROPERTY`: 3 — An instance is being initialized with an unsupported property.
    - `INVALID_VALUE`: 4 — A value is of an incorrect type.

#### `ERROR_CODE_SET`
- **Type**: `Set`
- **Description**: 
  - A set containing all predefined error codes to facilitate quick validation of error codes.

### Static Methods

#### `MISSING_PROP(typeName: string, propName: string): TypeSpecError`
- **Parameters**:
  - `typeName`: The type name associated with the error.
  - `propName`: The property name that is missing.
- **Returns**: A new `TypeSpecError` instance.
- **Description**: Creates an error for a missing property in a type specification.

#### `INVALID_PROP(typeName: string, propName: string): TypeSpecError`
- **Parameters**:
  - `typeName`: The type name associated with the error.
  - `propName`: The property name with an incorrect type.
- **Returns**: A new `TypeSpecError` instance.
- **Description**: Generates an error when a property of an instance does not match the required type.

#### `UNSUPPORTED_PROP(typeName: string, propName: string): TypeSpecError`
- **Parameters**:
  - `typeName`: The type name associated with the error.
  - `propName`: The unsupported property name.
- **Returns**: A new `TypeSpecError` instance.
- **Description**: Returns an error when an unsupported property is used in a type specification.

#### `INVALID_VALUE(valueName: string, typeName: string): TypeSpecError`
- **Parameters**:
  - `valueName`: The name of the value causing the error.
  - `typeName`: The expected type of the value.
- **Returns**: A new `TypeSpecError` instance.
- **Description**: Creates an error for values that do not match the expected type.


