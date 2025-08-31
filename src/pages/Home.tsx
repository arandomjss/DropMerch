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
      <section id="ideas" className="w-full py-16 bg-white flex flex-col items-center px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center text-genzPurple">
          Need Merch Ideas?
        </h2>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
          Type your campus, club, or vibe and get instant slogan inspiration!
        </p>
        <div className="w-full max-w-xl flex flex-col sm:flex-row gap-2 mb-8">
          <input value={keyword} onChange={e => setKeyword(e.target.value)} type="text" placeholder="e.g., State University" className="flex-1 px-4 h-12 rounded-l-lg border-2 border-genzGray bg-genzGray focus:outline-none" />
          <button onClick={generate} className="bg-genzPurple text-white px-6 h-12 rounded-r-lg hover:bg-genzPink transition font-bold">
            ✨ Generate
          </button>
        </div>
        {loading && (
          <div className="text-genzPurple font-semibold mb-4">Generating...</div>
        )}
        {slogans && (
          <ul className="w-full max-w-xl mx-auto grid gap-3">
            {slogans.map((s, i) => (
              <li
                key={i}
                className="bg-genzGray rounded-lg px-4 py-3 text-center font-semibold text-gray-800 shadow"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </section>

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
