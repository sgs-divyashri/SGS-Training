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

let numerical = [1, 34, 67, 87]   // same dt
numerical.pop()
console.log(numerical)

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
let vegetables:readonly String[] = ['brinjal', 'potato', 'radish']
// vegetables.push('lemon')  // push() do not exist in readonly array

// Array Methods

let numbers: Number[] = [1, 4, 15, 3, 67, 26, 92]
let fruits: String[] = ['apple', 'mango', 'orange', 'berries']
console.log("Numbers array:", numbers);
console.log("Strings array: ", fruits);

// length - attribute (not a method)
console.log("Size of numbers array: ", numbers.length)
console.log("Size of fruits array: ", fruits.length)

// push() - add single or multiple elements to end of array - push(elem1, elem2, ... elem)
numbers.push(56)
fruits.push('avocado', 'kiwi', 'grapes')
console.log("After push() Numbers array: ", numbers)
console.log("After push() fruits array: ", fruits)

// pop() - removes last element (single) from end of array - no parameters
let lastFruit=fruits.pop()
console.log("Returned last element after pop(): ", lastFruit)
console.log("After pop() fruits array: ", fruits)

// shift() - removes first element (single) from array - array.shift() - no params
let firstNum=numbers.shift()
console.log("Returned first element after shift(): ", firstNum)
console.log("After shift() Numbers array: ", numbers)

// unshift() - Adds single/multiple value at beginning of array
fruits.unshift('lychee', 'raspberry')
console.log("After unshift() fruits array: ", fruits)  // no value return

// concat() - returns a new array comprised of this array joined with two or more arrays.
let arr = numbers.concat([8, 9], [56, 97], [34, 17])
console.log("After concat() Numbers array: ", arr)

// slice() - Extracts a section of an array - starts at 0, end-1, arr.slice(start, end)
let extractedArr =  fruits.slice(1, 3);
console.log("After slice() fruits array: ", extractedArr)

// splice() - adds/removes element from array from everywhere
// arr.splice(start, deleteCount (optional), elem1, elem2, ...)
// Ex 1: (Deleteing elements)
let removedFruits = fruits.splice(1, 2)
console.log("Removed elements from  fruits array after splice(): ", removedFruits)
console.log("After Deletedsplice(): ", fruits)
// Ex 2: (Adding elements)
fruits.splice(1, 0, 'dragon fruit', 'pear')  // no return value
console.log("After Added splice(): ", fruits)
// Ex 3: (Delete and Add elements)
let spliceFruits = fruits.splice(2, 2, 'cherry', 'plum', 'fig')
console.log("After Deleted splice(): ", spliceFruits)
console.log("After added and deleted using splice(): ", fruits)

// indexOf() - finds index of the element, if not found, returns -1
// arr.indexOf(searchElem) or arr.indexOf(searchElem, startIndex)
let fruitIndex = fruits.indexOf('plum')
console.log("Index of plum using indexOf(): ", fruitIndex) 
console.log("Index of not found element: ", fruits.indexOf('banana'))
let startFruitIndex = fruits.indexOf('berries', 4)
console.log("Index of berries using indexOf() with start value: ", startFruitIndex) 
let startFruit = fruits.indexOf('cherry', 4)
console.log("Index of berries using indexOf() with start value: ", startFruit) 

// includes() - checks if an element exists - returns true or false
// syntax: arr.includes(searchElem, fromIndex)
let isPlum = fruits.includes('plum');
console.log("Does the fruits array have Plum? ", isPlum);  // true
let isberry = fruits.includes('Strawberry');
console.log("Does the fruits array have Strawberry? ", isberry);  // false

// toString() - converts array to strings
console.log("Numbers in Array format: ",numbers) // array format
let num_to_str = numbers.toString()
console.log("Converted Array to String: ", num_to_str)
let my_arr:String[]= ['w', 'e', 'l', 'c', 'o', 'm', 'e']
console.log("My array: ", my_arr)
console.log("Converted array to string: ", my_arr.toString())


// Advanced Functions - every method takes a function as parameter

// every()

// forEach() - executes the function once for each array element - takes function as parameter 
// syntax: array.forEach(function(currValue, index, array){})
/*
   - currValue - current element being processed in the array
   - index (optional) - the index of the current element being processed in the array
   - array (optional) - the array in which current element belongs to
*/
let fruit: String[] = ['apple', 'mango', 'orange', 'plum', 'kiwi', 'jack fruit']
console.log("Get all the fruits using for loop..")
for (let i in fruit){
   console.log(i, fruit[i])
}
console.log("Get all the fruits using forEach() method..")
fruit.forEach(function(elem, index){
   console.log(`${index}, ${elem}`)
})
console.log("Get all the fruits using forEach() method with arrow function..")
fruit.forEach((element, i) => {
   console.log(`${i}, ${element}`)
})
console.log("Get all the fruits using forEach() method and convert into upper case..")
fruit.forEach((element) => {
   console.log(element.toUpperCase())
})

// map() - creates a new array with the result of calling the function on every element of an array
// it takes function as parameter - returns same number of elements that we have in original array
// syntax: array.map(function(currValue, index, array){})
// Ex 1: Get square of all numbers in an array
let number: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let sq_num = number.map(function(element){
   return (element*element)
})
console.log("Squared Array: ", sq_num)
// Ex 2: Double each number in array
let double_num = number.map((element) => element * 2)
console.log("Doubled Array: ", double_num)

// filter() - creates a new array with all the elements that pass/satisfy the condition
// takes function as parameter - returns either same or fewer no. of elements compared to original array
// syntax: array.filter(function(currValue, index, array){})
// Ex 1: get only even num from array
let even_num = number.filter((element) => element%2===0)
console.log("Even numbers: ", even_num)
// Ex 2: get only num greater trhan 3 from array
let arr1: number[] = [3, 5, 1, 7, 9, 2, 4, 6, 1, 4, 2, 5, 8, 9, 7]
let greater_num = arr1.filter((num) => num>5)
console.log("Greater than 5: ", greater_num)


// reduce() - applies a function on every element of an array and returns a single value
// Syntax: array.reduce(function(accumulator, currValue, index, array) { })
/* - Accumulator - the accumulated value from previous iteration
   - currValue - current element being processed
*/
// Ex 1: get sum of all element in an array
let total = 0
for(let i=0; i<number.length;i++){
   total+=number[i]
}
console.log("Sum of all numbers in array using for loop: ", total)
// Using reduce()
let arr2 = number.reduce((total, element) => { return total+element; }, 0) // initialize default value for accumulator
console.log("Sum of the elements in an array using reduce() method: ", arr2)


// some() - checks if any element satisfies the condition
// returns true if atleast one element satisfies the condition, else false (boolean value)
// syntax: array.some(function(currValue, index, array){})
// Ex 1: Check array contains negative num or not
let arrr: number[] = [1, 3, -2, 7, -4, 8, 9, 3]
let neg_num = arrr.some((elem) => elem<0)  
console.log("Does array contain negative number? ", neg_num) // true



// every - checks if all the elements stisfy the condition
// returns true if all the elements satisfy the condition, else false
// syntax: array.every(function(currValue, index, array){})
// Ex 1: 
let all_even = number.every((elem) => elem%2===0);
console.log("Are all numbers even? ", all_even)  // false



// reduceRight()



// join()

// lastIndexOf()

// sort()

