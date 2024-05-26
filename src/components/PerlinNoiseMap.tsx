import { useState } from "react";
import { perlinNoise } from "../scripts/perlin-noise";
import MapPreviewWindow from "./MapPreviewWindow";
import { SelectSettingRow, NumberSettingRow, ColorSettingRow } from "./SettingRows";
import { highestPowerOfTwoFactor, isDivisibleByPowerOfTwo, isInRange } from "../scripts/validators";
import { parseHexColor } from "../scripts/helpers";
import { landMatrix } from "../scripts/landmap-generator";

const MAX_SEED = 1000000;
const MIN_SIZE = 32;
const MAX_SIZE = 4096;
const MIN_LAND_PERCENTAGE = 0;
const MAX_LAND_PERCENTAGE = 100;

export interface PerlinNoiseMapSettings {
  seed: number;
  size: number;
  firstOctave: number;
  lastOctave: number;
  interpolationMethod: number;
  landPercentage: number;
  landColor: string;
  waterColor: string;
}

const defaultPerlinNoiseMapSettings: PerlinNoiseMapSettings = {
  seed: 0,
  size: 512,
  firstOctave: 1,
  lastOctave: 8,
  interpolationMethod: 1,
  landPercentage: 30,
  landColor: "#285000",
  waterColor: "#3c7fff",
};

const hoverTexts = {
  seed: "Seed for the random number generator. Changing this will change the map.",
  size: "The size of the map. The map will be square with this size.",
  firstOctave: "The first octave of the noise. Generator will skip previous octaves, resulting in a less detailed map.",
  lastOctave:
    "The last octave of the noise. Generator will skip later octaves, resulting in smaller continents and islands.",
  interpolationMethod: "Bicubic interpolation will result in higher quality map, but will be slower.",
  landPercentage: "The percentage of the map that will be land.",
  landColor: "The color of the land.",
  waterColor: "The color of the water.",
};

function imageDataFromLandMatrix(settings: PerlinNoiseMapSettings) {
  const noise = perlinNoise(settings);
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

function PerlinNoiseMap() {
  const [settings, setSettings] = useState({ ...defaultPerlinNoiseMapSettings });
  const changeSetting = (settingName: keyof PerlinNoiseMapSettings) => {
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
          validators={[isDivisibleByPowerOfTwo(settings.lastOctave), isInRange(MIN_SIZE, MAX_SIZE)]}
        />
        <NumberSettingRow
          labelText="First octave"
          hoverText={hoverTexts.firstOctave}
          value={settings["firstOctave"]}
          changeHandler={changeSetting("firstOctave")}
          validators={[isInRange(1, settings.lastOctave)]}
        />
        <NumberSettingRow
          labelText="Last octave"
          hoverText={hoverTexts.lastOctave}
          value={settings["lastOctave"]}
          changeHandler={changeSetting("lastOctave")}
          validators={[isInRange(settings.firstOctave, highestPowerOfTwoFactor(settings.size))]}
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
        <SelectSettingRow
          labelText="Interpolation"
          hoverText={hoverTexts.interpolationMethod}
          options={["Bilinear", "Bicubic"]}
          value={settings["interpolationMethod"]}
          changeHandler={changeSetting("interpolationMethod")}
          validators={[isInRange(0, 1)]}
        />
      </div>
      <MapPreviewWindow imageData={imageData} />
    </div>
  );
}

export default PerlinNoiseMap;
