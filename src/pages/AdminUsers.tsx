import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(console.log);
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, role, university_id, created_at");
      if (data) setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Example: Promote/demote admin (simple toggle)
  const toggleAdmin = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await supabase.from("users").update({ role: newRole }).eq("id", id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">University</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border">{user.id}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">{user.university_id}</td>
                <td className="p-2 border">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-2 border">
                  <button
                    className="text-indigo-600 hover:underline mr-2"
                    onClick={() => toggleAdmin(user.id, user.role)}
                  >
                    {user.role === "admin" ? "Demote" : "Promote"}
                  </button>
                  {/* Add deactivate/delete button if needed */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;