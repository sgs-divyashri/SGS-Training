/* Variables are scalar in nature - contain only single value at a time
   Not feasible to use large collection of data
*/

/* homogenous collection of values - same data type
   user defined type
   an array once initialized cannot be resized.
   Use the var keyword to declare an array.
   Array element values can be updated or modified but cannot be deleted.
*/

let names = ['renu', 'tofu', 'heena', 'dhanya']  // same dt
names.push('reetha')
console.log(names)

let num = [1, 34, 67, 87]   // same dt
num.pop()
console.log(num)

let mixed = [1, 'hi', true, 'sandra', 45, 8.9]    // diff dt while declaration
mixed.push('hema')
console.log(mixed)
