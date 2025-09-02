import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else if (data && data.user) {
      // Debug: log user info before insert
      console.log('Signup: inserting user', data.user.id, data.user.email);
      // Insert user into custom users table
      const { error: userInsertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
        },
      ]);
      if (userInsertError) {
        console.error("User insert error:", userInsertError);
      } else {
        console.log('User inserted successfully');
      }
      navigate("/");
    }
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg border border-genzGray"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-genzGray"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-genzPurple text-white py-3 rounded-lg hover:bg-genzPink transition">
          Sign Up
        </button>
      </form>
      <div className="text-center mt-4">
        Already have an account? <Link to="/login" className="text-genzPurple hover:underline">Login</Link>
      </div>
    </div>
  );
} 