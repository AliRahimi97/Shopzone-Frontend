import { Link } from "react-router-dom";
import home from "../../assets/images/home.jpg";
import book from "../../assets/images/books.png";
import sport from "../../assets/images/sports.png";
import market from "../../assets/images/market.png";
import baby from "../../assets/images/baby.png";
import beauty from "../../assets/images/beauty.png";
import electric from "../../assets/images/electric.png";
import food from "../../assets/images/food.png";

const categories = [
  { id: 1, name: "Electronics", image: electric, category: "ELECTRONICS", link: "/category/ELECTRONICS" },
  { id: 2, name: "Clothing", image: beauty, category: "CLOTHING", link: "/category/CLOTHING" },
  { id: 3, name: "Books", image: book, category: "BOOKS", link: "/category/BOOKS" },
  { id: 4, name: "Home", image: home, category: "HOME", link: "/category/HOME" },
  { id: 5, name: "Beauty", image: beauty, category: "BEAUTY", link: "/category/BEAUTY" },
  { id: 6, name: "Toys", image: baby, category: "TOYS", link: "/category/TOYS" },
  { id: 7, name: "Sports", image: sport, category: "SPORTS", link: "/category/SPORTS" },
  { id: 8, name: "Food", image: food, category: "FOOD", link: "/category/FOOD" },
  { id: 9, name: "Furniture", image: market, category: "FURNITURE", link: "/category/FURNITURE" },
];

export default function ProductGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Shop by Category
        </h2>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
          Explore our wide range of products and find exactly what you need
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.link}
            className="group flex flex-col items-center text-center"
          >
            {/* Image Circle */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4">
              {/* Background circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"></div>

              {/* Image */}
              <div className="absolute inset-0 flex items-center justify-center p-5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Hover ring effect */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-orange-400 transition-all duration-300"></div>
            </div>

            {/* Category Name */}
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-orange-500 transition-colors duration-300">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}