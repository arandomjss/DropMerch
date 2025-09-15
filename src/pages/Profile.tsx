import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    university_id: user?.university_id || "",
    profile_picture: user?.profile_picture || "",
  });
  const [universities, setUniversities] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoadingProfile(false);
    } else {
      setLoadingProfile(true);
      const timer = setTimeout(() => {
        if (!user) navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  
    useEffect(() => {
        if (!user) return;
        supabase.from("universities").select("id, name").then(({ data }) => {
            setUniversities(data || []);
        });
        supabase
            .from("designs")
            .select("*")
            .eq("user_id", user.id)
            .then(({ data }) => {
            setDesigns(data || []);
            });
        }, [user]);

    const handleToggleDisplay = async (designId: string, current: boolean) => {
        await supabase
            .from("designs")
            .update({ display_on_profile: !current })
            .eq("id", designId);
        
        const { data } = await supabase
            .from("designs")
            .select("*")
            .eq("user_id", user.id);
        setDesigns(data || []);
        };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const { error } = await supabase
            .from("users")
            .update({ name: form.name 
                , phone: form.phone ?? "",
                profile_picture: form.profile_picture ?? "",
                university_id: form.university_id || null
            })
            .eq("id", user.id);
        if (!error) {
            setUser({ ...user, name: form.name });
            setMessage("Profile updated!");
        } else {
            setMessage("Failed to update profile.");
            console.error(error); 
        }
        setLoading(false);
        };

        const handleLogout = async () => {
            await supabase.auth.signOut();
            navigate("/login");
    };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-genzPurple text-xl">Loading profile...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col items-center min-h-[80vh] bg-genzGray px-2 py-8">
      {/* Profile Card */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg flex flex-col items-center p-6 mb-6">
        <div className="relative">
          <img
            src={
              form.profile_picture ||
              "https://ui-avatars.com/api/?name=" + encodeURIComponent(form.name)
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-genzPurple object-cover"
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-genzPurple">{form.name}</h2>
        <div className="text-genzBlue font-semibold">{user?.role}</div>
        <div className="text-genzPink mt-1">
          {universities.find((u) => u.id === form.university_id)?.name || "No university"}
        </div>
        <div className="flex gap-6 mt-4">
          <div className="flex flex-col items-center">
            <span className="font-bold text-genzPurple">{designs.length}</span>
            <span className="text-xs text-genzGray-700">Designs</span>
          </div>
        </div>
      </div>

      {/* Public Designs Section */}
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 mt-6">
        <h3 className="text-xl font-bold text-genzPurple mb-4">My Public Designs</h3>
        <div className="grid grid-cols-2 gap-4">
            {designs.filter(d => d.display_on_profile).map((design) => (
            <div key={design.id} className="flex flex-col items-center border rounded-lg p-2">
                <img
                src={design.image_url}
                alt={design.title}
                className="w-24 h-24 object-contain rounded mb-2"
                />
                <div className="font-semibold">{design.title}</div>
            </div>
            ))}
        </div>
        </div>

            {/* My Designs Section */}
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 mt-6">
        <h3 className="text-xl font-bold text-genzPurple mb-4">My Designs</h3>
        {designs.length === 0 && (
            <div className="text-genzGray-700">No designs uploaded yet.</div>
            )}
        <div className="grid grid-cols-2 gap-4">
            {designs.map((design) => (
            <div key={design.id} className="flex flex-col items-center border rounded-lg p-2">
                <img
                src={design.image_url}
                alt={design.title}
                className="w-24 h-24 object-contain rounded mb-2"
                />
                <div className="font-semibold">{design.title}</div>
                <label className="flex items-center mt-2 text-xs">
                <input
                    type="checkbox"
                    checked={!!design.display_on_profile}
                    onChange={() => handleToggleDisplay(design.id, design.display_on_profile)}
                    className="mr-2"
                />
                Display on profile
                </label>
            </div>
            ))}
        </div>
        </div>

      {/* Editable Details */}
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-lg bg-white rounded-xl shadow p-6 flex flex-col gap-4"
      >
        <label className="font-semibold text-genzPurple">
          Name
          <input
            className="w-full border border-genzPurple rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-genzBlue"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="font-semibold text-genzPurple">
          Phone
          <input
            className="w-full border border-genzPurple rounded px-2 py-1 mt-1"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </label>
        <label className="font-semibold text-genzPurple">
          University
          <select
            className="w-full border border-genzPurple rounded px-2 py-1 mt-1"
            name="university_id"
            value={form.university_id}
            onChange={handleChange}
          >
            <option value="">Select university</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
        <label className="font-semibold text-genzPurple">
          Profile Picture URL
          <input
            className="w-full border border-genzPurple rounded px-2 py-1 mt-1"
            name="profile_picture"
            value={form.profile_picture}
            onChange={handleChange}
            placeholder="Paste image URL"
          />
        </label>
        <div className="font-semibold text-genzPurple">
          Email: <span className="text-genzBlue">{user?.email}</span>
        </div>
        <button
          type="submit"
          className="bg-genzBlue text-white rounded px-4 py-2 font-semibold hover:bg-genzPurple transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {message && <div className="text-genzPink">{message}</div>}
      </form>
      <button
        onClick={handleLogout}
        className="w-full max-w-lg mt-6 bg-genzPink text-white rounded px-4 py-2 font-semibold hover:bg-genzPurple transition"
      >
        Logout
      </button>
    </div>
  );
}

