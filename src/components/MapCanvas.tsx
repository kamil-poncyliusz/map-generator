import { useEffect, useRef } from "react";
import { Settings } from "../App";
import generateNoise from "../scripts/generateNoise";

interface MapCanvasProps {
  settings: Settings;
}

function MapCanvas({ settings }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise = generateNoise(settings);
  const imageDataArray = new Uint8ClampedArray(
    settings.size * settings.size * 4
  );
  for (let i = 0; i < settings.size; i++) {
    for (let j = 0; j < settings.size; j++) {
      const index = (i * settings.size + j) * 4;
      const value = Math.floor((noise[i][j] / 1000) * 256);
      imageDataArray[index] = value;
      imageDataArray[index + 1] = value;
      imageDataArray[index + 2] = value;
      imageDataArray[index + 3] = 255;
    }
  }
  const imageData = new ImageData(imageDataArray, settings.size, settings.size);
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
      width={settings.size}
      height={settings.size}
    ></canvas>
  );
}

export default MapCanvas;
