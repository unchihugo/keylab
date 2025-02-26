
import LinkButton from "../../components/LinkButton";
import { ChevronRight } from "lucide-react";

export default function Inventory() {
    return (
        <div className="bg-yellow-50 min-h-screen font-sans p-8">
            {/* Hero Section */}
            <section className="bg-primary py-28 px-8 text-left mt-10 rounded-lg shadow-md">
                <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center">
                    <div className="flex flex-col space-y-4 w-full md:w-1/2">
                        <h2 className="text-3xl font-bold text-primary-darker">Your one-stop shop for</h2>
                        <h2 className="text-5xl font-extrabold text-primary-dark">KEYCAPS, SWITCHES & KEYBOARDS</h2>
                        <div className="flex justify-start space-x-4 mt-6">
                            <LinkButton text="Shop now" buttonClassNames="bg-white" textClassNames="px-6 py-2" to="/shop" />
                            <LinkButton text="Try our Keyboard Designer" buttonClassNames="bg-primary-darker" textClassNames="px-6 py-2" to="/keyboard-designer" />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 mt-8 md:mt-0">
                        <img src="https://via.placeholder.com/600x400?text=Product+Image" alt="Keyboard or Keycaps" className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-400" />
                    </div>
                </div>
            </section>

            {/* Product Section */}
            <section className="py-16 px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg mx-auto">
                    {["Keycaps", "Switches", "Keyboard Bases"].map((name, index) => (
                        <div key={index} className="bg-secondary rounded-lg p-12 flex flex-col items-center border border-black">
                            <div className="w-full h-60 overflow-hidden mb-6">
                                <img src="https://via.placeholder.com/600x400?text=Product+Image" alt={name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-semibold text-black mb-5">{name}</h3>
                            <LinkButton text="Shop" buttonClassNames="bg-secondary-darker" textClassNames="px-10 py-3" to="/shop" Icon={ChevronRight} iconRight={true} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Image Showcase Section */}
            <section className="py-16 px-8">
                <div className="flex gap-6">
                    {["border-pink-100", "border-purple-100"].map((borderColor, index) => (
                        <div key={index} className={`h-64 w-full bg-gray-200 rounded-md border-4 ${borderColor} flex items-center justify-center`}>
                            <img src="https://via.placeholder.com/600x400?text=Product+Image" alt="Showcase Image" className="w-full h-full object-cover rounded-md" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-16 px-8 bg-yellow-50">
                <h2 className="text-2xl font-semibold text-center mb-8">Latest Reviews</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-lg mx-auto">
                    {["bg-primary-dark", "bg-blue-100", "bg-purple-100", "bg-pink-100"].map((bgColor, index) => (
                        <div key={index} className={`${bgColor} p-6 rounded-lg shadow-md text-center`}>
                            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                            <h4 className="text-lg font-bold">Review Title</h4>
                            <p className="text-gray-600 mt-2">Review Body</p>
                            <p className="text-sm text-gray-500 mt-4">Reviewer Name - Date</p>
                            <div className="flex justify-center space-x-1 mt-4">
                                {[...Array(4)].map((_, i) => (
                                    <i key={i} className="fas fa-star text-yellow-400"></i>
                                ))}
                                <i className="fas fa-star text-gray-300"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
