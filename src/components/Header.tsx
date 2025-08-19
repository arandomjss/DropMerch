import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { state } = useCart();
  return (
    <header className="header-sticky bg-white/80 sticky top-0 z-50 shadow-sm">
      <nav className="container-wide flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="DropMerch Logo" className="h-8 sm:h-10" />
          <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-800">DropMerch</Link>
        </div>

        <div className="hidden md:flex items-center space-x-8 font-semibold">
          <Link to="/shop" className="text-gray-700 hover:text-purple-600">Shop</Link>
          <a href="#" className="text-gray-700 hover:text-purple-600">Submit Design</a>
          <a href="#" className="text-gray-700 hover:text-purple-600">About</a>
          <a href="#" className="text-gray-700 hover:text-purple-600">Contact</a>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          <button className="text-gray-600 hover:text-purple-600"><i className="fas fa-search fa-lg"></i></button>
          <button className="text-gray-600 hover:text-purple-600"><i className="fas fa-user fa-lg"></i></button>
          <div className="relative text-gray-600">
            <i className="fas fa-heart fa-lg"></i>
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </div>
          <div className="relative text-gray-600">
            <Link to="/cart"><i className="fas fa-shopping-cart fa-lg"></i></Link>
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">{state.items.length}</span>
          </div>
        </div>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-gray-600"><i className="fas fa-bars fa-lg"></i></button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden px-6 pb-4">
          <a href="#" className="block py-2 text-purple-600 font-bold">Shop</a>
          <a href="#" className="block py-2 text-gray-600">Submit Design</a>
          <a href="#" className="block py-2 text-gray-600">About</a>
          <a href="#" className="block py-2 text-gray-600">Contact</a>
        </div>
      )}
    </header>
  );
}
