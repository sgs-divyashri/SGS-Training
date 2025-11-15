// This means the function does not return anything.
function exitApp(): void {
    console.log("Exiting the application...");
    rl.close(); // closes the readline interface
    // process is a global object in Node.js that represents the current running process.
    // 0 is the usual convention for successful / normal termination.
    process.exit(0); // exits the Node.js process and return the integer code to the operating system.
}
