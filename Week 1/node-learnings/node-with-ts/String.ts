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

// charAt(index) - retrieve a paraticular character based on index position - starting index = 0
console.log(string2.charAt(3))

// charCodeAt() - returns a number indicating the Unicode value of the character at the given index. 
/* Unicode code points range from 0 to 1,114,111. 
   The first 128 Unicode code points are a direct match of the ASCII character encoding. 
   charCodeAt()always returns a value that is less than 65,536.
*/
/*
   Argument Details
      index − An integer between 0 and 1 less than the length of the string; 
      if unspecified, defaults to 0.
   Return Value
      Returns a number indicating the Unicode value of the character at the given index. 
      It returns NaN if the given index is not between 0 and 1 less than the length of the string.
*/
console.log("str.charAt(0) is:" + string1.charCodeAt(0)); 
console.log("str.charAt(1) is:" + string1.charCodeAt(1)); 
console.log("str.charAt(2) is:" + string1.charCodeAt(2)); 
console.log("str.charAt(3) is:" + string1.charCodeAt(3)); 
console.log("str.charAt(4) is:" + string1.charCodeAt(4)); 
console.log("str.charAt(5) is:" + string1.charCodeAt(5));

// codePointAt()

// indexOf(string)
console.log(string2.indexOf("TYpe"))

// lastIndexOf()
console.log(string2.lastIndexOf("TYpe"))

// concat()
console.log(string1.concat(string2))
var str="Hello! "
console.log(str.concat(string1).concat(string2))

// replace()
var str1="Welcome to my Yodtdbe channel"
console.log(str1.replace('d', 'u'))
console.log(str1.replace("my Yodtdbe channel", 'TypeScripting'))

//split()
var fruit: string="Apple Banana Mango"
console.log(fruit.split(" "))
console.log(fruit.split(" "), 2)
var email: String = "abcd@gmail.com,xyzabc"
let arr = email.split(",")
console.log("Email: ", arr[0])
console.log("Password: ", arr[1])

//substring()
str="How are you";
console.log(str.substring(0, 3))  //How
console.log(str.substring(3, 7))  // are

//toUpperCase() & toLowerCase()
str="TypeScript Programming";
console.log(str.toLowerCase())
console.log(str.toUpperCase())

// toLocaleLowerCase() - to convert the characters within a string to lowercase while respecting the current locale. 
console.log(str.toLocaleLowerCase( ));

// toLocaleUpperCase() - The characters within a string are converted to upper case while respecting the current locale.
console.log(str.toLocaleUpperCase( ));

// toString() -  returns a string representing the specified object.
console.log("To String: ",str.toString( ));

// valueOf() - Returns the primitive value of a String object.
console.log("Value of String: ", str.valueOf( ));

//trim()
str="    Welcome    to    programming       "
console.log(str.trim())
console.log(str.trimStart())
console.log(str.trimEnd())

//length()
console.log(str.length)

// includes() - returns true or false
console.log(str.includes("Welc"))   // true - part is included
console.log(str.includes("abc"))  // false - not included

// startsWith() & endsWith()
console.log(string1.startsWith("Welc"))  // true
console.log(string2.endsWith("Script"))  // true

// localeCompare() - returns a number indicating whether a reference string comes before or after or is the same as the given string in sorted order.
/*
   param − A string to be compared with string object.
   Return Value
     0 − If the string matches 100%.
     1 − no match, and the parameter value comes before the string object's value in the locale sort order.
     A negative value − no match, and the parameter value comes after the string object's value in the local sort order.
*/
var sentence = new String( "This is beautiful string" );
var index = sentence.localeCompare( "This is beautiful string");  
console.log("localeCompare first :" + index );

// match() - 

// search() - executes the search for a match between a regular expression and this String object.
/*
   A regular expression object. 
   If a non-RegExp object obj is passed, it is implicitly converted to a RegExp by using new RegExp(obj).
   If successful, the search returns the index of the regular expression inside the string. Otherwise, it returns -1.
*/
var s = "TypeScript"
var re = /TypeScript/gi; 
if (s.search(re) == -1 ) { 
   console.log("Does not contain TypeScript" ); 
} else { 
   console.log("Contains TypeScript" ); 
} 

// slice() - extracts a section of a string and returns a new string.
/*
   beginSlice − The zero-based index at which to begin extraction.
   endSlice − The zero-based index at which to end extraction. If omitted, slice extracts to the end of the string.
   If successful, slice returns the index of the regular expression inside the string. Otherwise, it returns -1.
*/
var sliced = str.slice(3, -2); 
console.log(sliced);

// padEnd()

// padStart()

// repeat() 

// String Immutability

let num:number = 10;
let res = num + 5
console.log(res) // store value into res variable  // 15
console.log(num) // not change in original value   // 10

let st1 = "Welcome"
let mod_String=st1.concat("to TypeScript")   // Welcome to TypeScript
console.log(st1) // Welcome

// Multi-line Strings
// let multiline: String = "Welcome to my youtyube chanel
//                         hello javascript..."           // Invalid  // no double or single quotes

let multiline: String = `Welcome to my youtyube chanel
                        hello javascript...`


