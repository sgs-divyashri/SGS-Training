function dosomething(){
    for(var i=0; i<5; i++){  // global declaration
        console.log(i)
    }
    console.log('Finally: ', i)
}
dosomething();

// function demo(){
//     for(let i=0; i<5; i++){  // local declaration
//         console.log(i)
//     }
//     console.log('Finally: ', i)
// }
// demo();


function demo(){
    for(let i=0; i<5; i++){  // local declaration
        console.log(i)
    }
}
demo();

var cnt = 24 // type - number
// cnt = 'a'  // Type string not assignable to type number - not an error in .js file

var a = 'hi' // type - string

let b; // type - any  // no errors  // but not preferred
b = 1
b = 'good'
b = true


let x:number
let y:string
let z:boolean
let arr:number[] = [1, 3, 4, 6];
// let t:number[] = [1, 3, 2, 'z'] // Type error
let f:any[] = [1, 2, 5, 'z', 2.4, 9.1, 'yes', true] // not preferred

const colorRed = 0;
const colorBlue = 1;
const colorGreen = 2;


// Enumerations
/*
   - a special "class"
   - to define a collection of named constants (unchangeable variables)
   - come in two flavors string and numeric.
   - By default, enums will initialize the first value to 0 and add 1 to each additional value
*/
enum Color {Red, Green, Blue}  // index - 0, 1, 2  // numeric
let backgroundcolor = Color.Red;
console.log(backgroundcolor) // 0

enum Colors {Red = 100, Green = 101, Blue = 202}  // assigning values
let bgcolor = Colors.Green;
console.log(bgcolor) // 101

enum directions {   // string
  North = 'North',
  East = "East",
  South = "South",
  West = "West"
};
// logs "North"
console.log(directions.North);
// logs "West"
console.log(directions.West);