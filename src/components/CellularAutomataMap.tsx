import { useState } from "react";
import MapPreviewWindow from "./MapPreviewWindow";
import { ColorSettingRow, FloatSettingRow, NumberSettingRow } from "./SettingRows";
import { isInRange } from "../scripts/validators";
import { cellularAutomata } from "../scripts/cellular-automata";
import { Stringified, parseHexColor } from "../scripts/helpers";

const MAX_SIZE = 10000;
const MAX_ITERATIONS = 100;
const MAX_DEATH_THRESHOLD = 8;
const MAX_INITIAL_DENSITY = 1;
const MAX_SEED = 1000000;

interface CellularAutomataMapSettings {
  size: number;
  seed: number;
  iterations: number;
  deathThreshold: number;
  initialDensity: number;
  landColor: string;
  waterColor: string;
}

const defaultSettings: CellularAutomataMapSettings = {
  size: 500,
  seed: 0,
  iterations: 5,
  deathThreshold: 5,
  initialDensity: 0.5,
  landColor: "#285000",
  waterColor: "#3c7fff",
};

const hoverTexts: Stringified<CellularAutomataMapSettings> = {
  size: "The size of the map. The map will be square with this size.",
  seed: "Seed for the random number generator. Changing this will change the map.",
  iterations: "Number of iterations to run the cellular automata algorithm.",
  deathThreshold: "",
  initialDensity: "Probability that a cell will start as land.",
  landColor: "Color of the land in the map.",
  waterColor: "Color of the water in the map",
};

function imageDataFromLandMatrix(settings: CellularAutomataMapSettings) {
  const generatedLandMatrix = cellularAutomata(settings);
  const imageDataArray = new Uint8ClampedArray(settings.size * settings.size * 4);
  const landColor = parseHexColor(settings.landColor);
  const waterColor = parseHexColor(settings.waterColor);
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
    return (newValue: number | string | boolean) => {
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
          hoverText={hoverTexts.seed}
          value={settings["seed"]}
          changeHandler={changeSetting("seed")}
          validators={[isInRange(0, MAX_SEED)]}
        />
        <NumberSettingRow
          labelText="Size"
          hoverText={hoverTexts.size}
          value={settings["size"]}
          changeHandler={changeSetting("size")}
          validators={[isInRange(0, MAX_SIZE)]}
        />
        <NumberSettingRow
          labelText="Iterations"
          hoverText={hoverTexts.iterations}
          value={settings["iterations"]}
          changeHandler={changeSetting("iterations")}
          validators={[isInRange(0, MAX_ITERATIONS)]}
        />
        <NumberSettingRow
          labelText="Death Threshold"
          hoverText={hoverTexts.deathThreshold}
          value={settings["deathThreshold"]}
          changeHandler={changeSetting("deathThreshold")}
          validators={[isInRange(0, MAX_DEATH_THRESHOLD)]}
        />
        <FloatSettingRow
          labelText="Initial Density"
          hoverText={hoverTexts.initialDensity}
          value={settings["initialDensity"]}
          changeHandler={changeSetting("initialDensity")}
          validators={[isInRange(0, MAX_INITIAL_DENSITY)]}
        />
        <ColorSettingRow
          labelText="Land Color"
          hoverText={hoverTexts.landColor}
          value={settings["landColor"]}
          changeHandler={changeSetting("landColor")}
        />
        <ColorSettingRow
          labelText="Water Color"
          hoverText={hoverTexts.waterColor}
          value={settings["waterColor"]}
          changeHandler={changeSetting("waterColor")}
        />
      </div>
      <MapPreviewWindow imageData={imageData} />
    </div>
  );
}

export default CellularAutomataMap;
