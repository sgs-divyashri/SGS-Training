// Arrow Functions
/*
   anonymous functions - for function expressions
   lambda func in Python
   Syntax: (param1, param2, ..., paramN) => expression
   Using fat arrow =>, we dropped the need to use the function keyword
   Parameters are passed in the parenthesis (), and the function expression is enclosed within the curly brackets
*/
var log = function (message) {
    console.log(message);
};
var doLog = function (msg) {
    console.log(msg); // hidden return stmt
};
var sum = function (x, y) {
    return x + y;
};
sum(10, 20);
