const categories = [
  {
    id: 1,
    name: "پوشاک مردانه",
    image: "https://via.placeholder.com/400x300?text=Men",
  },
  {
    id: 2,
    name: "پوشاک زنانه",
    image: "https://via.placeholder.com/400x300?text=Women",
  },
  {
    id: 3,
    name: "کفش",
    image: "https://via.placeholder.com/400x300?text=Shoes",
  },
  {
    id: 4,
    name: "اکسسوری",
    image: "https://via.placeholder.com/400x300?text=Accessories",
  },
];

export default function FeaturedCategories() {

    return (

        <section className="py-10 " dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">دسته بندی ویژه</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <a key={cat.id} href="#" 
                            className="group relative block rounded-xl overflow-hidden shadow hover:shadow-lg transition">

                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-40 object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-lg font-semibold">{cat.name}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}