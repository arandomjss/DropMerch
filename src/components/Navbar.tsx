import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import logo from "../../assets/98ae8355-9ea4-45e6-8a90-83c31c834dcc.jpg";
import React, { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-indigo-600 tracking-wide">
          <img src={logo} alt="DropMerch Logo" className="h-9 w-9 object-cover rounded-full" />
          <span className="whitespace-nowrap">DropMerch</span>
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/shop" className="hover:text-indigo-600 transition-colors">Shop</Link>
          <Link to="/orders" className="hover:text-indigo-600 transition-colors">Orders</Link>
          <Link to="/about" className="hover:text-indigo-600 transition-colors">About</Link>
          <Link to="/cart" className="hover:text-indigo-600 transition-colors">Cart</Link>
          {user ? (
            <button
              onClick={async () => { await supabase.auth.signOut(); }}
              className="hover:text-indigo-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-indigo-600 transition-colors">Login</Link>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white/90 ">
          <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/orders" onClick={() => setOpen(false)}>Orders</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/cart" onClick={() => setOpen(false)}>Cart</Link>
          {user ? (
            <button
              onClick={async () => { await supabase.auth.signOut(); setOpen(false); }}
              className="block w-full text-center"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}