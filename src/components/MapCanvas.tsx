import { useEffect, useRef } from "react";

interface MapCanvasProps {
  imageData: ImageData;
  scaleExponent: number;
}

function MapCanvas({ imageData, scaleExponent }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSize = imageData.width;
  const scale = Math.pow(2, scaleExponent);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.imageSmoothingEnabled = false;
    context.scale(scale, scale);
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    tempCanvas.getContext("2d")?.putImageData(imageData, 0, 0);
    const img = new Image();
    img.src = tempCanvas.toDataURL();
    const handleLoad = () => {
      context.drawImage(img, 0, 0);
    };
    img.addEventListener("load", handleLoad);
    return () => {
      img.removeEventListener("load", handleLoad);
    };
  });

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize * scale}
      height={canvasSize * scale}
    ></canvas>
  );
}

export default MapCanvas;
