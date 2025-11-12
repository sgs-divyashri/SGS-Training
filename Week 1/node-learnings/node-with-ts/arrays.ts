/* Variables are scalar in nature - contain only single value at a time
   Not feasible to use large collection of data
*/

/* homogenous collection of values - same data type
   user defined type
   an array once initialized cannot be resized.
   Use the var keyword to declare an array.
   Array element values can be updated or modified but cannot be deleted.
*/


//Implicit Array
let names = ['renu', 'tofu', 'heena', 'dhanya']  // same dt
names.push('reetha')
console.log(names)

let num = [1, 34, 67, 87]   // same dt
num.pop()
console.log(num)

let mixed = [1, 'hi', true, 'sandra', 45, 8.9]    // diff dt while declaration
mixed.push('hema')
console.log(mixed)

//Explicit Array
let a:number[] = [2,3,9,8,7]
let b:String[] = ['dhd', 'huf', 'ftf']
let c:boolean[] = [true, false]

//Declare and assign later
let n:number[]
n=[1, 23, 45, 57, 87, 54]
n.push(34)
console.log(n)

let numb:number[] = []
numb.push(15)
console.log(numb)

// Read-Only Arrays
let fruits:readonly String[] = ['apple', 'orange', 'mango']
// fruits.push('lemon')  // push() do not exist in readonly array
