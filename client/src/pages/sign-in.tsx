import React from "react";
import { useAuth } from "../AuthContext";
import Divider from "../components/Divider";

const SignIn: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col justify-center items-center h-screen bg-primary">
            <div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black">
                <div className="text-4xl font-display">Sign in</div>
                <Divider />
                <div>TODO: complete login form</div>
                {/* TODO: create input component */}
            </div>
        </form>
    );
}

export default SignIn;