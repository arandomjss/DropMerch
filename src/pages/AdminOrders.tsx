import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [viewOrder, setViewOrder] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setStatusUpdating(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (!error) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } else {
      alert("Failed to update status");
    }
    setStatusUpdating(null);
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    (order.user_id && order.user_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID or User ID"
          className="border px-3 py-2 rounded w-full md:w-1/2"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.user_id}</td>
                <td className="p-2 border">{order.total_amount}</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border">{new Date(order.created_at).toLocaleString()}</td>
                <td className="p-2 border">
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => setViewOrder(order)}
                  >
                    View
                  </button>
                  <select
                    value={order.status}
                    disabled={statusUpdating === order.id}
                    onChange={e => handleStatusUpdate(order.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Order Details Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow max-w-lg w-full max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-bold mb-4">Order Details</h2>
            <div className="overflow-y-auto flex-1 mb-4">
                <div className="mb-2"><strong>Order ID:</strong> {viewOrder.id}</div>
                <div className="mb-2"><strong>User ID:</strong> {viewOrder.user_id}</div>
                <div className="mb-2"><strong>Total:</strong> {viewOrder.total_amount}</div>
                <div className="mb-2"><strong>Status:</strong> {viewOrder.status}</div>
                <div className="mb-2"><strong>Created:</strong> {new Date(viewOrder.created_at).toLocaleString()}</div>
                <div className="mb-2"><strong>Address:</strong> {viewOrder.address}</div>
                <div className="mb-2"><strong>Name:</strong> {viewOrder.name}</div>
                <div className="mb-2"><strong>Phone:</strong> {viewOrder.phone}</div>
                <div className="mb-2"><strong>Items:</strong>
                <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(viewOrder.items, null, 2)}</pre>
                </div>
            </div>
            <div className="flex justify-end">
                <button
                className="bg-gray-300 px-4 py-1 rounded"
                onClick={() => setViewOrder(null)}
                >
                Close
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default AdminOrders;