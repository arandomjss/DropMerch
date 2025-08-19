import React from "react";

const Products: React.FC = () => {
  return (
    <section className="products">
      <h2>Featured Merchandise</h2>
      <div className="product-grid">
        <div className="product-card">
          <img src="tshirt.jpg" alt="T-Shirt" />
          <h3>University T-Shirt</h3>
          <p>$20</p>
          <button>Add to Cart</button>
        </div>
        <div className="product-card">
          <img src="hoodie.jpg" alt="Hoodie" />
          <h3>University Hoodie</h3>
          <p>$35</p>
          <button>Add to Cart</button>
        </div>
      </div>
    </section>
  );
};

export default Products;
