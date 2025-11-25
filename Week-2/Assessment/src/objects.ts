const user: any = { name: "Divya", age: 15, country: "India" }
console.log(user.name)

// user.email = "divi0301@gmail.com"
user.age = 17
delete user.country
console.log(user)

console.log("email" in user);



const product = { name: "Laptop", price: 50000 }
console.log("No.of properties: ", Object.keys(product).length)

const person: any = {
  name: "Hari",
  city: "Chennai",
  job: "Developer"
};
for( let key in person){
    console.log(key+": "+person[key])
}

const car = { brand: "BMW", model: "X5", year: 2022 }
console.log("Key array: ", Object.keys(car))
console.log("Value array: ", Object.values(car))

// merge 2 obj
const obj1 = {a:1, b:2}
const obj2 = {x: 4, y: 6}
const merged = { ...obj1, ...obj2}
console.log(merged)

// Convert object to array of [key, value] pairs.
const obj = { name: "Sam", age: 22 };
const entries = Object.entries(obj);
console.log(entries);


const users = [
  { name: "A", age: 12 },
  { name: "B", age: 19 },
  { name: "C", age: 18 },
  { name: "D", age: 12 },
  { name: "E", age: 25 },
  { name: "F", age: 30 }
];
console.log(users[1]?.name)
const getAge = users.filter(x => x.age>18)
console.log(getAge)

// Sort array of objects by age (ascending).
const sorting = users.sort((x, y) => x.age - y.age)
console.log(sorting)