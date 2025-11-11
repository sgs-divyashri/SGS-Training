import * as readline from 'readline';

console.log("TO-DO Application");
console.log("\n");

console.log("Menu");
console.log("1. Create a Task");
console.log("2. Update a Task");
console.log("3. Get all Tasks");
console.log("4. Get a task by ID");
console.log("5. Delete a task");
console.log("6. Exit");
console.log("\n");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Exit function
function exitApp() {
  console.log("Exiting the application...");
  rl.close(); // closes the readline interface
  process.exit(0); // exits the Node.js process
}

function createTask(){
    taskid = 'T001'
    console.log(taskid)
    rl.question('Enter the task name: ', (name1) => {
  const name = String(name1); // Convert input to number

  if (isNull(name)) {
    console.log('Please enter a valid text!');
    rl.close();
    return;
  }
})
}

// Ask for user input
rl.question('Enter your option: ', (answer) => {
  const option = Number(answer); // Convert input to number

  if (isNaN(option)) {
    console.log('Please enter a valid number!');
    rl.close();
    return;
  }

  switch (option) {
    case 1:
        createTask();
      //console.log("Create a Task");
      break;
    case 2:
      console.log("Update a Task");
      break;
    case 3:
      console.log("Get all Tasks");
      break;
    case 4:
      console.log("Get a Task by ID");
      break;
    case 5:
      console.log("Delete a Task");
      break;
    case 6:
      exitApp(); // Call the exit function
      return;
    default:
      console.log("Invalid option! Please choose between 1–6.");
  }

  rl.close();
});









// const readline = require('readline');

// console.log("TO-DO Application")
// console.log("\n")

// console.log("Menu")
// console.log("1. Create a Task")
// console.log("2. Update a Task")
// console.log("3. Get all Tasks")
// console.log("4. Get a task by ID")
// console.log("5. Delete a task")
// console.log("6. Exit")
// console.log("\n")


// // Create readline interface
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Ask for user input
// rl.question('Enter your option: ', (answer) => {
//   const option = Number(answer); // Convert input to number

//   if (isNaN(option)) {
//     console.log('Please enter a valid number!');
//   } else {
//     console.log(`You entered: ${option}`);
//   }

//   rl.close(); // Close input stream
// });


// exit = () => {

// }
