import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

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

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Clear Cart
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
