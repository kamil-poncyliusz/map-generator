import { useState } from "react";
import MapPreviewWindow from "./MapPreviewWindow";
import {
    SelectSettingRow,
    NumberSettingRow,
    CheckboxSettingRow,
  } from "./SettingRows";
import { highestPowerOfTwoFactor, isDivisibleByPowerOfTwo, isInRange } from "../scripts/validators";

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

function PerlinNoiseMap() {
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
      <SelectSettingRow
        labelText="Interpolation"
        options={["Bilinear", "Bicubic"]}
        value={settings["interpolationMethod"]}
        changeHandler={changeSetting("interpolationMethod")}
        isValid={isInRange(0, 1)}
      />
      <CheckboxSettingRow
        labelText="View noise"
        value={settings["viewNoise"]}
        changeHandler={changeSetting("viewNoise")}
      />
    </div>
      <MapPreviewWindow settings={settings} />
    </div>
  );
}

export default PerlinNoiseMap;
