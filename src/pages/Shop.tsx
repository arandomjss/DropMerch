import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/ProductCard";

type Product = { id: string; name: string; description?: string; price: number; image_url?: string; category?: string; };

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) {
        console.error(error);
      } else {
        if (mounted) setProducts(data as Product[]);
      }
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const placeholders = [
    { id: "p1", name: "Cool Hoodie", price: 45 },
    { id: "p2", name: "Funky Tee", price: 25 },
    { id: "p3", name: "Dope Cap", price: 22 },
    { id: "p4", name: "Sick Tote", price: 18 },
  ];

  return (
    <main className="container-wide py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black">The Student Shop</h1>
        <p className="text-gray-600 mt-2">Browse all the latest drops from campuses everywhere.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4">
          <div className="lg:sticky top-24">
            <div className="filter-card">
              <h3 className="text-xl font-bold mb-4">Filters</h3>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Category</h4>
                <label className="block"><input type="checkbox" className="mr-2" />Hoodies</label>
                <label className="block"><input type="checkbox" className="mr-2" />T-Shirts</label>
                <label className="block"><input type="checkbox" className="mr-2" />Caps</label>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Price</h4>
                <input type="range" min="10" max="200" defaultValue={75} />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>$10</span><span>$200</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ProductCard
                  key={`skeleton-${i}`}
                  product={{ id: "", name: "", price: 0 }}
                  index={i}
                  loading={true}
                />
              ))
            ) : (
              (products.length ? products : placeholders).map((p, i) => (
                <ProductCard key={p.id} product={p as any} index={i} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
