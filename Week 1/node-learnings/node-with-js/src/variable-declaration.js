// Variables - a container to store values

var a = 10  // global declaration
let b = 15  // local declaration
const c = 20  // value remain constant, cannot be modified

// let a = 20  // throws error cuz variable declared using var keyword, cannot be declared using let keyword

// c = 30  // cannot modify value for const variable

const person = {   // object
    name: "divya",
    age: 22
}
person.name="Devi"
console.log(person)  // it is updated - object is stored in separate memory

const cars = ['Mercedes', 'BMW', 'Porshe']
cars.push("Tata")
console.log(cars)   // values updated

// using const keyword, values cannot be modified for primitive datatypes (interger, string etc)


//Hoisting
function codeHoisting(){
        x = 10; // auto declare using var keyword
        let y= 20 // local 
}
codeHoisting()
console.log(x) // 10
// console.log(y) // ReferenceError: y is not defined


// Scope in Variables - Local scope, Global scope
const name1="Divya"
function getName(){
    const name2="Hari"
    console.log(name2)  // local
}
console.log(name1) // global
getName() // goto function



// Coercion - Type casting - implicitly conversion of values from one data type to another
console.log(5 + "10");
console.log("5" + 2); 
console.log("5" + true);
console.log("5" - 2); 
console.log("5" * 2); 
console.log("10" / "2");


