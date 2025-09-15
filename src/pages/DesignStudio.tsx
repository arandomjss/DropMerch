import React, { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

const PRESET_COLORS = [
  "#000000", "#ffffff", "#a78bfa", "#f9a8d4", "#7dd3fc", "#f87171", "#fbbf24", "#34d399", "#60a5fa", "#6366f1", "#d946ef"
];
const SIZES = [2, 4, 8, 16, 24, 32];
const SHAPES = ["none", "rectangle", "circle", "line"];

const DesignStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [customColor, setCustomColor] = useState("#000000");
  const [size, setSize] = useState(SIZES[0]);
  const [isEraser, setIsEraser] = useState(false);
  const [shape, setShape] = useState("none");
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [canvasDims, setCanvasDims] = useState({ width: 800, height: 500 });
  const [activeTab, setActiveTab] = useState<"upload" | "draw">("draw");
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Responsive canvas size
  React.useEffect(() => {
    const updateDims = () => {
      if (window.innerWidth < 600) setCanvasDims({ width: 320, height: 400 });
      else if (window.innerWidth < 900) setCanvasDims({ width: 500, height: 400 });
      else setCanvasDims({ width: 800, height: 500 });
    };
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  // Drawing handlers
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    } else {
      return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
    }
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    setDrawing(true);
    setStartPos(pos);

    if (shape === "none" && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const endDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !canvasRef.current) return;
    setDrawing(false);
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    if (shape !== "none" && startPos) {
      const end = getPos(e);
      ctx.lineWidth = size;
      ctx.strokeStyle = isEraser ? "#fff" : color;
      ctx.fillStyle = isEraser ? "#fff" : color;
      switch (shape) {
        case "rectangle":
          ctx.beginPath();
          ctx.rect(startPos.x, startPos.y, end.x - startPos.x, end.y - startPos.y);
          ctx.fill();
          break;
        case "circle":
          ctx.beginPath();
          const radius = Math.sqrt(Math.pow(end.x - startPos.x, 2) + Math.pow(end.y - startPos.y, 2));
          ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
          ctx.fill();
          break;
        case "line":
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          break;
      }
    }
    ctx?.beginPath();
    setStartPos(null);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !canvasRef.current || shape !== "none") return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.strokeStyle = isEraser ? "#fff" : color;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  // Touch event wrappers
  const handleTouchStart = (e: React.TouchEvent) => startDraw(e);
  const handleTouchEnd = (e: React.TouchEvent) => endDraw(e);
  const handleTouchMove = (e: React.TouchEvent) => draw(e);

  // Color palette and hex input
  const handleColorChange = (c: string) => {
    setColor(c);
    setCustomColor(c);
    setIsEraser(false);
  };
  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setColor(e.target.value);
    setIsEraser(false);
  };

  // Eraser
  const handleEraser = () => {
    setIsEraser(true);
    setShape("none");
  };

  // Clear canvas
  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Upload handler for image files
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
    const { error: uploadError } = await supabase.storage
      .from("designs")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage("Failed to upload image.");
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

  // Save canvas as image and upload
  const handleSaveCanvas = async () => {
    if (!canvasRef.current || !user) return;
    setLoading(true);
    setMessage("");
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const filePath = `${user.id}/${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from("designs")
      .upload(filePath, blob, { upsert: true });

    if (uploadError) {
      setMessage("Failed to upload canvas.");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("designs").getPublicUrl(filePath);
    const image_url = data.publicUrl;

    // Save to designs table
    const { error } = await supabase.from("designs").insert([
      {
        user_id: user.id,
        title: title || "Untitled Design",
        image_url,
        display_on_profile: false,
      },
    ]);
    if (!error) {
      setTitle("");
      setMessage("Design saved!");
    } else {
      setMessage("Failed to save design.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-2 py-6 bg-genzGray">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Controls Sidebar */}
        <div className="md:w-1/4 w-full flex flex-col gap-6">
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
              <label className="block mb-2 font-semibold">Design Title:</label>
              <input
                className="border rounded px-2 py-1 mb-2"
                placeholder="Design Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div>
                <span className="font-semibold">Colors:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`w-7 h-7 rounded-full border-2 ${color === c && !isEraser ? "border-genzPurple" : "border-gray-300"}`}
                      style={{ background: c }}
                      onClick={() => handleColorChange(c)}
                      aria-label={c}
                    />
                  ))}
                  <input
                    type="color"
                    value={customColor}
                    onChange={e => handleColorChange(e.target.value)}
                    className="w-7 h-7 border-2 border-gray-300 rounded-full p-0"
                    aria-label="Color picker"
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs">Hex:</span>
                  <input
                    type="text"
                    value={customColor}
                    onChange={handleHexInput}
                    className="border rounded px-2 py-1 w-24"
                    placeholder="#000000"
                    maxLength={7}
                  />
                </div>
              </div>

              <div>
                <span className="font-semibold">Brush:</span>
                <select
                  value={size}
                  onChange={e => setSize(Number(e.target.value))}
                  className="border rounded px-2 py-1 mt-2"
                >
                  {SIZES.map(s => <option key={s} value={s}>{s}px</option>)}
                </select>
              </div>
            
              <button
                onClick={handleEraser}
                className={`px-4 py-2 rounded-lg font-semibold mt-2 ${isEraser ? "bg-genzPink text-white" : "bg-genzGray"}`}
              >
                {isEraser ? "Eraser (Active)" : "Eraser"}
              </button>

             
              <div>
                <span className="font-semibold">Shapes:</span>
                <select
                  value={shape}
                  onChange={e => { setShape(e.target.value); setIsEraser(false); }}
                  className="border rounded px-2 py-1 mt-2"
                >
                  {SHAPES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              {/* Clear */}
              <button
                onClick={clearCanvas}
                className="px-4 py-2 rounded-lg bg-genzPink text-white font-semibold mt-2"
              >
                Clear Canvas
              </button>
              {/* Save Canvas */}
              <button
                onClick={handleSaveCanvas}
                className="px-4 py-2 rounded-lg bg-genzBlue text-white font-semibold mt-2"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Canvas as Design"}
              </button>
              {message && <div className="text-genzPink">{message}</div>}
            </div>
          )}
        </div>
        {/* Canvas Area */}
        <div className="md:w-3/4 w-full flex flex-col items-center justify-center">
          {activeTab === "draw" && (
            <canvas
              ref={canvasRef}
              width={canvasDims.width}
              height={canvasDims.height}
              className="border rounded-xl bg-white shadow w-full h-auto"
              onMouseDown={startDraw}
              onMouseUp={endDraw}
              onMouseOut={endDraw}
              onMouseMove={draw}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onTouchMove={handleTouchMove}
              style={{ touchAction: "none", background: "#fff" }}
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