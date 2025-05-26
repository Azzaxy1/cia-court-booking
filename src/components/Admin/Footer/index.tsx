import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-md">
      <div className="w-full mx-auto py-4 px-5 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Abdurrohman Azis; All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
