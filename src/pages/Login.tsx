import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else if (data && data.user) {
      // After login, get the session user and upsert into custom users table
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData?.session?.user;
      if (sessionUser) {
        console.log('Login: upserting user from session', sessionUser.id, sessionUser.email);
        const { error: userUpsertError } = await supabase.from("users").upsert([
          {
            id: sessionUser.id,
            email: sessionUser.email,
          },
        ], { onConflict: "id" });
        if (userUpsertError) {
          console.error("User upsert error:", userUpsertError);
        } else {
          console.log('User upserted successfully');
        }
      }
      navigate("/");
    }
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
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
          Login
        </button>
      </form>
      <div className="text-center mt-4">
        Don't have an account? <Link to="/signup" className="text-genzPurple hover:underline">Sign up</Link>
      </div>
    </div>
  );
} 