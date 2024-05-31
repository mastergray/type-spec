# type-spec

`type-spec` is designed to be a lightweight, dynamic type enforcement system for JavaScript. It represents types as object literals with constrained properties, allowing for the definition, instantiation, and validation of custom types with clear structural and behavioral constraints. It ensures properties, once defined, remain consistent and cannot be redefined, upholding dependable type behavior.

**Key Features:**
- **Type Definition and Instantiation**: Define types using a simple class structure that allows specifying property constraints, default values, and validation rules.
- **Dynamic Type Checking**: Enforce type constraints at runtime, ensuring that objects adhere to the predefined specifications, with comprehensive error handling for type violations.
- **Immutability and State Management**: Facilitates creating, updating, and managing instances of types in an immutable fashion, promoting safer and more predictable code.
- **Type-Spec Operations as Transforms**: Define operations that transform data between types, enabling powerful and flexible data manipulation and transformation capabilities.
- **Customizable and Extensible**: Easily extend types and integrate custom validation logic to suit complex application needs.

**Use Cases:**
- Ideal for applications requiring robust state management and type integrity without the overhead of static typing languages.
- Useful in scenarios where dynamic type checking can prevent common bugs and ensure data consistency across components.
- Well-suited for React web applications, ensuring state and props adhere to well-defined types, enhancing reliability and maintainability.
- Beneficial for RESTful APIs to enforce request and response data structures, promoting consistency and reducing errors.

## Examples

Here are some examples of how to use the `TypeSpec` class to define and validate type specifications for different scenarios. These examples help illustrate how to create types, define properties, utilize instances, and define operations effectively.

### Defining a Simple User Type

This example demonstrates defining a `User` type with properties `username` and `age`, ensuring `username` is a non-empty string and `age` is a positive integer.

```javascript
import TypeSpec from 'type-spec';

const User = new TypeSpec('User')
    .prop('username', TypeSpec.NONEMPTY_STRING, 'defaultUser')
    .prop('age', value => TypeSpec.NUMBER(value) && value > 0, 18);

// Creating an instance of User:
try {
    const userInstance = User.create({ username: 'johndoe', age: 30 });
    console.log('User created:', userInstance);
} catch (error) {
    console.error(error.message);
}

// Attempting to create a user with invalid data:
try {
    const invalidUser = User.create({ username: '', age: -5 });
} catch (error) {
    console.error(error.message);  // Outputs error messages for invalid username and age
}
```

### Using Subtypes to Extend a Base Type

This example shows how to extend a base `User` type to define an `Admin` type with an additional `accessLevel` property:

```javascript
const Admin = new TypeSpec('Admin', User)
    .prop('accessLevel', value => TypeSpec.NUMBER(value) && value >= 1, 1);

// Creating an instance of Admin:
try {
    const adminInstance = Admin.create({ username: 'adminuser', age: 34, accessLevel: 3 });
    console.log('Admin created:', adminInstance);
} catch (error) {
    console.error(error.message);
}
```

### Enforcing Required Properties

This example defines a `Book` type where `title` and `author` are required properties, and `year` has a default value:

```javascript
const Book = new TypeSpec('Book')
    .prop('title', TypeSpec.NONEMPTY_STRING)
    .prop('author', TypeSpec.NONEMPTY_STRING)
    .prop('year', TypeSpec.NUMBER, 2021);

// Creating a book with all properties provided:
try {
    const bookInstance = Book.create({ title: '1984', author: 'George Orwell', year: 1949 });
    console.log('Book created:', bookInstance);
} catch (error) {
    console.error(error.message);
}

// Creating a book with default year:
try {
    const bookDefaultYear = Book.create({ title: 'Brave New World', author: 'Aldous Huxley' });
    console.log('Book created with default year:', bookDefaultYear);
} catch (error) {
    console.error(error.message);
}
```

### Updating an Instance

This example updates a `Product` instance, ensuring new properties are validated:

```javascript
const Product = new TypeSpec('Product')
    .prop('name', TypeSpec.NONEMPTY_STRING)
    .prop('price', value => TypeSpec.NUMBER(value) && value >= 0, 0);

// Creating a product instance:
let productInstance = Product.create({ name: 'Laptop', price: 999 });
console.log('Initial product:', productInstance);

// Updating the product's price:
try {
    productInstance = Product.update(productInstance, { price: 1099 });
    console.log('Updated product:', productInstance);
} catch (error) {
    console.error('Error:', error.message);  // Outputs an error message for invalid price
}

// Attempting to update with invalid data:
try {
    productInstance = Product.update(productInstance, { price: -50 });
} catch (error) {
    console.error('Error:', error.message);  // Should output an error message for invalid price
}
```

### Defining and Using type-spec Operations

This example demonstrates how to define and use type-spec operations to transform data between types:

```javascript
import TypeSpec from 'type-spec';
import TypeSpecOp from 'type-spec/TypeSpecOp';
import TypeSpecTransform from 'type-spec/TypeSpecTransform';

// Define User type
const User = new TypeSpec('User')
    .prop('username', TypeSpec.NONEMPTY_STRING)
    .prop('age', value => TypeSpec.NUMBER(value) && value > 0);

// Define UserSummary type
const UserSummary = new TypeSpec('UserSummary')
    .prop('username', TypeSpec.NONEMPTY_STRING)
    .prop('isAdult', TypeSpec.BOOL);

// Define transformation function
const userToSummaryFn = (fromValue) => ({
    username: fromValue.username,
    isAdult: fromValue.age >= 18
});

// Define User to UserSummary operation
const userToSummaryOp = new TypeSpecOp(User, UserSummary)
    .ontoResult({ from: ['username', 'age'], to: ['username', 'isAdult'], fn: userToSummaryFn });

// Creating an instance of User:
const userInstance = User.create({ username: 'johndoe', age: 30 });
console.log('User created:', userInstance);

// Transform User to UserSummary:
try {
    const summaryInstance = userToSummaryOp.run(userInstance);
    console.log('UserSummary created:', summaryInstance);
} catch (error) {
    console.error('Error:', error.message);
}
```

## Notice

`type-spec` is very much a work-in-progress. While the base implementation seems stable, I'd like to introduce more robust and automated testing, especially given this project's intent. Further, I'd like to add the following:

- Asynchronous operations
- Composable operations
- Mixins
- Using types as type definitions
- Optimizing "isEqual" so we can apply to EITHER 

Not to mention I have plenty of benchmarking I want to do too. Documentation is currently in draft as well, since what's currently included was generated by ChatGPT. For better or worse...