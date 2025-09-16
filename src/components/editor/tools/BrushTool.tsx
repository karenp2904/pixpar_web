import React, { useRef } from "react";

interface BrushToolProps {
  isDrawing: boolean;
  setIsDrawing: (v: boolean) => void;
}

const BrushTool: React.FC<BrushToolProps> = ({ isDrawing, setIsDrawing }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startDrawing = () => setIsDrawing(true);
  const stopDrawing = () => setIsDrawing(false);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-20"
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};

export default BrushTool;
