import { Task } from "./types";

export const tasks: Task[] = [];

export let taskCounter = 1;

export function incrementTaskCounter() {
    taskCounter++;
}

export const allowedStatuses: string[] = [
    "To-Do",
    "In Progress",
    "Review",
    "Completed"
];
