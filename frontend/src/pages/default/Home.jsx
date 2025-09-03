import React from "react";
import { ShoppingCart, BarChart2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 shadow-md bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Muibu</h1>
        <div className="space-x-4">
          <button onClick={() => navigate('/signin')} className="px-4 py-2 rounded-xl border border-blue-600 bg-white text-blue-600 hover:bg-blue-100 transition">
            Sign in
          </button>
          <button  onClick={() => navigate('/signup')} className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-700 transition">
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center px-10 py-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            Multiple Business Monitoring System
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Muibu is a smart platform designed for small businesses that run
            multiple stores or services. It allows you to track sales, monitor
            attendance, and manage point of sale operations in one place.
            Whether you own a coffee shop, a mini-grocery, or a growing chain of
            services, Muibu adapts to your needs and grows with your business.
          </p>
          <button  onClick={() => navigate('/signup')} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Get Started
          </button>
        </motion.div>
        <motion.img
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          src="https://img.freepik.com/free-vector/analytics-concept-illustration_114360-386.jpg"
          alt="Business Monitoring"
          className="rounded-2xl shadow-xl"
        />
      </section>

      <section className="grid md:grid-cols-3 gap-8 px-10 py-20 bg-gray-50">
        {/* Pos */}
        <motion.div whileHover={{ scale: 1.05 }} className="col-span-1">
          <div className="shadow-xl border-0 rounded-2xl p-6 bg-white">
            <ShoppingCart className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Point of Sales</h3>
            <p className="text-gray-600 text-sm mb-2">
              Our POS System simplifies the checkout process keep every
              transaction recorded in realtime.
            </p>
            <p className="text-gray-600 text-sm">
              Designed for flexibility, you can run multiple counters, accept
              different payment methods, and generate receipts instantly. This
              ensures accuracy, faster transactions, and an improved customer
              experience.
            </p>
          </div>
        </motion.div>

        {/* Sales Monitoring */}
        <motion.div whileHover={{ scale: 1.05 }} className="col-span-1">
          <div className="shadow-xl border-0 rounded-2xl p-6 bg-white">
            <BarChart2 className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Sales Monitoring</h3>
            <p className="text-gray-600 text-sm mb-2">
              Stay updated on your daily, weekly, and monthly sales with
              beautifully designed charts and reports.
            </p>
            <p className="text-gray-600 text-sm">
              Muibu highlights your best-selling products and services, helping
              you make informed decisions about stock, pricing, and promotions.
              Identify trends and maximize profits effortlessly.
            </p>
          </div>
        </motion.div>

        {/* Attendance */}
        <motion.div whileHover={{ scale: 1.05 }} className="col-span-1">
          <div className="shadow-xl border-0 rounded-2xl p-6 bg-white">
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Attendance Tracking</h3>
            <p className="text-gray-600 text-sm mb-2">
              Monitor employee attendance seamlessly with daily check-in and
              check-out logs.
            </p>
            <p className="text-gray-600 text-sm">
              The system records rendered working hours, giving you clarity on
              staff performance and productivity. This improves accountability
              and reduces errors in payroll computation.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Info Section */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-bold text-blue-700 mb-6"
        >
          Why Choose Muibu?
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-gray-700 max-w-3xl mx-auto mb-4"
        >
          Muibu is not just software it’s a complete business partner. From
          managing sales to tracking employees, it centralizes your operations
          into one smart dashboard. No more juggling multiple apps and
          spreadsheets.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="text-gray-700 max-w-3xl mx-auto"
        >
          Perfect for small businesses, startups, Muibu
          saves time, reduces costs, and provides insights that fuel growth.
        </motion.p>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center p-6 mt-10">
        <p>© 2025 Muibu Business Monitoring System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
