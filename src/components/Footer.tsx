import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer mt-16">
      <div className="container-wide py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">DropMerch</h3>
          <p className="text-gray-300">Merch by students, for students.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Shop</h3>
          <ul className="text-gray-300 space-y-2">
            <li>New Arrivals</li>
            <li>T-Shirts</li>
            <li>Hoodies</li>
            <li>Accessories</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Support</h3>
          <ul className="text-gray-300 space-y-2">
            <li>FAQ</li>
            <li>Shipping & Returns</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
          <form className="flex flex-col">
            <input type="email" placeholder="Enter your email" className="mb-3 px-3 py-2 rounded-md bg-gray-800 text-white" />
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-6 text-gray-400">© 2025 DropMerch. All Rights Reserved.</div>
    </footer>
  );
}
