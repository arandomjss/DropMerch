import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import logo from "../../assets/98ae8355-9ea4-45e6-8a90-83c31c834dcc.jpg";

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 tracking-wide">
          <img src={logo} alt="DropMerch Logo" className="h-8 w-8 object-cover rounded-full" />
          DropMerch
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/shop" className="hover:text-indigo-600 transition-colors">
            Shop
          </Link>
          <Link to="/orders" className="hover:text-indigo-600 transition-colors">
            Orders
          </Link>
          <Link to="/about" className="hover:text-indigo-600 transition-colors">
            About
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
