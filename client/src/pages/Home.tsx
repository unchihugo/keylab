export default function Home() {
    return (
      <div className="bg-yellow-50 min-h-screen font-sans">
    <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
/>

        {/* Section */}
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
              <button 
              onClick={() => (window.location.href = "http://localhost:5173/shop")}
              className="bg-white text-black px-6 py-2 rounded-full border-2 border-black hover:opacity-90">
          Shop Now
            </button>
            <button
  onClick={() => (window.location.href = "http://localhost:5173/keyboard-designer")}
  className="bg-yellow-500 text-black px-6 py-2 rounded-full border-2 border-black hover:bg-yellow-600"
>
  Try Our Keyboard Designer
</button>

              </div>
            </div>
  
            {/* Right Image Section with Border */}
          <div className="w-2/1 pl-1 ml-2">
            <img
              src="https://via.placeholder.com/600x400?text=Product+Image" 
              alt="Keyboard or Keycaps"
              className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-400"
            />
          </div>
        </div>
      </section>
  
      <section className="py-16 px-8">
  <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
    {[
      { name: "Keycaps", img: "https://via.placeholder.com/600x400?text=Product+Image" },
      { name: "Switches", img: "https://via.placeholder.com/600x400?text=Product+Image" },
      { name: "Keyboard Bases", img: "https://via.placeholder.com/600x400?text=Product+Image" },
    ].map(({ name, img }, index) => (
      <div
        key={name}
        className="bg-blue-200 rounded-lg p-8 flex flex-col items-center shadow-md border-2 border-gray-400" 
      >
        {/* Image */}
        <img
          src={img} 
          alt={name}
          className="h-40 w-full object-cover rounded-md mb-4"
        />
        <h3 className="text-xl font-bold">{name}</h3>
        <button
          onClick={() => (window.location.href = "http://localhost:5173/shop")}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-full border-2 border-black"
        >
          Shop →
        </button>
      </div>
    ))}
  </div>
</section>
    
<section className="py-16 px-8">
  <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">

    {/* First Product Image Box */}
    <div className="h-64 w-full bg-gray-200 rounded-md border-2 border-gray-400 flex items-center justify-center">
      <img
        src="https://via.placeholder.com/600x400?text=Product+Image" // Replace with image URL
        alt="Keycaps"
        className="w-full h-full object-cover rounded-md"
      />
    </div>
    {/* Second Product Image Box */}
    <div className="h-64 w-full bg-gray-200 rounded-md border-2 border-gray-400 flex items-center justify-center">
      <img
        src="https://via.placeholder.com/600x400?text=Product+Image" // Replace with image URL
        alt="Switches"
        className="w-full h-full object-cover rounded-md"
      />
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
  <div className="max-w-5xl mx-auto flex flex-col items-center space-y-6">
    {/* Logo Section */}
    <div>
      <img 
        src="https://cdn.discordapp.com/attachments/1290735940368859211/1300104585242742875/Group_1.png?ex=67472d3f&is=6745dbbf&hm=a22a7939334b30f0703bc3356c22f8540ff32be2c3e3c60bb943244166cd91d8&" // Replace with your logo's URL
        alt="Logo"
        className="h-10" 
      />
    </div>

    {/* Navigation Links Section with Dividers */}
    <div className="flex items-center space-x-6 text-gray-700">
      <a 
        href="http://localhost:5173/shop"
        className="hover:text-gray-900 font-medium"
      >
        Shop
      </a>
      <span className="border-l border-gray-400 h-5"></span> {/* Divider */}
      <a 
        href="http://localhost:5173/keyboard-designer"
        className="hover:text-gray-900 font-medium"
      >
        Keyboard Designer
      </a>
      <span className="border-l border-gray-400 h-5"></span> {/* Divider */}
      <a 
        href="http://localhost:5173/about" 
        className="hover:text-gray-900 font-medium"
      >
        About
      </a>
    </div>

    {/* Social Media Icons */}
    <div className="flex justify-center space-x-6">
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
  </div>
</footer>


      </div>
    
    );
  }
  
  
  
  





  
  
  
  
  
    

