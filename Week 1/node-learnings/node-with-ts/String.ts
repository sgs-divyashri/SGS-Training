// String - text value or combo of characters
/*
1. Single Quotes - string literal ('alpha')
2. Double Quotes - string literal ("alpha")
3. Back tick - string template - to use a string variable inside another string value `${variable}
*/

// Index in strings starts with 0


let string1="Welcome "
var string2: string='To TYpeScript'

let op:number=10
console.log("The number is:", op)  // valid
console.log("The number is: ${op}") // invalid
console.log('The number is: ${op}') // invalid
console.log(`The number is: ${op}`) // valid

// charAt() - retrieve a paraticular character based on index position - starting index = 0
console.log(string2.charAt(3))

// concat()
console.log(string1.concat(string2))
var str="Hello! "
console.log(str.concat(string1).concat(string2))

// replace()
var str1="Welcome to my Yodtdbe channel"
console.log(str1.replace('d', 'u'))
console.log(str1.replace("my Yodtdbe channel", 'TypeScripting'))

//split()
var fruits: string="Apple Banana Mango"
console.log(fruits.split(" "))
console.log(fruits.split(" "), 2)

//substring()
str="How are you";
console.log(str.substring(0, 3))  //How
console.log(str.substring(3, 7))  // are

//toUpperCase() & toLowerCase()
str="TypeScript Programming";
console.log(str.toLowerCase())
console.log(str.toUpperCase())

//trim()
str="    Welcome    to    programming       "
console.log(str.trim())
console.log(str.trimStart())
console.log(str.trimEnd())