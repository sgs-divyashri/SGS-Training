/* Primitive data types
   - String
   - Number
   - boolean
   - null
   - undefined
   - symbol
   - bigint
*/

/* Reference types
   - Object
   - Array
   - function
*/

/* Storing
   - Store by value
   - store by reference
*/

// Primitive data types
let a = 10
let b = a
b = 20
console.log(a)
console.log(b)

// Reference Types
let user1={name: "Divya"} 
let user2=user1  // reference types - if changes occur, affects both variables if passing reference objects
user2.name="Hari"
console.log(user1)
console.log(user2)
