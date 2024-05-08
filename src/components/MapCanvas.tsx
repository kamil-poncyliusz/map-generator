import { useEffect, useRef } from "react";

interface MapCanvasProps {
  imageData: ImageData;
}

function MapCanvas({ imageData }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = imageData.width;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.putImageData(imageData, 0, 0);
  });

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
    ></canvas>
  );
}

export default MapCanvas;
