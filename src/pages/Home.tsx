import React, { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabaseClient";
import Hero from "../components/hero";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]); 
  const [keyword, setKeyword] = useState("");
  const [slogans, setSlogans] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4); 
      if (!error && mounted) setProducts(data || []);
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function generate() {
    if (!keyword) return;
    setLoading(true);
    setTimeout(() => {
      setSlogans([
        `${keyword} Vibes Only`,
        `${keyword} Forever`,
        `No Sleep, Just ${keyword}`,
        `${keyword} State of Mind`,
        `${keyword} & Chill`,
      ]);
      setLoading(false);
    }, 700);
  }

  return (
    <>
      <Hero/>
      <section className="w-full py-12 bg-gray-50 px-4">
        
          <h2 className="text-2xl font-bold mb-6 text-center">Hot Right Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ProductCard key={i} product={{ id: "", name: "", price: 0 }} index={i} loading={true} />
                ))
              : products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
          </div>
        
      </section>
    </>
  );
}
