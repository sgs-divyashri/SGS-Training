// Interface
/*
  a structure that defines the contract in your application. 
  It defines the syntax for classes to follow. 
  Classes that are derived from an interface must follow the structure provided by their interface.
  The TypeScript compiler does not convert interface to JavaScript. 
  It uses interface for type checking.
  This is also known as "duck typing" or "structural subtyping".
  An interface is defined with the keyword interface and it can include properties and method declarations using a function or an arrow function.
  
*/

let draw = (x: number, y: number) => {  // passing values to variables
  console.log(x, y)
}
draw(3, 2)

// adding additional variable
let disp = (point: {x:number, y:number, z:number}) => {  // passing as objects into 'point' variable
  console.log(point.x)
}

// using same parameters into another function
let displRect = (point: {x:number, y:number, z:number}) => {  // can't be done quicky. so need interfaces
  console.log(point.y)  
}

disp({x:1, y:2, z:3})  // pass as objects

// Need interfaces to declare parameters with data types, values (optional)
// the use the interface for multiple functions, if needed 
interface Point {
  // fields of data type and values
  a: number,
  b: number,
  c: number
}

let direct = (point: Point) => {
  console.log("Interface used in 'direct' arrow function")
}
direct({a:1, b:2, c:3}) 
let drama = (point: Point) => {
  console.log("Interface used in 'drama' arrow function")
}
drama({a:4, b:7, c:9}) 