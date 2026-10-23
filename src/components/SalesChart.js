import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


const SalesChart = () => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/orders")
            .then((res) => res.json())
            .then((data) => setOrders(data));
    }, []);

    const monthlySales = {};

    orders.forEach(order => {
        const date = new Date(order.date); // تبدیل رشته به تاریخ
        const month = date.toLocaleString("fa-IR", { month: "long"}); //گرفتن نام ماه 
         
        const total = parseFloat(order.total || 0); // مقدار فروش در این سفارش
        monthlySales[month] = (monthlySales[month] || 0) + total; // جمع‌زنی فروش هر ماه
    });

    // تبدیل به آرایه‌ای که Recharts بفهمه
    const chartData = Object.entries(monthlySales).map(([month, total]) => ({
        month,
        total,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mt-6">
            <h3 className="text-lg font-semibold mb-4">📊 نمودار فروش ماهانه</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#4f46e5" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SalesChart;