import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl md:text-8xl font-black text-[#ff7a00]/opacity-90 mb-2">
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
          Page not found
        </h1>
        <p className="text-slate-500 text-sm md:text-base mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-[#ff7a00] hover:bg-[#e56e00] text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            <FaHome />
            Back to Home
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default NotFound;