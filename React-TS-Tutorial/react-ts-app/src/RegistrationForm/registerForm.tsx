import RegisterInputs from "./registerInputs";

export interface UserPayload {
  userId: number;
  name: string;
  email: string;
  password: string;
  age: number,
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function RegisterForm() {
    return (
        <div>
            < RegisterInputs/>
        </div>
    )
}