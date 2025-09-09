import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <p className="mb-2">Manage, add, or edit products available in the shop.</p>
          <Link to="/admin/products" className="text-indigo-600 hover:underline">
            Manage Products
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="mb-2">View and manage all orders placed by users.</p>
          <Link to="/admin/orders" className="text-indigo-600 hover:underline">
            Manage Orders
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="mb-2">View users, promote admins, or deactivate accounts.</p>
          <Link to="/admin/users" className="text-indigo-600 hover:underline">
            Manage Users
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Design Approvals</h2>
          <p className="mb-2">Approve or reject student-submitted designs.</p>
          <Link to="/admin/design-approvals" className="text-indigo-600 hover:underline">
            Manage Designs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;