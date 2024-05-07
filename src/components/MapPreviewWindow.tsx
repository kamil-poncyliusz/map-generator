import MapCanvas from "./MapCanvas";
import { Settings } from "./PerlinNoiseMap";

interface MapPreviewWindowProps {
  settings: Settings;
}

function MapPreviewWindow({ settings }: MapPreviewWindowProps) {
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
          <MapCanvas settings={settings} />
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
