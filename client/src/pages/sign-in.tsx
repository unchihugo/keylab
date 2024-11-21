import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import Divider from "../components/Divider";
import LinkButton from "../components/LinkButton";
import { ArrowUpRight } from "lucide-react";
import { Navigate } from "react-router-dom";

const SignIn: React.FC = () => {
    const { login, isAuthenticated } = useAuth();
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

    useEffect(() => {
        if (isAuthenticated) {
            // redirect to home page if authenticated
            <Navigate to="/" />;
        }
    }, [isAuthenticated]);

    return (
        <div className="flex justify-center items-center md:h-screen bg-secondary">
            <div className="md:grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
                <form onSubmit={handleLogin}>
                    <div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black mb-4 md:mb-0">
                        <div className="text-2xl font-display">Sign in</div>
                        <Divider />
                        <div className="flex flex-col space-y-3">
                            <div>
                                <label htmlFor="email" className="text-sm mb-2 block">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-lg w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="text-sm mb-2 block">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-lg mb-3 w-full"
                                    required
                                />
                            </div>

                            <button type="submit" className="bg-black text-white p-2 rounded-full">
                                Sign In
                            </button>

                            {/* TODO: add forgot password */}
                        </div>
                    </div>
                </form>
                <div>
                    <div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black">
                        <ArrowUpRight className="w-8 h-8 -m-1"/>
                        <div className="mt-4 text-2xl font-display">New here?</div>
                        <div className="mt-2 font-body">Create an account to get started.</div>
                        <LinkButton to="/register" text="Register" buttonClassNames="mt-3 px-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;