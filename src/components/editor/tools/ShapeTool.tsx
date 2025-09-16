import React, { useState } from "react";

const ShapeTool: React.FC = () => {
  const [shape, setShape] = useState<"rect" | "circle">("rect");

  return (
    <div className="absolute inset-0 z-30">
      {/* Selector de forma */}
      <div className="absolute top-2 left-2 bg-black/60 text-white p-2 rounded-md flex gap-2">
        <button
          className={`px-2 py-1 rounded ${shape === "rect" ? "bg-blue-500" : "bg-gray-700"}`}
          onClick={() => setShape("rect")}
        >
          Rectángulo
        </button>
        <button
          className={`px-2 py-1 rounded ${shape === "circle" ? "bg-blue-500" : "bg-gray-700"}`}
          onClick={() => setShape("circle")}
        >
          Círculo
        </button>
      </div>

      {/* Área de dibujo */}
      <div className="absolute inset-0 flex items-center justify-center">
        {shape === "rect" ? (
          <div className="w-32 h-20 border-2 border-red-400 bg-red-400/20"></div>
        ) : (
          <div className="w-24 h-24 rounded-full border-2 border-green-400 bg-green-400/20"></div>
        )}
      </div>
    </div>
  );
};

export default ShapeTool;
