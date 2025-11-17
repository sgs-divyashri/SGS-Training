import { Task } from "./types";

export const tasks: Task[] = [];

export const allowedStatuses: string[] = [
    "To-Do",
    "In Progress",
    "Review",
    "Completed"
];
