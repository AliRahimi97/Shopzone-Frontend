import { useEffect, useState } from "react";
import { FaLaptop, FaMobile, FaShoePrints, FaTv } from "react-icons/fa";



const categories = [
    {name: "mobile", icon: <FaMobile />},
    {name: "laptop", icon: <FaLaptop />},
    {name: "Tv", icon: <FaTv />},
    {name: "Monitor", icon: <FaTv />},
    {name: "shoes", icon: <FaShoePrints />}
];

const CategoryNav = () => {

    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > lastScrollY) { 
                setShow(false);
            }else {
                setShow(true);
            }
            setLastScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

  return (
    <div
      className={`fixed top-16 left-0 right-0 bg-white shadow-md px-6 py-2 flex space-x-6 space-x-reverse overflow-x-auto transition-transform duration-300 z-40 ${
        show ? "translate-y-0" : "-translate-y-16"
      }`}
      dir="rtl"
    >
      {categories.map((cat, index) => (
        <button
          key={index}
          className="group relative flex flex-col items-center px-4 py-2 text-gray-700 font-semibold hover:text-red-500 transition"
        >
          <span className="text-lg">{cat.icon}</span>
          <span className="relative">{cat.name}
             <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-red-500 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;