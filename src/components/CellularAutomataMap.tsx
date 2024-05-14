import { useState } from "react";
import MapPreviewWindow from "./MapPreviewWindow";
import {
  FloatSettingRow,
    NumberSettingRow,
  } from "./SettingRows";
import { isInRange } from "../scripts/validators";
import { cellularAutomata } from "../scripts/cellularAutomata";

interface CellularAutomataMapSettings {
  size: number;
  seed: number;
  iterations: number;
  deathThreshold: number;
  initialDensity: number;
}

const defaultSettings: CellularAutomataMapSettings = {
  size: 500,
  seed: 0,
  iterations: 5,
  deathThreshold: 5,
  initialDensity: 0.5,
};

const waterColor = { r: 60, g: 127, b: 255 };
const landColor = { r: 40, g: 80, b: 0 };

function imageDataFromLandMatrix(settings:CellularAutomataMapSettings) {
  const generatedLandMatrix = cellularAutomata(settings);
  const imageDataArray = new Uint8ClampedArray(
    settings.size * settings.size * 4
  );
  for (let i = 0; i < settings.size; i++) {
    for (let j = 0; j < settings.size; j++) {
      const index = (i * settings.size + j) * 4;
      const isLand = generatedLandMatrix[i][j];
      imageDataArray[index] = isLand ? landColor.r : waterColor.r;
      imageDataArray[index + 1] = isLand ? landColor.g : waterColor.g;
      imageDataArray[index + 2] = isLand ? landColor.b : waterColor.b;
      imageDataArray[index + 3] = 255;
    }
  }
  return new ImageData(imageDataArray, settings.size, settings.size);
}

function CellularAutomataMap() {
  const [settings, setSettings] = useState({ ...defaultSettings });
  const changeSetting = (settingName: keyof CellularAutomataMapSettings) => {
    return (newValue: number | boolean) => {
      if (settings[settingName] !== newValue)
        setSettings((previousValue) => ({
          ...previousValue,
          [settingName]: newValue,
        }));
    };
  };
  const imageData = imageDataFromLandMatrix(settings);

  return (
    <div id="generator-wrapper">
      <div id="controls-window">
      <NumberSettingRow
        labelText="Seed"
        value={settings["seed"]}
        changeHandler={changeSetting("seed")}
        isValid={isInRange(0, 1000000)}
      />
      <NumberSettingRow
        labelText="Size"
        value={settings["size"]}
        changeHandler={changeSetting("size")}
        isValid={isInRange(0, 5000)}
      />
      <NumberSettingRow
        labelText="Iterations"
        value={settings["iterations"]}
        changeHandler={changeSetting("iterations")}
        isValid={isInRange(0, 100)}
      />
      <NumberSettingRow
        labelText="Death Threshold"
        value={settings["deathThreshold"]}
        changeHandler={changeSetting("deathThreshold")}
        isValid={isInRange(0, 8)}
      />
      <FloatSettingRow
        labelText="Initial Density"
        value={settings["initialDensity"]}
        changeHandler={changeSetting("initialDensity")}
        isValid={isInRange(0, 1)}
      />
    </div>
      <MapPreviewWindow imageData={imageData} />
    </div>
  );
}

export default CellularAutomataMap;
