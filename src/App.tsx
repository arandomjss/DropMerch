import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
        <Router>
          <Navbar />
          <main className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
        </Router>
      </div>
    </CartProvider>
  );
}

export default App;
