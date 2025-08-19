import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function DropMerch() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    university_id: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("products").insert([
      {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image_url: form.image_url,
        university_id: Number(form.university_id),
      },
    ]);
    if (error) console.error(error);
    else alert("Product added!");
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Merchandise</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Name"
          className="border w-full p-2"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="border w-full p-2"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className="border w-full p-2"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          className="border w-full p-2"
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <input
          type="number"
          placeholder="University ID"
          className="border w-full p-2"
          onChange={(e) => setForm({ ...form, university_id: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
export default DropMerch;
