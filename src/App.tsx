import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DesignStudio from "./pages/DesignStudio";

function App() {
  return (
  <AuthProvider>
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
        <Router>
          <Navbar />
          <main className="w-full px-0 py-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/orders" element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              } />
              <Route path="/design-studio" element={<DesignStudio />} />
            </Routes>
          </main>
        </Router>
      </div>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
