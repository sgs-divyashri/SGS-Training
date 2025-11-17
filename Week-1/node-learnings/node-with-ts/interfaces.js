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
var draw = function (x, y) {
    console.log(x, y);
};
draw(3, 2);
// adding additional variable
var disp = function (point) {
    console.log(point.x);
};
// using same parameters into another function
var displRect = function (point) {
    console.log(point.y);
};
disp({ x: 1, y: 2, z: 3 }); // pass as objects
var direct = function (point) {
    console.log("Interface used in 'direct' arrow function");
};
direct({ a: 1, b: 2, c: 3 });
var drama = function (point) {
    console.log("Interface used in 'drama' arrow function");
};
drama({ a: 4, b: 7, c: 9 });
