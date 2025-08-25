import React from "react";
import { useCart } from "../context/CartContext";

type Props = {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
  };
  index?: number;
  loading?: boolean;
};

const COLORS = ["#FFC700","#FF007A","#8F00FF","#34D399","#1E40AF","#D97706"];

export default function ProductCard({ product, index = 0, loading = false }: Props) {
  const { dispatch } = useCart();
  const bannerColor = product.image_url ? undefined : COLORS[index % COLORS.length];

  return (
    <div className="bg-white/80 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-genzGray">
      {loading ? (
        <div className="h-48 bg-genzGray" />
      ) : product.image_url ? (
        <div className="product-banner" style={{ backgroundImage: `url(${product.image_url})`, backgroundSize: "cover", backgroundPosition: "center", height: "12rem" }} />
      ) : (
        <div className="product-banner flex items-center justify-center h-48" style={{ background: bannerColor }}>
          <span className="text-white text-xl font-bold">{product.name}</span>
        </div>
      )}

      <div className="product-details p-4">
        <h3 className="text-lg font-bold">{loading ? <div className="h-4 bg-genzGray rounded w-3/4 mb-2" /> : product.name}</h3>
        <p className="text-gray-600 mt-1">{loading ? <div className="h-3 bg-genzGray rounded w-1/2" /> : (product.description || "By @CreatorName")}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="text-2xl font-bold">{loading ? <div className="h-6 bg-genzGray rounded w-12" /> : `$${product.price.toFixed(2)}`}</div>
          {!loading && (
            <button
              onClick={() => dispatch({ type: "ADD", payload: { id: product.id, name: product.name, price: product.price, quantity: 1 } })}
              className="bg-genzPurple text-white px-4 py-2 rounded-full hover:bg-genzPink transition"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}