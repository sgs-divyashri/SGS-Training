// Arrow Functions
/*
   anonymous functions - for function expressions
   lambda func in Python
   Syntax: (param1, param2, ..., paramN) => expression
   Using fat arrow =>, we dropped the need to use the function keyword
   Parameters are passed in the parenthesis (), and the function expression is enclosed within the curly brackets
*/

let log = function (message: String){
    console.log(message)
}

let doLog = (msg: String) => {
    console.log(msg)  // hidden return stmt
}

let sum = (x: number, y: number): number => {
    return x + y;
}

sum(10, 20);