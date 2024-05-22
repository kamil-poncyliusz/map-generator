import { useEffect, useRef } from "react";

interface MapCanvasProps {
  imageData: ImageData;
  scaleExponent: number;
}

function MapCanvas({ imageData, scaleExponent }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvasSize = imageData.width;
    const scale = Math.pow(2, scaleExponent);
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasSize;
    tempCanvas.height = canvasSize;
    const tempCanvasContext = tempCanvas.getContext("2d");
    if (!tempCanvasContext) throw new Error("tempCanvasContext is null");
    tempCanvasContext.putImageData(imageData, 0, 0);
    const tempImage = new Image();
    tempImage.onload = () => {
      if (!canvasRef.current) throw new Error("canvasRef is null");
      const canvasContext = canvasRef.current.getContext("2d");
      if (!canvasContext) throw new Error("canvasContext is null");
      canvasContext.imageSmoothingEnabled = false;
      canvasContext.drawImage(tempImage, 0, 0, canvasSize * scale, canvasSize * scale);
    };
    tempImage.src = tempCanvas.toDataURL();
  }, [imageData, scaleExponent]);
  return (
    <canvas
      ref={canvasRef}
      width={imageData.width * Math.pow(2, scaleExponent)}
      height={imageData.width * Math.pow(2, scaleExponent)}
    ></canvas>
  );
}

export default MapCanvas;
