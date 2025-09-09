import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: 0, stock: 0, image_url: "", description: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete product.");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

const handleEditSave = async () => {
  if (!editing) return;
  const { error } = await supabase
    .from("products")
    .update({
      name: editForm.name,
      price: Number(editForm.price),
      stock: Number(editForm.stock),
      image_url: editForm.image_url,
      description: editForm.description,
    })
    .eq("id", editing.id);
  if (!error) {
    setEditing(null);
    fetchProducts();
  } else {
    alert("Failed to update product.");
  }
};

const handleEdit = (prod: any) => {
  setEditing(prod);
  setEditForm({
    name: prod.name,
    price: prod.price,
    stock: prod.stock,
    image_url: prod.image_url || "",
    description: prod.description || "",
  });
};

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td className="p-2 border">{prod.name}</td>
                <td className="p-2 border">
                {prod.image_url && (
                    <img src={prod.image_url} alt={prod.name} className="h-12 w-12 object-cover" />
                )}
                </td>
                <td className="p-2 border">{prod.price}</td>
                <td className="p-2 border">{prod.stock}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(prod)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(prod.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Edit Product</h2>
            <label className="block mb-2">
                Name:
                <input
                className="border p-1 w-full"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                />
            </label>
            <label className="block mb-2">
                Price:
                <input
                className="border p-1 w-full"
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleEditChange}
                />
            </label>
            <label className="block mb-4">
                Stock:
                <input
                className="border p-1 w-full"
                name="stock"
                type="number"
                value={editForm.stock}
                onChange={handleEditChange}
                />
            </label>
            <label className="block mb-2">
                Image URL:
                <input
                className="border p-1 w-full"
                name="image_url"
                value={editForm.image_url}
                onChange={handleEditChange}
                />
            </label>
            <label className="block mb-4">
                Description:
                <textarea
                className="border p-1 w-full"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                />
            </label>
            <div className="flex gap-2">
                <button className="bg-indigo-600 text-white px-4 py-1 rounded" onClick={handleEditSave}>
                Save
                </button>
                <button className="bg-gray-300 px-4 py-1 rounded" onClick={() => setEditing(null)}>
                Cancel
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};




export default AdminProducts;