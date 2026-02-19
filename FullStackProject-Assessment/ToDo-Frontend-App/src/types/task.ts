export type TaskStatus = "To-Do" | "In-Progress" | "Done";

export interface Task {
    taskId?: string;
    taskName: string;
    taskDescription: string;
    assignedTo: string;
    status?: TaskStatus;
    assigneeEmail?: string;   
    assigneeName?: string;
}

export type Columns = {
    todo: Task[];
    "in-progress": Task[];
    done: Task[];
};
