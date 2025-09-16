import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/ProductCard";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  created_at?: string;
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting & filtering states
  const [sortBy, setSortBy] = useState<"newest" | "priceLow" | "priceHigh">("newest");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(200);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
      } else {
        if (mounted) setProducts(data as Product[]);
      }
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Apply sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime();
    }
    if (sortBy === "priceLow") {
      return a.price - b.price;
    }
    if (sortBy === "priceHigh") {
      return b.price - a.price;
    }
    return 0;
  });

  // Apply filtering using Supabase "category"
  const filteredProducts = sortedProducts.filter((p) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      (p.category && selectedCategories.includes(p.category.toLowerCase()));
    const matchesPrice = p.price <= priceRange;
    return matchesCategory && matchesPrice;
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Define categories based on DB values
  const categories = [
    { value: "hoodie", label: "Hoodie" },
    { value: "tshirt", label: "T-Shirt" },
    { value: "cap", label: "Cap" },
    { value: "tote", label: "Tote" },
  ];

  return (
    <main className="container-wide py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black">The Student Shop</h1>
        <p className="text-gray-600 mt-2">
          Browse all the latest drops from campuses everywhere.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="lg:sticky top-24">
            <div className="filter-card p-4 border rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Category</h4>
                {categories.map((cat) => (
                  <label key={cat.value} className="block">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedCategories.includes(cat.value)}
                      onChange={() => handleCategoryChange(cat.value)}
                    />
                    {cat.label}
                  </label>
                ))}
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Max Price</h4>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>$10</span>
                  <span>${priceRange}</span>
                </div>
              </div>

              {/* Sorting */}
              <div>
                <h4 className="font-semibold mb-2">Sort By</h4>
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="newest">Newest</option>
                  <option value="priceLow">Price: Low → High</option>
                  <option value="priceHigh">Price: High → Low</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Section */}
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
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p as any} index={i} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products match your filters.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
