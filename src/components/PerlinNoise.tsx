import { useState } from "react";
import { perlinNoise } from "../scripts/perlin-noise";
import MapPreviewWindow from "./MapPreviewWindow";
import { SelectSettingRow, NumberSettingRow } from "./SettingRows";
import { highestPowerOfTwoFactor, isDivisibleByPowerOfTwo, isInRange } from "../scripts/validators";
import { Stringified } from "../scripts/helpers";

const MAX_SEED = 1000000;
const MIN_SIZE = 32;
const MAX_SIZE = 4096;

export interface PerlinNoiseSettings {
  seed: number;
  size: number;
  firstOctave: number;
  lastOctave: number;
  interpolationMethod: number;
}

const defaultPerlinNoiseSetting: PerlinNoiseSettings = {
  seed: 0,
  size: 512,
  firstOctave: 1,
  lastOctave: 8,
  interpolationMethod: 1,
};

const hoverTexts: Stringified<PerlinNoiseSettings> = {
  seed: "Seed for the random number generator.",
  size: "The size of the noise. The noise will be square with this size.",
  firstOctave:
    "The first octave of the noise. Generator will skip previous octaves, resulting in a less detailed noise.",
  lastOctave: "The last octave of the noise. Generator will skip later octaves, resulting in a less smooth noise.",
  interpolationMethod: "Bicubic interpolation will result in higher quality noise, but will be slower.",
};

function imageDataFromNoise(settings: PerlinNoiseSettings) {
  const generatedNoise = perlinNoise(settings);
  const imageDataArray = new Uint8ClampedArray(settings.size * settings.size * 4);
  for (let i = 0; i < settings.size; i++) {
    for (let j = 0; j < settings.size; j++) {
      const index = (i * settings.size + j) * 4;
      const value = generatedNoise[i][j];
      imageDataArray[index] = value;
      imageDataArray[index + 1] = value;
      imageDataArray[index + 2] = value;
      imageDataArray[index + 3] = 255;
    }
  }
  return new ImageData(imageDataArray, settings.size, settings.size);
}

function PerlinNoise() {
  const [settings, setSettings] = useState({ ...defaultPerlinNoiseSetting });
  const changeSetting = (settingName: keyof PerlinNoiseSettings) => {
    return (newValue: number | boolean) => {
      if (settings[settingName] !== newValue)
        setSettings((previousValue) => ({
          ...previousValue,
          [settingName]: newValue,
        }));
    };
  };
  const imageData = imageDataFromNoise(settings);

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

export default PerlinNoise;
