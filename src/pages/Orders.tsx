import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*, items")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Your Orders</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Order ID:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Date:</span>
                <span>{new Date(order.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total:</span>
                <span>₹{order.total_amount}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Address:</span>
                <span> {order.address || "-"}</span>
              </div>
              <div>
                <span className="font-semibold">Items:</span>
                <ul className="ml-4 list-disc">
                  {order.items && order.items.map((item: any) => (
                    <li key={item.id}>{item.name} × {item.quantity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Orders;