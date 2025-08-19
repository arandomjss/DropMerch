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
};

const COLORS = ["#FFC700","#FF007A","#8F00FF","#34D399","#1E40AF","#D97706"];

export default function ProductCard({ product, index = 0 }: Props) {
  const { dispatch } = useCart();
  const bannerColor = product.image_url ? undefined : COLORS[index % COLORS.length];

  return (
    <div className="product-tile">
      {product.image_url ? (
        <div className="product-banner" style={{ backgroundImage: `url(${product.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      ) : (
        <div className="product-banner" style={{ background: bannerColor }}>{product.name}</div>
      )}

      <div className="product-details">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <p className="text-gray-600 mt-1">{product.description || "By @CreatorName"}</p>
        <a className="generate-desc" href="#">✨ Generate Description</a>

        <div className="flex items-center justify-between mt-4">
          <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
          <button
            onClick={() => dispatch({ type: "ADD", payload: { id: product.id, name: product.name, price: product.price, quantity: 1 } })}
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
