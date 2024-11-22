export default function Home() {
    return (
      <div className="bg-yellow-50 min-h-screen font-sans">
    <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
/>

        {/* Hero Section */}
        <section className="bg-primary py-28 px-8 text-left mt-20">
          <div className="max-w-4xl mx-auto flex items-center">
            {/* Left Text Section */}
            <div className="flex flex-col space-y-4 w-full">
              <h2 className="text-3xl font-extrabold text-gray-800">
                Your one-stop shop for
              </h2>
              <h2
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
            className="text-4xl font-extrabold text-yellow-600 mt-2"
                 >
            KEYCAPS, SWITCHES & 
                </h2>
                 <h2
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
             className="text-4xl font-extrabold text-yellow-600 mt-2"
               >
           KEYBOARD
                </h2>
              <div className="flex justify-start space-x-4 mt-6">
              <button className="bg-white text-black px-6 py-2 rounded-full border-2 border-black hover:opacity-90">
          Shop Now
            </button>
                <button className="bg-yellow-500 text-black px-6 py-2 rounded-full hover:bg-yellow-600">
                  Try Our Keyboard Designer
                </button>
              </div>
            </div>
  
            {/* Right Image Section with Border */}
          <div className="w-3/3 pl-1 ml-2">
            <img
              src="https://via.placeholder.com/600x400?text=Product+Image" // Replace product image URL
              alt="Keyboard or Keycaps"
              className="w-full h-auto rounded-lg shadow-lg border-4 border-gray-400"
            />
          </div>
        </div>
      </section>
  
      <section className="py-16 px-8 border-2 border-gray-300">
  <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
    {["Keycaps", "Switches", "Keyboard Bases"].map((category, index) => (
      <div
        key={category}
        className={`${
          index === 0
            ? "bg-blue-100"
            : index === 1
            ? "bg-blue-100"
            : "bg-blue-100"
        } rounded-lg p-8 flex flex-col items-center shadow-md border-2 border-gray-400`}
      >
        {/* Image Box with Text */}
        <div className="h-40 w-full bg-gray-200 rounded-md mb-4 flex items-center justify-center">
          <p className="text-gray-700 font-bold">Product Image</p>
        </div>
        <h3 className="text-xl font-bold">{category}</h3>
        <button
          className={`mt-4 ${
            index === 0
              ? "bg-blue-500 hover:bg-blue-600"
              : index === 1
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white px-4 py-2 rounded-full border-2 border-black`}
        >
          Shop →
        </button>
      </div>
    ))}
  </div>
</section>



    
        {/* Product Images Section */}
<section className="py-16 px-8">
  <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
    {/* First Product Image Box */}
    <div className="h-64 w-full bg-gray-200 rounded-md border-2 border-gray-400 flex items-center justify-center">
      <p className="text-gray-700 font-bold">Product Image</p>
    </div>
    {/* Second Product Image Box */}
    <div className="h-64 w-full bg-gray-200 rounded-md border-2 border-gray-400 flex items-center justify-center">
      <p className="text-gray-700 font-bold">Product Image</p>
    </div>
  </div>
</section>

    
        {/* Reviews Section with Star Icons */}
      <section className="py-16 px-8 bg-yellow-50">
        <h2 className="text-2xl font-bold text-center mb-8">Latest Reviews</h2>
        <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
          {["bg-yellow-200", "bg-blue-100", "bg-pink-100", "bg-purple-100"].map(
            (bgColor, index) => (
              <div
                key={index}
                className={`${bgColor} p-6 rounded-lg shadow-md text-center border-2 border-gray-400`}
              >
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h4 className="text-lg font-semibold">Review Title</h4>
                <p className="text-gray-600 mt-2">Review Body</p>
                <p className="text-sm text-gray-500 mt-4">
                  Reviewer Name - Date
                </p>

                {/* Star Icons */}
                <div className="flex justify-center space-x-1 mt-4">
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-gray-300"></i>
                </div>
              </div>
            )
          )}
        </div>
      </section>
    
        {/* Footer */}
        <footer className="bg-white py-12 px-8 border-t text-sm">
        <div className="max-w-5xl mx-auto flex justify-between">
          <div className="space-y-2">
            <p className="font-bold text-gray-700">keylab</p>
            <p className="text-gray-500">Explore | Resources</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Explore</h3>
              <ul className="space-y-1">
                {[
                  "Development Features",
                  "Design Systems",
                  "Collaboration",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resources</h3>
              <ul className="space-y-1">
                {["Blog", "Support", "Resource Library"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="mt-8 flex justify-start space-x-6">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-facebook-f text-xl"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-instagram text-xl"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-linkedin-in text-xl"></i>
          </a>
        </div>
      </footer>
      </div>
    
    );
  }
  
  
  
  





  
  
  
  
  
    

