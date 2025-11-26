let taskCounter: number = 1;  

export function generateTaskId(): string {    
    const prefix = "T";   
    const minDigits = 3;  
    const digits = Math.max(String(taskCounter).length, minDigits);
    const taskId = prefix + String(taskCounter).padStart(digits, "0");
    taskCounter++; 
    return taskId;  
}