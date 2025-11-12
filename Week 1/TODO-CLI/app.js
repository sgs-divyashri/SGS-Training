import * as readline from 'readline';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Exit function
function exitApp() {
  console.log("\nExiting the application...");
  rl.close();
  process.exit(0);
}


// Create Task function
function createTask() {
    console.log("Task Created")
}

// Function to show all tasks
function getAllTasks() {
    console.log("All Tasks")
}

// Main menu
function showMenu() {
    console.log("\n========================");
    console.log("       TO-DO MENU       ");
    console.log("========================");
    console.log("1. Create a Task");
    console.log("2. Update a Task");
    console.log("3. Get all Tasks");
    console.log("4. Get a task by ID");
    console.log("5. Delete a task");
    console.log("6. Exit");
    console.log("========================");

    rl.question('Enter your option: ', (answer) => {
        const option = Number(answer);

        // if (isNaN(option)) {
        //     console.log('Please enter a valid number!');
        //     return showMenu();
        // }

        switch (option) {
        case 1:
            createTask();
            break;
        case 2: 
            updateTAsk();
            break;
        case 3:
            getAllTasks();
            break;
        case 4:
            getSpecificTAsk();
            break;
        case 5:
            deleteTask();
            break;
        case 6:
            exitApp();
            break;
        default:
            console.log('❌ Invalid option! Please choose between 1–3.');
            showMenu();
    }

    
  });
}

console.log("Welcome to TO-DO Application!");
showMenu();
i=option;
do{
    showMenu();
} while(i<=6);
