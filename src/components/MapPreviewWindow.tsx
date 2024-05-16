import { useEffect, useRef, useState } from "react";
import MapCanvas from "./MapCanvas";

interface MapPreviewWindowProps {
  imageData: ImageData;
}

function MapPreviewWindow({ imageData }: MapPreviewWindowProps) {
  let isDragged = false;
  const draggableRef = useRef<HTMLDivElement>(null);
  const [scaleExponent, setScaleExponent] = useState(0);
  function moveCanvas(shiftX: number, shiftY: number) {
    if(!draggableRef.current) return console.error("draggableRef is null");
    if(!draggableRef.current.style.left) draggableRef.current.style.left = "0px";
    if(!draggableRef.current.style.top) draggableRef.current.style.top = "0px";
    const currentLeft = parseInt(draggableRef.current.style.left);
    const currentTop = parseInt(draggableRef.current.style.top);
    draggableRef.current.style.left = `${currentLeft + shiftX}px`;
    draggableRef.current.style.top = `${currentTop + shiftY}px`;
  }
  function zoomIn() {
    const positionShift = -imageData.width * Math.pow(2, scaleExponent-1);
    setScaleExponent(scaleExponent + 1);
    moveCanvas(positionShift, positionShift);
  }
  function zoomOut() {
    const positionShift = imageData.width * Math.pow(2, scaleExponent - 2);
    setScaleExponent(scaleExponent - 1);
    moveCanvas(positionShift, positionShift);
  }
  function dragStart(){
    isDragged = true;
    if(!draggableRef.current) return console.error("draggableRef is null");
    if(!draggableRef.current.style.left) draggableRef.current.style.left = "0px";
    if(!draggableRef.current.style.top) draggableRef.current.style.top = "0px";
  }
  function dragEnd(){
    if (!isDragged) return;
    isDragged = false;
  }
  function dragMove(event: React.MouseEvent){
    if (!isDragged) return;
    moveCanvas(event.movementX, event.movementY);
  }
  useEffect(() => {
    if (!draggableRef.current) return;
    const parent = draggableRef.current.parentElement;
    if (!parent) return;
    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;
    const elementWidth = draggableRef.current.offsetWidth;
    const elementHeight = draggableRef.current.offsetHeight;
    draggableRef.current.style.left = `${(parentWidth - elementWidth) / 2}px`;
    draggableRef.current.style.top = `${(parentHeight - elementHeight) / 2}px`;
  }, []);

  return (
    <div id="map-preview-window">
      <div id="canvas-dragarea">
        <div id="canvas-draggable-wrapper" ref={draggableRef} onMouseDown={dragStart} onMouseUp={dragEnd} onMouseMove={dragMove} onMouseLeave={dragEnd}>
          <MapCanvas imageData={imageData} scaleExponent={scaleExponent} />
        </div>
      </div>
      <div id="map-controls">
        <button type="button" onClick={zoomIn}>
          +
        </button>
        <button type="button" onClick={zoomOut}>
          -
        </button>
      </div>
    </div>
  );
}

export default MapPreviewWindow;
