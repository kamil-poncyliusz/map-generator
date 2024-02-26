import { Settings } from "../App";
import MapCanvas from "./MapCanvas";

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

  console.log("MapPreviewWindow rendered");
  return (
    <div id="map-preview-window">
      <div id="canvas-wrapper">
        <MapCanvas settings={settings} />
      </div>
      <div id="map-preview-controls">
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
