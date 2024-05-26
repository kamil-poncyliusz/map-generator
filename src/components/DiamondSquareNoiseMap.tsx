import { useState } from "react";
import MapPreviewWindow from "./MapPreviewWindow";
import { NumberSettingRow, ColorSettingRow } from "./SettingRows";
import { isInRange, isPowerOfTwo } from "../scripts/validators";
import { Stringified, parseHexColor } from "../scripts/helpers";
import { landMatrix } from "../scripts/landmap-generator";
import { diamondSquareNoise } from "../scripts/diamond-square-noise";

const MAX_SEED = 1000000;
const MIN_SIZE = 32;
const MAX_SIZE = 4096;
const MIN_FRAGMENTATION = 0;
const MAX_FRAGMENTATION = 1000;
const MIN_LAND_PERCENTAGE = 0;
const MAX_LAND_PERCENTAGE = 100;

export interface DiamondSquareNoiseMapSettings {
  seed: number;
  size: number;
  fragmentation: number;
  landPercentage: number;
  landColor: string;
  waterColor: string;
}

const defaultDiamondSquareNoiseMapSettings: DiamondSquareNoiseMapSettings = {
  seed: 0,
  size: 512,
  fragmentation: 0,
  landPercentage: 30,
  landColor: "#285000",
  waterColor: "#3c7fff",
};

const hoverTexts: Stringified<DiamondSquareNoiseMapSettings> = {
  seed: "Seed for the random number generator. Changing this will change the map.",
  size: "The size of the map. The map will be square with this size. Must be a power of 2.",
  fragmentation: "Higher fragmentation will result in smaller continents and islands.",
  landPercentage: "The percentage of the map that will be land.",
  landColor: "The color of the land.",
  waterColor: "The color of the water.",
};

function imageDataFromLandMatrix(settings: DiamondSquareNoiseMapSettings) {
  const noise = diamondSquareNoise(settings);
  const generatedLand = landMatrix(noise, settings.landPercentage);
  const imageDataArray = new Uint8ClampedArray(settings.size * settings.size * 4);
  const landColor = parseHexColor(settings.landColor);
  const waterColor = parseHexColor(settings.waterColor);
  for (let i = 0; i < settings.size; i++) {
    for (let j = 0; j < settings.size; j++) {
      const index = (i * settings.size + j) * 4;
      const isLand = generatedLand[i][j];
      imageDataArray[index] = isLand ? landColor.r : waterColor.r;
      imageDataArray[index + 1] = isLand ? landColor.g : waterColor.g;
      imageDataArray[index + 2] = isLand ? landColor.b : waterColor.b;
      imageDataArray[index + 3] = 255;
    }
  }
  return new ImageData(imageDataArray, settings.size, settings.size);
}

function DiamondSquareNoiseMap() {
  const [settings, setSettings] = useState({ ...defaultDiamondSquareNoiseMapSettings });
  const changeSetting = (settingName: keyof DiamondSquareNoiseMapSettings) => {
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
          validators={[isPowerOfTwo, isInRange(MIN_SIZE, MAX_SIZE)]}
        />
        <NumberSettingRow
          labelText="Fragmentation"
          hoverText={hoverTexts.fragmentation}
          value={settings["fragmentation"]}
          changeHandler={changeSetting("fragmentation")}
          validators={[isInRange(MIN_FRAGMENTATION, MAX_FRAGMENTATION)]}
        />
        <NumberSettingRow
          labelText="Land percentage"
          hoverText={hoverTexts.landPercentage}
          value={settings["landPercentage"]}
          changeHandler={changeSetting("landPercentage")}
          validators={[isInRange(MIN_LAND_PERCENTAGE, MAX_LAND_PERCENTAGE)]}
        />
        <ColorSettingRow
          labelText="Land color"
          hoverText={hoverTexts.landColor}
          value={settings["landColor"]}
          changeHandler={changeSetting("landColor")}
        />
        <ColorSettingRow
          labelText="Water color"
          hoverText={hoverTexts.waterColor}
          value={settings["waterColor"]}
          changeHandler={changeSetting("waterColor")}
        />
      </div>
      <MapPreviewWindow imageData={imageData} />
    </div>
  );
}

export default DiamondSquareNoiseMap;
