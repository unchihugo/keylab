import React from "react";
import Divider from "../components/Divider";
import LinkButton from "../components/LinkButton";

const NotFound: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <div className="px-8 md:px-20 py-8 md:py-28 bg-white drop-shadow-cartoon rounded-lg border border-black">
      <div className="text-4xl font-display">404 - Page not found</div>
      <Divider />
      <div className="text-lg font-body">We couldn’t find the page you were looking for :(</div>
      <LinkButton to="/" text="Go back home" buttonClassNames="mt-3 px-6" />
      </div>
    </div>
  );
}

export default NotFound;