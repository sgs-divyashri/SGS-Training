// 1. Create an array of 5 fruits. Print the first and last fruit using index numbers.

const arr: number[] = [1, 56, 75, 25, 87, 92]
console.log(`The first number in array is ${arr[0]} and the last element of array is ${arr[arr.length-1]}`)

// 2. Create an array of 5 numbers. Change the 3rd number to 100.
arr[2] = 100 
console.log(`The modified array is ${arr}`)

// 3. Create an empty array. Add these numbers one by one using push(): 10, 20, 30, 40.
const arr1: number[] = []
arr1.push(10)
arr1.push(20)
arr1.push(30)
arr1.push(40)
console.log(`The pushed array: ${arr1}`)
console.log(arr1)

// 4. Remove the last element from an array
arr1.pop()
console.log(arr1)

// 5. Add two names at the beginning of the array:
const array: string[] = ["hi", "helo", "welcome", "home"]
array.unshift("How are you", "namaste")
console.log(array)

// 6. Remove the first element from an array of cities:
array.shift()
console.log(array)

// 7. Check if the number 50 exists in this array:
const num_arr: number[] = [20, 78, 54, 98, 24, 25, 92, 67, 59, 12, 17, 50, 76, 52, 63, 51, 16, 95]
const inc = num_arr.includes(50)
console.log(inc)

// 8. Convert this array to a string separated by " - " ["HTML", "CSS", "JS"]
const combine = ["HTML", "CSS", "JS"]
const c_arr = combine.join('-')
console.log(c_arr)

// 9. Create a new array where each number is doubled.
const new_arr = arr.map(x => x*2)
console.log(new_arr)

// 10. Create a new array containing only numbers greater than 10.
const filtered_arr = arr.filter(x => x>25)
console.log(filtered_arr)

// 11. Find the sum of all numbers in this array:
const sum = arr.reduce((x, i) => x+i)
console.log(sum)

// 12. Check if all numbers in this array are positive:
const all_num = arr.every(x => x>0)
console.log(all_num)

// 13. Check if this array has any number less than 0:
const some_num = arr.some(x => x<0)
console.log(some_num)

// 14. Given an array of numbers, return a new array containing the squares of only the even numbers.
const array_num = arr.filter(x => x%2==0)
console.log(array_num)
const array_num2 = array_num.map(x => x*x)
console.log(array_num2)

// 15. Given const a = [1,2,3,4,5], write code to obtain [1,4,9,16,25] using one array

const arr2: number[] = [1, 2, 3, 4, 5]
const ans = arr2.map((x): number => x*x)
console.log(ans)

// 16. Remove all falsy values (0, '', null, undefined, false) from const arr = [0,1,"",2,null,3, false].

const arr3 = [0,1,"",2,null,3, false]
const res = arr3.filter(Boolean)
console.log(res)

// 17. Given an array of strings, return only the strings whose length is greater than 5, then convert them to uppercase.
const result = array.filter(x => x.length > 5)
console.log(result)
const upperRes = result.map(x => x.toUpperCase())
console.log(upperRes)

// 18. Given an array of objects { name, age }, return only the names of people older than 18.
const arr_obj = [{name: "divi", age: 22}, {name: "hari", age: 25}, {name: "radhi", age: 12}, {name: "rekha", age: 17}, {name: "reena", age: 21}, {name: "ravi", age: 16}]
const ex_arr = arr_obj.filter(x => x.age > 18)
console.log(ex_arr)

// 19. Given an array of numbers, find the maximum using reduce().
// const red = arr2. reduce((x, y) => )

// 20. Given an array of numbers, return the product of all numbers using reduce().
const prod = arr2.reduce((x, y) => {
    return x*y
})
console.log(prod)

// 21. Given an array of objects with price, calculate total price:
const arr_price = [{prod: "laptop", price: 1000}, {prod: "macine", price: 500},  {prod: "phone", price: 500},  {prod: "dress", price: 850},  {prod: "charger", price: 300},  {prod: "kitchenware", price: 2050},  {prod: "cycle", price: 690}, {prod: "portable table", price: 490}, {prod: "vegetables", price: 789}, {prod: "fruits", price: 653}]
const a = arr_price.reduce((acc, item) => {
    return acc+item.price
}, 0)
console.log(a)

// 22. Given an array of ages, check if someone is a minor (age < 18).
const age_arr = arr_obj.some(x => x.age<18)
console.log(age_arr)

// 23. Check if all numbers are positive in the array.
console.log(arr.every(x => x>0))

// 24. Given an array of passwords, check if at least one password is strong: length ≥ 8, contains a number
const pass = ['dgwlicdhckvc', 'HD0315@u', 'dhivya', 'lemnom', '241dkjsvd', 'hi', 'deva'] 
const strong = pass.some(x => x.length>=8 && /[0-9]/.test(x))
console.log(strong)

// 25. Write a function that removes all duplicate values from an array
const dup_arr = [1, 3, 4, 7, 1, 3, 8, 4, 2, 9, 4, 3, 6, 9, 5, 8]
const act_arr = dup_arr.filter((val, index) => {
    return dup_arr.indexOf(val) === index
})
console.log(act_arr)

// 26. Convert an array of numbers to strings using .map().
const arr_to_str = arr.map(x => x.toString())
console.log(arr_to_str)

// 27. From an array of numbers, separate them into: even numbers, odd numbers, multiples of 5. Return an object containing all three arrays.
const combined_arr = [56, 78, 24, 21, 93, 75, 90, 55, 52, 89, 67, 31, 10, 54]
const even_arr: number[] = []
const odd_arr: number[] = []
const multiple: number[] = []
combined_arr.forEach(x => {
    if (x % 5 === 0) {
        multiple.push(x)
    }
    if (x%2===0){
        return even_arr.push(x)
    }
    else{
        return odd_arr.push(x)
    }
})
const res_obj = {
    evenArray: even_arr,
    oddArray: odd_arr,
    multiplesOf5: multiple
}
console.log(res_obj)

// 28. Find the frequency of each element in an array. Input: ["a", "b", "a", "c", "b"] Output: { a: 2, b: 2, c: 1 }
const array_1 = ["a", "b", "a", "c", "b"]
const freq :{[key: string]: number} = {}
array_1.forEach(x => {
    if(freq[x])
        freq[x]++
    else
        freq[x]=1
})
console.log(freq)
