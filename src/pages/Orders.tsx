import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

function Orders() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Orders</h2>
      <p className="text-gray-500">Order history will appear here.</p>
    </div>
  );
}
export default Orders;
