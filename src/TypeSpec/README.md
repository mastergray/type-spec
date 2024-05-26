## TypeSpec Class Documentation
The `TypeSpec` class implements a rudimentary type system by representing instances of a "type" as object literals with constrained properties. This class allows for defining properties with specific constraints and validation rules, ensuring that instances adhere to these specifications. It supports dynamic inheritance from parent types, enabling subtypes to override and extend parent properties.

### Constructor

#### `constructor(typeName: string, parentType?: TypeSpec)`
- **Parameters**:
  - `typeName`: A string representing the name of the type.
  - `parentType`: Optional; a `TypeSpec` instance representing the parent type from which properties can be inherited.
- **Description**:
  - Initializes a new `TypeSpec` instance with a specified type name and optionally inherits properties from a parent type.

### Properties

#### `typeName`
- **Type**: `string`
- **Accessors**:
  - `set typeName(typeName: string)`: Validates and sets the type name.
  - `get typeName()`: Retrieves the current type name.

#### `props`
- **Type**: `Object`
- **Accessors**:
  - `set props(props: Object)`: Sets the properties for this type, overriding any from the parent type.
  - `get props()`: Retrieves the properties of the type. Does not include properties from the parent type.

#### `parentType`
- **Type**: `TypeSpec`
- **Accessors**:
  - `set parentType(parentType: TypeSpec)`: Sets the parent type, verifying that it is an instance of `TypeSpec`.
  - `get parentType()`: Retrieves the current parent type.

#### `propNames`
- **Type**: `Set<string>`
- **Accessor**:
  - `get propNames()`: Retrieves a set of all property names defined for this type, including those inherited from the parent type.

### Methods

#### `prop(name: string, pred: Function, defaultValue?: any): TypeSpec`
- **Parameters**:
  - `name`: The name of the property to define or modify.
  - `pred`: A predicate function that validates the property's value.
  - `defaultValue`: Optional; the default value for the property when not provided.
- **Returns**: The `TypeSpec` instance, allowing for method chaining.
- **Description**: Defines a property with a validation predicate. Throws errors if the property name or predicate fails validations, or if there is an attempt to redefine a property that conflicts with inherited properties.

#### `constant(name: string, value: any): TypeSpec`
- **Parameters**:
  - `name`: The name of the property to set as a constant.
  - `value`: The immutable value for the property.
- **Returns**: The `TypeSpec` instance, facilitating method chaining.
- **Description**: Sets a property to a constant value, ensuring that all instances of this type will hold this exact value for the specified property.

#### `propDefinition(name: string): Object`
- **Parameters**:
  - `name`: The name of the property to retrieve.
- **Returns**: The property definition object.
- **Description**: Retrieves the definition of a property by name, checking in the current type's properties and recursively in the parent type if necessary.

#### `check(instance: Object): Object`
- **Parameters**:
  - `instance`: An object literal representing an instance to validate against the defined type properties.
- **Returns**: The validated instance object if successful.
- **Description**: Validates an instance against the type's properties. Ensures all required properties are present and validated according to both inherited and defined properties.

#### `create(args: Object): Object`
- **Parameters**:
  - `args`: An object containing values for instance creation.
- **Returns**: A newly created instance object.
- **Description**: Creates a new instance using provided values and default values, validating properties during creation.

#### `update(instance: Object, newProps: Object): Object`
- **Parameters**:
  - `instance`: The original instance object.
  - `newProps`: New property values for updating the instance.
- **Returns**: An updated instance object.
- **Description**: Updates an instance with new properties, validating new values. Encourages immutability by returning a new object instead of modifying the original.

### Static Methods

#### `init(typeName: string, parentType?: TypeSpec): TypeSpec`
- **Parameters**:
  - `typeName`: A string representing the name of the type.
  - `parentType`: Optional; a `TypeSpec` instance to be used as the parent type.
- **Returns**: A new `TypeSpec` instance.
- **Description**: Factory method to create and initialize a new `TypeSpec` instance with the specified type name and an optional parent type.

#### `BOOL(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is a boolean, otherwise `false`.
- **Description**: Checks if a value is a boolean.

#### `VOID(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is undefined, otherwise `false`.
- **Description**: Checks if a value is undefined.

#### `NOTHING(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is null, otherwise `false`.
- **Description**: Checks if a value is null.

#### `STRING(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is a string, otherwise `false`.
- **Description**: Checks if a value is a string.

#### `NONEMPTY_STRING(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is a non-empty string, otherwise `false`.
- **Description**: Checks if a value is a non-empty string.

#### `NUMBER(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is a number, otherwise `false`.
- **Description**: Checks if a value is a number.

#### `INT(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is an integer, otherwise `false`.
- **Description**: Checks if a value is an integer.

#### `UNSIGNED_INT(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is a non-negative integer, otherwise `false`.
- **Description**: Checks if a value is a non-negative integer.

#### `FUNCTION(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is a function, otherwise `false`.
- **Description**: Checks if a value is a function.

#### `OBJECT(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is an object (and not `null`), otherwise `false`.
- **Description**: Checks if a value is an object.

#### `ARRAY(value: any): boolean`
- **Parameters**:
  - `value`: The value to check.
- **Returns**: `true` if the value is an array, otherwise `false`.
- **Description**: Checks if a value is an array.

#### `ARRAY_OF(typeSpec: TypeSpec, allowEmpty?: boolean): Function`
- **Parameters**:
  - `typeSpec`: A `TypeSpec` instance for validating elements in the array.
  - `allowEmpty`: Optional; a boolean indicating if empty arrays are allowed.
- **Returns**: A function that validates if an array matches the specified `TypeSpec`.
- **Description**: Returns a function to check if each element in an array adheres to the specified `TypeSpec`.

#### `EITHER(arr: any[]): Function`
- **Parameters**:
  - `arr`: An array of values to check against.
- **Returns**: A function that checks if a value is included in the specified array.
- **Description**: Checks if a value is a member of the given array. Useful for validating enums or specific sets of values.

#### `isEqual(a: any, b: any): boolean`
- **Parameters**:
  - `a`: The first value to compare.
  - `b`: The second value to compare.
- **Returns**: `true` if both values are equal, otherwise `false`.
- **Description**: Checks for equality between two values, supporting primitive values, objects, and arrays of primitive values and objects.
