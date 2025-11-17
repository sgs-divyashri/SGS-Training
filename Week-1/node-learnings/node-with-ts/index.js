const readline = require('readline');

// In-memory array to store tasks
let tasks = [];
let taskCnt = 1; // for auto-generating Task IDs

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Exit function
function exitApp() {
  console.log("\nExiting the application... 👋");
  rl.close();
  process.exit(0);
}

// Function to auto-generate task ID like T001, T002, etc.
function generateTaskId() {
  const id = `T${String(taskCnt).padStart(3, '0')}`;
  taskCnt++;
  return id;
}

// Create Task function
function createTask() {
  const taskId = generateTaskId();
  console.log(`\nCreating new task...`);
  console.log(`Task ID: ${taskId} (auto-generated)\n`);

  rl.question('Enter Task Name: ', (name) => {
    if (!name.trim()) {
      console.log('❌ Task name cannot be empty!');
      return showMenu();
    }

    rl.question('Enter Description: ', (desc) => {
      const createdDate = new Date().toLocaleString();
      const updatedDate = createdDate;

      console.log('\nSelect Status:');
      console.log('1. In Progress');
      console.log('2. Completed');
      console.log('3. Review');
      console.log('4. To Do');

      rl.question('Enter your choice (1-4): ', (statusOption) => {
        let status = '';
        switch (statusOption) {
          case '1':
            status = 'In Progress';
            break;
          case '2':
            status = 'Completed';
            break;
          case '3':
            status = 'Review';
            break;
          case '4':
            status = 'To Do';
            break;
          default:
            console.log('❌ Invalid status option, defaulting to "To Do".');
            status = 'To Do';
        }

        const task = {
          id: taskId,
          name,
          desc,
          createdDate,
          updatedDate,
          status,
        };

        tasks.push(task);
        console.log('\n✅ Task Created Successfully!');
        console.table([task]);

        showMenu(); // go back to menu after creating task
      });
    });
  });
}

// Function to show all tasks
function getAllTasks() {
  if (tasks.length === 0) {
    console.log('\n📭 No tasks found.');
  } else {
    console.log('\n📋 All Tasks:');
    console.table(tasks);
  }
  showMenu();
}

// Main menu
function showMenu() {
  console.log("\n========================");
  console.log("       TO-DO MENU       ");
  console.log("========================");
  console.log("1. Create a Task");
  console.log("2. Get all Tasks");
  console.log("3. Exit");
  console.log("========================");

  rl.question('Enter your option: ', (answer) => {
    const option = Number(answer);

    if (isNaN(option)) {
      console.log('❌ Please enter a valid number!');
      return showMenu();
    }

    switch (option) {
      case 1:
        createTask();
        break;
      case 2:
        getAllTasks();
        break;
      case 3:
        exitApp();
        break;
      default:
        console.log('❌ Invalid option! Please choose between 1–3.');
        showMenu();
    }
  });
}

// Start the app
console.log("Welcome to TO-DO Application!");
showMenu();
