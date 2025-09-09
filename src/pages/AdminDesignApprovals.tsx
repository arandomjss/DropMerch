import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Adjust the table/fields below to match your actual design submissions table
const AdminDesignApprovals = () => {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      // Replace "design_submissions" and fields with your actual table/fields
      const { data, error } = await supabase
        .from("design_submissions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (data) setDesigns(data);
      setLoading(false);
    };
    fetchDesigns();
  }, []);

  const handleApprove = async (id: string) => {
    await supabase.from("design_submissions").update({ status: "approved" }).eq("id", id);
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  const handleReject = async (id: string) => {
    await supabase.from("design_submissions").update({ status: "rejected" }).eq("id", id);
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Design Approvals</h1>
      {loading ? (
        <p>Loading...</p>
      ) : designs.length === 0 ? (
        <p>No pending designs.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Submitted</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {designs.map((design) => (
              <tr key={design.id}>
                <td className="p-2 border">{design.id}</td>
                <td className="p-2 border">{design.user_id}</td>
                <td className="p-2 border">
                  {design.image_url && (
                    <img src={design.image_url} alt="Design" className="h-16 w-16 object-cover" />
                  )}
                </td>
                <td className="p-2 border">{new Date(design.created_at).toLocaleString()}</td>
                <td className="p-2 border">
                  <button
                    className="text-green-600 mr-2"
                    onClick={() => handleApprove(design.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleReject(design.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDesignApprovals;