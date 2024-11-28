
export default function Home() {
    return (
      <div className="bg-yellow-50 min-h-screen font-sans">
    <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
/>

        {/* Section */}
        <section className="bg-primary py-28 px-8 text-left mt-20">
          <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center">
            
            {/* Left Text Section */}
            <div className="flex flex-col space-y-4 w-full md:w-1/2">
              <h2 className="text-3xl font-display text-primary-darker drop-shadow-cartoon">
                Your one-stop shop for
              </h2>
              <h2 className="text-5xl font-display text-primary-dark drop-shadow-cartoon">
           KEYCAPS, SWITCHES & 
            </h2>
            <h2 className="text-5xl font-display text-primary-dark drop-shadow-cartoon"> 
           KEYBOARD
            </h2>
              <div className="flex justify-start space-x-4 mt-6">
              <button 
              onClick={() => (window.location.href = "http://localhost:5173/shop")}
              className="bg-white text-black font-body px-6 py-2 rounded-full border-2 border-black drop-shadow-cartoon hover:opacity-90">
          Shop Now
            </button>
            <button
  onClick={() => (window.location.href = "http://localhost:5173/keyboard-designer")}
  className="bg-yellow-500 text-black font-body px-6 py-2 rounded-full border-2 border-black drop-shadow-cartoon hover:bg-yellow-600"
>
  Try Our Keyboard Designer
</button>

              </div>
            </div>
  
            {/* Right Image Section with Border */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <img
              src="https://via.placeholder.com/600x400?text=Product+Image" /* TODO: replace placeholder with actual product images*/
              alt="Keyboard or Keycaps"
              className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-400"
            />
          </div>
        </div>
      </section>
  
     {/*product section */}
      <section className="py-16 px-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg mx-auto">
    {[
      { name: "Keycaps", img: "https://via.placeholder.com/600x400?text=Product+Image" }, /* TODO: replace placeholder with actual product images */
      { name: "Switches", img: "https://via.placeholder.com/600x400?text=Product+Image" }, /* TODO: replace placeholder with actual product images */
      { name: "Keyboard Bases", img: "https://via.placeholder.com/600x400?text=Product+Image" }, /* TODO: replace placeholder with actual product images */
    ].map(({ name, img }, index) => (
      <div
        key={index}
        className="bg-secondary rounded-lg p-8 flex flex-col items-center shadow-md border-2 border-black" 
      >
        {/* Image */}
        <img
          src={img} 
          alt={name}
          className="h-40 w-full object-cover rounded-md mb-4"
        />
        <h3 className="text-xl font-body">{name}</h3>
        <button
          onClick={() => (window.location.href = "http://localhost:5173/shop")}
          className="mt-4 bg-secondary-darker hover:bg-blue-600 text-black font-body px-4 py-2 rounded-full border-2 border-black shadow-lg"
        >
          Shop →
        </button>
      </div>
    ))}
  </div>
</section>
    

<section className="py-16 px-8">
<div className="flex gap-6">
    {/* First Product Image Box */}
    <div className="h-64 w-full bg-gray-200 rounded-md border-4 border-pink-100 flex items-center justify-center">
      <img
        src="https://via.placeholder.com/600x400?text=Product+Image" /* replace placeholder with actual product images */
        alt="Keycaps"
        className="w-full h-full object-cover rounded-md"
      />
    </div>

    {/* Second Product Image Box */}
    <div className="h-64 w-full bg-gray-200 rounded-md border-4 border-purple-100 flex items-center justify-center">
      <img
        src="https://via.placeholder.com/600x400?text=Product+Image" /* replace placeholder with actual product images */
        alt="Switches"
        className="w-full h-full object-cover rounded-md"
      />
    </div>
  </div>
</section>

    
        {/* Reviews Section with Star Icons */}
      <section className="py-16 px-8 bg-yellow-50">
        <h2 className="text-2xl font-body text-center mb-8">Latest Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-lg mx-auto">
          {["bg-primary-dark", "bg-blue-100", "bg-purple-100", "bg-pink-100"].map(
            (bgColor, index) => (
              <div
                key={index}
                className={`${bgColor} p-6 rounded-lg shadow-md text-center`}
              >
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h4 className="text-lg font-display">Review Title</h4>
                <p className="text-gray-600 font-body mt-2">Review Body</p>
                <p className="text-sm text-gray-500 font-body mt-4">
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
  <div className="max-w-screen-lg mx-auto flex flex-col items-center space-y-6">
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
        className="hover:text-gray-900 font-body"
      >
        Shop
      </a>
      <span className="border-l border-gray-400 h-5"></span> {/* Divider */}
      <a 
        href="http://localhost:5173/keyboard-designer"
        className="hover:text-gray-900 font-body"
      >
        Keyboard Designer
      </a>
      <span className="border-l border-gray-400 h-5"></span> {/* Divider */}
      <a 
        href="http://localhost:5173/about" 
        className="hover:text-gray-900 font-body"
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
  
  
  
  





  
  
  
  
  
    

