import { taskCounter, incrementTaskCounter  } from "./data";

export function generateTaskId(): string {
    const prefix = "T";
    const minDigits = 3;

    const digits = Math.max(String(taskCounter).length, minDigits);

    const id = prefix + String(taskCounter).padStart(digits, "0");

    // increment exported variable (must mutate default export)
    incrementTaskCounter();

    return id;
}
