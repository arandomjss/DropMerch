import React, { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabaseClient";

const sampleFeatured = [
  { id: "1", name: "Cool Hoodie", price: 45 },
  { id: "2", name: "Funky Tee", price: 25 },
  { id: "3", name: "Dope Cap", price: 22 },
  { id: "4", name: "Sick Tote", price: 18 },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]); // <-- ADD THIS LINE
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
        .limit(4); // Only show the latest 4 products
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
      <section className="bg-gradient-to-br from-genzPink via-genzPurple to-genzBlue text-white">
        <div className="container-wide py-20 text-center">
          <h1 className="hero-title">YOUR VIBE, YOUR MERCH.</h1>
          <p className="hero-sub mt-4 max-w-2xl mx-auto">University merch that actually slaps. Submit your design, get it voted on, and rock your own creation on campus.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/shop" className="bg-white text-black font-bold py-3 px-8 rounded-full funky-btn shadow-md hover:scale-105 transition">
            Shop The Drop
            </Link>
            <button className="bg-black/30 text-white font-bold py-3 px-8 rounded-full funky-btn shadow-md hover:scale-105 transition">
             Create Your Own
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold mb-4">Need Merch Ideas?</h2>
          <p className="text-gray-600 mb-8">Stuck on a slogan? Drop a keyword and let our AI whip up some fire ideas for your next piece of merch.</p>

          <div className="max-w-md mx-auto flex items-center">
            <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                type="text"
                placeholder="e.g., State University"
                className="w-full px-4 py-3 rounded-l-lg border-2 border-genzGray bg-genzGray focus:outline-none"/>
                <button onClick={generate} className="bg-genzPurple text-white px-6 py-3 rounded-r-lg hover:bg-genzPink transition" style={{ height: "48px" }} >  Generate
                </button>
          </div>

          <div className="mt-8">
            {loading ? <div className="spinner mx-auto" /> : (
              slogans && (
                <div className="max-w-xl mx-auto text-left bg-gray-50 p-4 rounded-lg">
                  <ol className="list-decimal pl-6">
                    {slogans.map((s,i)=> <li key={i} className="py-1">{s}</li>)}
                  </ol>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container-wide">
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
        </div>
      </section>
    </>
  );
}
