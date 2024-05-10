import { useRef } from "react";
import MapCanvas from "./MapCanvas";

interface MapPreviewWindowProps {
  imageData: ImageData;
}

function MapPreviewWindow({ imageData }: MapPreviewWindowProps) {
  let isDragged = false;
  const draggableRef = useRef<HTMLDivElement>(null);
  function zoomIn() {
    console.log("Zooming in...");
  }
  function zoomOut() {
    console.log("Zooming out...");
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
    if(!draggableRef.current) return console.error("draggableRef is null");
    const currentLeft = parseInt(draggableRef.current.style.left);
    const currentTop = parseInt(draggableRef.current.style.top);
    draggableRef.current.style.left = `${currentLeft + event.movementX}px`;
    draggableRef.current.style.top = `${currentTop + event.movementY}px`;
  }

  return (
    <div id="map-preview-window">
      <div id="canvas-dragarea">
        <div id="canvas-draggable-wrapper" ref={draggableRef} onMouseDown={dragStart} onMouseUp={dragEnd} onMouseMove={dragMove} onMouseLeave={dragEnd}>
          <MapCanvas imageData={imageData} />
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
