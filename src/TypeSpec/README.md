## TypeSpec Class

### Description
The `TypeSpec` class implements a basic type system by representing instances of a "type" as object literals with constrained properties. It provides a mechanism to define property constraints and ensures that instances of types meet these constraints.

### Constructor

#### `constructor(typeName: string)`
- **Parameters**
  - `typeName`: A string representing the name of the type.
- **Description**
  - Initializes a new `TypeSpec` instance with the specified type name.

### Properties

#### `typeName`
- **Type**: `string`
- **Accessors**:
  - `set typeName(typeName: string)`: Sets the type name after validating it as a string.
  - `get typeName()`: Returns the current type name.

#### `props`
- **Type**: `Object`
- **Accessors**:
  - `set props(props: Object)`: Sets the properties for the type.
  - `get props()`: Returns the properties associated with the type.

### Methods

#### `prop(name: string, pred: Function, defaultValue?: any): TypeSpec`
- **Parameters**:
  - `name`: The name of the property to define or modify.
  - `pred`: A predicate function that validates the property's value.
  - `defaultValue`: The default value for the property, used when no value is provided (optional).
- **Returns**: The `TypeSpec` instance for chaining, allowing multiple properties to be defined in sequence.
- **Description**: Adds a property with a validation predicate to the type definition. If the property already exists and was previously defined for the same type, an error will be thrown to prevent redefinition. This ensures property definitions remain consistent once established. The method throws errors if validations for the property name or predicate fail, or if an attempt is made to redefine a property.

#### `check(instance: Object): Object`
- **Parameters**:
  - `instance`: An object literal representing an instance to validate against the defined type properties.
- **Returns**: The validated instance object.
- **Description**: Validates an instance object against the type's properties, ensuring all required properties are present and valid. Throws errors for any validation failures.

#### `create(args: Object): Object`
- **Parameters**:
  - `args`: An object containing initial values for instance creation.
- **Returns**: A new instance object based on default values and initial arguments.
- **Description**: Creates a new instance of the type using provided arguments and default values for undefined properties. Validates properties during creation and throws errors for missing or invalid values.

#### `update(instance: Object, props: Object): Object`
- **Parameters**:
  - `instance`: The original instance object.
  - `props`: An object with new property values to update the instance.
- **Returns**: An updated instance object.
- **Description**: Updates an instance with new properties while validating the new values. Encourages immutability by returning a new object rather than mutating the original.

### Static Methods

#### `init(typeName: string): TypeSpec`
- **Parameters**:
  - `typeName`: A string representing the name of the type.
- **Returns**: A new `TypeSpec` instance.
- **Description**: Factory method to create and initialize a new `TypeSpec` instance with the specified type name.

#### `STRING(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is a string, otherwise `false`.
- **Description**: Utility method to check if a value is of type string.

#### `FUNCTION(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is a function, otherwise `false`.
- **Description**: Utility method to check if a value is a function.

#### `OBJECT(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is an object and not `null`, otherwise `false`.
- **Description**: Utility method to check if a value is an object.

