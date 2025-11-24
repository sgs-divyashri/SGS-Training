

// 3. Turn [{id:1},{id:2}] into {1: {id:1}, 2: {id:2}}
 
type User = { id: number; name: string };
type UsersById = Record<number, User>;
const a = [{id:1, name: "Divya"},{id:2, name: "Hari"}]
const map: UsersById = {};
for (const user of a) {
  map[user.id] = user;
}
console.log(map);

// Objects
type Person = {
  id: number;
  name: string;
  ssn: string;
  address: string;
}
// 1. create a type UserPreview from Person that contains only id and name
type UserPreview = Pick<Person, "id"|"address" | "name">

const arr2: number[] | undefined = undefined;
console.log("Undefined Array: ", arr2?.[0]);