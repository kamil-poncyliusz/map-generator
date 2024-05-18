import { useState } from "react";
import { perlinNoise } from "../scripts/perlin-noise";
import MapPreviewWindow from "./MapPreviewWindow";
import {
  SelectSettingRow,
  NumberSettingRow,
  ColorSettingRow,
} from "./SettingRows";
import { highestPowerOfTwoFactor, isDivisibleByPowerOfTwo, isInRange } from "../scripts/validators";
import { parseHexColor } from "../scripts/helpers";
import { landMatrix } from "../scripts/landmap-generator";

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

function imageDataFromLandMatrix(settings: PerlinNoiseMapSettings) {
  const noise = perlinNoise(settings);
  const generatedLand = landMatrix(noise, settings.landPercentage);
  const imageDataArray = new Uint8ClampedArray(
    settings.size * settings.size * 4
  );
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
          value={settings["seed"]}
          changeHandler={changeSetting("seed")}
          isValid={isInRange(0, 1000000)}
        />
        <NumberSettingRow
          labelText="Size"
          value={settings["size"]}
          changeHandler={changeSetting("size")}
          isValid={isDivisibleByPowerOfTwo(settings.lastOctave)}
        />
        <NumberSettingRow
          labelText="First octave"
          value={settings["firstOctave"]}
          changeHandler={changeSetting("firstOctave")}
          isValid={isInRange(1, settings.lastOctave)}
        />
        <NumberSettingRow
          labelText="Last octave"
          value={settings["lastOctave"]}
          changeHandler={changeSetting("lastOctave")}
          isValid={isInRange(
            settings.firstOctave,
            highestPowerOfTwoFactor(settings.size)
          )}
        />
        <NumberSettingRow
          labelText="Land percentage"
          value={settings["landPercentage"]}
          changeHandler={changeSetting("landPercentage")}
          isValid={isInRange(0, 100)}
        />
        <ColorSettingRow
          labelText="Land color"
          value={settings["landColor"]}
          changeHandler={changeSetting("landColor")}
        />
        <ColorSettingRow
          labelText="Water color"
          value={settings["waterColor"]}
          changeHandler={changeSetting("waterColor")}
        />
        <SelectSettingRow
          labelText="Interpolation"
          options={["Bilinear", "Bicubic"]}
          value={settings["interpolationMethod"]}
          changeHandler={changeSetting("interpolationMethod")}
          isValid={isInRange(0, 1)}
        />
      </div>
      <MapPreviewWindow imageData={imageData} />
    </div>
  );
}

export default PerlinNoiseMap;
