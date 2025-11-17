import { rl } from "./utils";

export function exitApp(): void {
    console.log("Exiting...");
    rl.close();
    process.exit(0);
}
