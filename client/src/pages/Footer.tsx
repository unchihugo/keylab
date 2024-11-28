

const Footer = () => (
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
</footer> );