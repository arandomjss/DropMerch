import React, { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#000", "#a78bfa", "#f9a8d4", "#7dd3fc"];
const SIZES = [2, 4, 8, 16];

const DesignStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "draw">("draw");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[0]);
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent) => {
    setDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  // Upload handler
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      if (uploadedImage && activeTab === "draw") {
        const img = new window.Image();
        img.src = uploadedImage;
        img.onload = () => ctx?.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      }
    }
  };

  // Draw uploaded image on canvas
  React.useEffect(() => {
    if (uploadedImage && canvasRef.current && activeTab === "draw") {
      const ctx = canvasRef.current.getContext("2d");
      const img = new window.Image();
      img.src = uploadedImage;
      img.onload = () => ctx?.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
  }, [uploadedImage, activeTab]);

  // Handle upload form submit (for Upload tab)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (!user) {
      setMessage("You must be logged in to upload.");
      setLoading(false);
      return;
    }
    if (!uploadedImage) {
      setMessage("Please select an image.");
      setLoading(false);
      return;
    }
    // Get the file from the input
    const fileInput = document.getElementById("design-upload") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      setMessage("No file selected.");
      setLoading(false);
      return;
    }
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
    // Use the correct bucket name (case-sensitive)
    const { error: uploadError } = await supabase.storage
    .from("designs")
    .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage("Failed to upload image.");
      console.error("Supabase upload error:", uploadError); // <-- Add this line
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("designs").getPublicUrl(filePath);
    const image_url = data.publicUrl;

    // Save to designs table
    const { error } = await supabase.from("designs").insert([
      {
        user_id: user.id,
        title,
        image_url,
        display_on_profile: false,
      },
    ]);
    if (!error) {
      setTitle("");
      setUploadedImage(null);
      setMessage("Design uploaded!");
    } else {
      setMessage("Failed to save design.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-2 py-6 bg-genzGray">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Controls Sidebar */}
        <div className="md:w-1/3 w-full flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-genzPurple mb-2">Design Studio</h2>
          <div className="flex gap-2 mb-4">
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === "upload" ? "bg-genzPurple text-white" : "bg-genzGray"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              Upload
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === "draw" ? "bg-genzPurple text-white" : "bg-genzGray"
              }`}
              onClick={() => setActiveTab("draw")}
            >
              Draw
            </button>
          </div>
          {activeTab === "upload" && (
            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
              <label className="block mb-2 font-semibold">Design Title:</label>
              <input
                className="border rounded px-2 py-1 mb-2"
                placeholder="Design Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <label className="block mb-2 font-semibold">Upload your design:</label>
              <input
                id="design-upload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-full"
                required
              />
              {uploadedImage && (
                <img src={uploadedImage} alt="Uploaded" className="mt-4 max-h-48 rounded shadow w-full object-contain" />
              )}
              <button
                type="submit"
                className="bg-genzBlue text-white rounded px-4 py-2 font-semibold"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Design"}
              </button>
              {message && <div className="text-genzPink">{message}</div>}
            </form>
          )}
          {activeTab === "draw" && (
            <div className="flex flex-col gap-4">
              <div>
                <span className="mr-2 font-semibold">Color:</span>
                <div className="flex gap-2 mt-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-genzPurple" : "border-gray-300"}`}
                      style={{ background: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="mr-2 font-semibold">Brush:</span>
                <select
                  value={size}
                  onChange={e => setSize(Number(e.target.value))}
                  className="border rounded px-2 py-1 mt-2"
                >
                  {SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
                </select>
              </div>
              <button
                onClick={clearCanvas}
                className="px-4 py-2 rounded-lg bg-genzPink text-white font-semibold mt-2"
              >
                Clear Canvas
              </button>
            </div>
          )}
        </div>
        {/* Canvas Area */}
        <div className="md:w-2/3 w-full flex flex-col items-center justify-center">
          {activeTab === "draw" && (
            <canvas
              ref={canvasRef}
              width={window.innerWidth < 600 ? 320 : 500}
              height={window.innerWidth < 600 ? 240 : 400}
              className="border rounded-xl bg-white shadow w-full max-w-[500px] h-auto"
              onMouseDown={startDrawing}
              onMouseUp={endDrawing}
              onMouseOut={endDrawing}
              onMouseMove={draw}
              style={{ touchAction: "none" }}
            />
          )}
          {activeTab === "upload" && uploadedImage && (
            <img
              src={uploadedImage}
              alt="Uploaded Preview"
              className="border rounded-xl bg-white shadow w-full max-w-[500px] h-auto object-contain mt-4"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;