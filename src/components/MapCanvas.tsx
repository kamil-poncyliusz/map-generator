import { useEffect, useRef } from "react";
import { Settings } from "../App";
import { noise, landMatrix } from "../scripts/noise";

interface MapCanvasProps {
  settings: Settings;
}

const waterColor = { r: 0, g: 30, b: 255 };

function ImageDataFromNoise(settings: Settings) {
  const generatedNoise = noise(settings);
  const imageDataArray = new Uint8ClampedArray(
    settings.size * settings.size * 4
  );
  for (let i = 0; i < settings.size; i++) {
    for (let j = 0; j < settings.size; j++) {
      const index = (i * settings.size + j) * 4;
      const value = Math.floor((generatedNoise[i][j] / 1000) * 256);
      imageDataArray[index] = value;
      imageDataArray[index + 1] = value;
      imageDataArray[index + 2] = value;
      imageDataArray[index + 3] = 255;
    }
  }
  return new ImageData(imageDataArray, settings.size, settings.size);
}

function ImageDataFromLandMatrix(settings: Settings) {
  const generatedLandMatrix = landMatrix(settings);
  const imageDataArray = new Uint8ClampedArray(
    settings.size * settings.size * 4
  );
  for (let i = 0; i < settings.size; i++) {
    for (let j = 0; j < settings.size; j++) {
      const index = (i * settings.size + j) * 4;
      const isLand = generatedLandMatrix[i][j];
      imageDataArray[index] = isLand ? 60 : waterColor.r;
      imageDataArray[index + 1] = isLand ? 20 : waterColor.g;
      imageDataArray[index + 2] = isLand ? 0 : waterColor.b;
      imageDataArray[index + 3] = 255;
    }
  }
  return new ImageData(imageDataArray, settings.size, settings.size);
}

function MapCanvas({ settings }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageData = ImageDataFromLandMatrix(settings);
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
