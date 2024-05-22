import { useState } from "react";
import MapPreviewWindow from "./MapPreviewWindow";
import { NumberSettingRow } from "./SettingRows";
import { isInRange, isPowerOfTwo } from "../scripts/validators";
import { diamondSquareNoise } from "../scripts/diamond-square-noise";

const MAX_SEED = 1000000;
const MAX_FRAGMENTATION = 1000;

export interface DiamondSquareNoiseSettings {
  seed: number;
  size: number;
  fragmentation: number;
}

const defaultDiamondSquareNoiseSettings: DiamondSquareNoiseSettings = {
  seed: 0,
  size: 512,
  fragmentation: 0,
};

function imageDataFromLandMatrix(settings: DiamondSquareNoiseSettings) {
  const noise = diamondSquareNoise(settings);
  const imageDataArray = new Uint8ClampedArray(settings.size * settings.size * 4);
  for (let i = 0; i < settings.size; i++) {
    for (let j = 0; j < settings.size; j++) {
      const index = (i * settings.size + j) * 4;
      const value = noise[i][j];
      imageDataArray[index] = value;
      imageDataArray[index + 1] = value;
      imageDataArray[index + 2] = value;
      imageDataArray[index + 3] = 255;
    }
  }
  return new ImageData(imageDataArray, settings.size, settings.size);
}

function DiamondSquareNoise() {
  const [settings, setSettings] = useState({ ...defaultDiamondSquareNoiseSettings });
  const changeSetting = (settingName: keyof DiamondSquareNoiseSettings) => {
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
          isValid={isInRange(0, MAX_SEED)}
        />
        <NumberSettingRow
          labelText="Size"
          value={settings["size"]}
          changeHandler={changeSetting("size")}
          isValid={isPowerOfTwo}
        />
        <NumberSettingRow
          labelText="Fragmentation"
          value={settings["fragmentation"]}
          changeHandler={changeSetting("fragmentation")}
          isValid={isInRange(0, MAX_FRAGMENTATION)}
        />
      </div>
      <MapPreviewWindow imageData={imageData} />
    </div>
  );
}

export default DiamondSquareNoise;
