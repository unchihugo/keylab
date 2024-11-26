// src/About.js
//import React from 'react';

export default function About() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-8">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full text-center">
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">About Us</h1>

                {/* Vision Section */}
                <section className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        At <span className="font-bold text-indigo-600">KEYLAB</span>, our mission is to create personalized keyboards that reflect individuality and style. We believe that every keyboard should be as unique as the person using it, combining functionality, aesthetic appeal, and quality.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed mt-4">
                        Our vision is to empower creators, professionals, and gamers with tools that enhance their experience and allow them to express themselves. With a passion for design and innovation, we strive to build keyboards that inspire creativity and joy.
                    </p>
                </section>
                
                {/* Decorative Divider */}
                <div className="my-8 border-b-2 border-indigo-200 w-3/4 mx-auto"></div>

                {/* Inspirational Quote or Tagline */}
                <p className="text-xl italic text-gray-700">
                    "Your keyboard, your style. Let’s build something unique together."
                </p>
            </div>
        </div>
    );
}
