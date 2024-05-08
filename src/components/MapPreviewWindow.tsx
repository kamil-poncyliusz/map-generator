import MapCanvas from "./MapCanvas";

interface MapPreviewWindowProps {
  imageData: ImageData;
}

function MapPreviewWindow({ imageData }: MapPreviewWindowProps) {
  function zoomIn() {
    console.log("Zooming in...");
  }

  function zoomOut() {
    console.log("Zooming out...");
  }

  return (
    <div id="map-preview-window">
      <div id="map-canvas-wrapper">
        <div id="map-canvas-draggable">
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
