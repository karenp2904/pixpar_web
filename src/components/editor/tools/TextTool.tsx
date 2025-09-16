import React, { useState } from "react";

const TextTool: React.FC = () => {
  const [text, setText] = useState("Escribe aquí");
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.buttons !== 1) return; // Solo arrastrar con click izquierdo
    setPosition({
      x: e.clientX - 50,
      y: e.clientY - 10,
    });
  };

  return (
    <div
      className="absolute inset-0 z-30 pointer-events-none"
      onMouseMove={handleDrag}
    >
      <div
        className="absolute cursor-move pointer-events-auto"
        style={{ top: position.y, left: position.x }}
        draggable={false}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-transparent border border-gray-400 text-white px-2 py-1 rounded-md focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TextTool;
