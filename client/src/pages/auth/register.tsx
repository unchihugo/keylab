import React, { useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Navigate } from "react-router-dom";
import LinkButton from "../../components/LinkButton";
import Divider from "../../components/Divider";
import { CheckCheck, ChevronRight } from "lucide-react";

const Register: React.FC = () => {
    const { register, isAuthenticated } = useAuth();
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirm, setPasswordConfirm] = React.useState("");

    // handle register form submission
    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // TODO: add more form validation
        if (password !== passwordConfirm) {
            console.error("Passwords do not match");
            return;
        }


        try {
            await register(firstName, lastName, email, password);
        } catch (error) {
            console.error(error);
        }
    };

    // TODO: add "Receive updates" checkbox functionality

    useEffect(() => {
        if (isAuthenticated) {
            // redirect to home page if authenticated
            <Navigate to="/" />;
        }
    }, [isAuthenticated]);

    return (
        <div className="flex justify-center items-center md:h-screen bg-primary">
            <div className="px-4 md:grid md:grid-cols-2 gap-10 lg:gap-16 items-center max-w-screen-lg w-full">
                <form onSubmit={handleRegister}>
                    <div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black mb-4 md:mb-0 w-full">
                        <div className="text-2xl font-display">Register</div>
                        <Divider />
                        <div className="flex flex-col space-y-3">
                            <div className="flex space-x-3">
                                <div className="grow">
                                    <label htmlFor="firstName" className="text-sm mb-2 block">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div className="grow">
                                    <label htmlFor="lastName" className="text-sm mb-2 block">Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="border border-gray-300 p-2 rounded-lg w-full"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm mb-2 block">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-lg w-full"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="text-sm mb-2 block">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-lg w-full"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="passwordConfirm" className="text-sm mb-2 block">Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                            <Divider />
                            <div>
                                <label className="text-sm font-bold">Receive updates</label>
                                <div className="flex">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">Get updated on the latest Keylab and stock updates</span>
                                </div>
                            </div>

                            <button type="submit" className="bg-black text-white p-2 rounded-full justify-center items-center gap-2 inline-flex">
                                Continue
                                <ChevronRight className="-m-1" />
                            </button>
                        </div>
                    </div>
                </form>
                <div>
                    <div className="px-8 py-8 bg-white drop-shadow-cartoon rounded-lg border border-black">
                        <CheckCheck className="w-8 h-8 -m-1" />
                        <div className="mt-4 text-2xl font-display">Already have an account?</div>
                        <div className="mt-2 font-body">Log in instead!</div>
                        <LinkButton to="/sign-in" text="Sign In" buttonClassNames="mt-3 px-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;