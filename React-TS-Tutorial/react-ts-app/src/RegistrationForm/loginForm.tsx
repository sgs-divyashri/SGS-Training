import LoginInputs from "./loginInputs";

export default function LoginForm() {
    return (
        <div className="min-h-screen bg-[#B0E0E6] p-6">
            <div className="mx-auto max-w-md m-12 gap-6">
                <form className="bg-white rounded-xl shadow-md p-6 border border-violet-300 mx-auto w-full">
                    <h1 className="mb-4 text-center font-bold text-xl">User Login</h1>
                    < LoginInputs />
                </form>
            </div>
        </div>
    )
}