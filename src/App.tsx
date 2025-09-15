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
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminDesignApprovals from "./pages/AdminDesignApprovals";
import Profile from "./pages/Profile";

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
              <Route path="/admin" element={ <AdminRoute> <AdminDashboard /> </AdminRoute>}/>
              <Route path="/admin/products" element={ <AdminRoute> <AdminProducts /> </AdminRoute>}/>
              <Route path="/admin/orders" element={ <AdminRoute> <AdminOrders /> </AdminRoute>}/>
              <Route path="/admin/users" element={ <AdminRoute> <AdminUsers /> </AdminRoute>}/>
              <Route path="/admin/design-approvals" element={ <AdminRoute> <AdminDesignApprovals /> </AdminRoute>}/>
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </Router>
      </div>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
