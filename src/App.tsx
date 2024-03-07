import { useState } from "react";
import "./App.css";
import ControlsWindow from "./components/ControlsWindow";
import MapPreviewWindow from "./components/MapPreviewWindow";

export interface Settings {
  seed: number;
  size: number;
  firstOctave: number;
  lastOctave: number;
  interpolationMethod: number;
  landPercentage: number;
  viewNoise: boolean;
}

const defaultSettings: Settings = {
  seed: 0,
  size: 512,
  firstOctave: 1,
  lastOctave: 8,
  interpolationMethod: 1,
  landPercentage: 30,
  viewNoise: false,
};

function App() {
  const [settings, setSettings] = useState({ ...defaultSettings });
  const changeSetting = (settingName: keyof Settings) => {
    return (newValue: number | boolean) => {
      if (settings[settingName] !== newValue)
        setSettings((previousValue) => ({
          ...previousValue,
          [settingName]: newValue,
        }));
    };
  };

  return (
    <div id="app-wrapper">
      <ControlsWindow settings={settings} changeSetting={changeSetting} />
      <MapPreviewWindow settings={settings} />
    </div>
  );
}

export default App;
