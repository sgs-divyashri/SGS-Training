import { rl } from "./utils";

export function exitApp(): void {
    console.log("Exiting the application...");
    rl.close();
    process.exit(0);
}
