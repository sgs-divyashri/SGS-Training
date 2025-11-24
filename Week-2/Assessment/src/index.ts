const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function mult(arr: number[]){
    const arr1: number[] = []
    for(let i=0; i<arr.length; i++){
        arr1.push(arr[i]!*2);
    }
    return arr1
}

// console.log(mult(arr))


const multi = arr.map((i) => {
    arr[i]! * 2
})
console.log(multi)


const names: string[] = ["alice", "bob", "alice"];

const freq = names.reduce((acc: Record<string, number>, name: string) => {
  acc[name] = (acc[name] || 0) + 1;
  return acc;
}, {});

console.log(freq);
