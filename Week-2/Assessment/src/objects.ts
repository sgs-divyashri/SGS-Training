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

// Update age of an object inside an array.
users[2]!.age = 24;
console.log(users[2])

// add new property to all objects in an array
const arr = [
  {name: "phone"},
  {name: "laptop"}
];
const updated_arr = arr.map(x => ({...x, inStock: true}))
console.log(updated_arr)

// count admin users
const users1 = [
  {name: "Divya", role: "admin"},
  {name: "Hari", role: "user"},
  {name: "Kumar", role: "admin"}
];
const count_admin = users1.filter(x => (x.role==='admin')).length
console.log(count_admin)

// Given an object, return a new object where all values are doubled (only if the values are numbers).
const doubled = {'a': 1, 'b': 3}
const doubled_obj = Object.fromEntries(
    Object.entries(doubled).map(([key, val]) => {
        return [key, val*2]
    })
)
console.log(doubled_obj)

// Convert an array of key–value pairs into an object.
const array =  [["name", "Divy"], ["age", 15]]
const convert = Object.fromEntries(array)
console.log(convert)

type User = {
  readonly id: number;
  name?: string;
  email: string;
  age?: number;
}

type PublicUser = Pick<User, "id"|"name">
type HiddenData = Omit<User, "email">
type OptionalData = Partial<User>
type AllData = Required<User>
type Read = Readonly<User> 

// Make a type that picks "email" and "password" from User but makes them optional.
type Combine = Pick<User, "id"|"email"> | Partial<User>

// Create a type that removes "email" and "age" from User and makes the rest readonly.
type Remove = Exclude<User, "email"|"age">