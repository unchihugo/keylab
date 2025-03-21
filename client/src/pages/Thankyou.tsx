/** @format */

import Divider from "../components/Divider"; // Assuming you have a Divider component
import LinkButton from "../components/LinkButton"; // Assuming you have a LinkButton component
import { House } from "lucide-react"; // Assuming you are using lucide react

export default function ThankYou() {
    return (
        <div className="flex justify-center items-center h-screen bg-primary">
            <div className="mx-4 px-8 md:px-20 py-12 md:py-28 bg-white drop-shadow-cartoon rounded-lg border border-black max-w-screen-lg">
                <div className="text-4xl font-display">
                    Thank You for Your Order!
                </div>
                <Divider />
                <div className="text-lg font-body">
                    We appreciate your purchase!
                </div>
                <LinkButton
                    to="/"
                    text="Go back home"
                    buttonClassNames="mt-3 px-6 bg-white"
                    Icon={House}
                />
            </div>
        </div>
    );
}