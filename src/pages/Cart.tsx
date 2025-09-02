import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const total = cart.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      if (!user) throw new Error("You must be logged in to checkout.");
      if (!address || !name || !phone) throw new Error("Please fill all details.");
      const { error } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          items: cart,
          total_amount: total,
          address,
          name,
          phone,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) throw error;
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || "Order failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item: { id: string; name: string; price: number; quantity: number }) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white shadow rounded-lg p-4"
            >
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  {item.quantity} × ₹{item.price}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold">Total:</h2>
            <p className="text-xl font-bold">₹{total.toFixed(2)}</p>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-4 hover:bg-gray-400"
            >
              Clear Cart
            </button>
            <button
              onClick={() => setShowCheckout(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCheckout(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Confirm Your Order</h2>
            <form className="space-y-4 mb-4" onSubmit={e => { e.preventDefault(); handleCheckout(); }}>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 rounded-lg border"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-2 rounded-lg border"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-lg border"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
              <ul className="mb-4">
                {cart.map((item: { id: string; name: string; price: number; quantity: number }) => (
                  <li key={item.id} className="flex justify-between py-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
              {error && <p className="text-red-500 mb-2">{error}</p>}
              {success ? (
                <p className="text-green-600 font-semibold mb-2">Order placed successfully!</p>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Confirm Order"}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}