import { useState } from "react";
import { perlinNoise } from "../scripts/perlinNoise";
import MapPreviewWindow from "./MapPreviewWindow";
import {
    SelectSettingRow,
    NumberSettingRow,
  } from "./SettingRows";
import { highestPowerOfTwoFactor, isDivisibleByPowerOfTwo, isInRange } from "../scripts/validators";

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

function ImageDataFromNoise(settings: PerlinNoiseSettings) {
  const generatedNoise = perlinNoise(settings);
  const imageDataArray = new Uint8ClampedArray(
    settings.size * settings.size * 4
  );
  for (let i = 0; i < settings.size; i++) {
    for (let j = 0; j < settings.size; j++) {
      const index = (i * settings.size + j) * 4;
      const value = Math.floor((generatedNoise[i][j] / 1000) * 256);
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
  const imageData = ImageDataFromNoise(settings);

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

export default PerlinNoise;
