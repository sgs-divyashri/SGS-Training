export function generateTaskId(taskCounter: number): string {
    
    const prefix = "T";
    const minDigits = 3;

    const digits = Math.max(String(taskCounter).length, minDigits);

    const id = prefix + String(taskCounter).padStart(digits, "0");

    return id;
}
