import { Settings } from "../App";
import {
  SelectSettingRow,
  NumberSettingRow,
  CheckboxSettingRow,
} from "./SettingRows";

interface ControlsWindowProps {
  settings: Settings;
  changeSetting: (
    settingName: keyof Settings
  ) => (newValue: number | boolean) => void;
}

function isInRange(min: number, max: number): (value: number) => boolean {
  return (value: number) => {
    return value >= min && value <= max;
  };
}

function isDivisibleByPowerOfTwo(power: number): (value: number) => boolean {
  return (value: number) => {
    if (value <= 0) return false;
    return value % Math.pow(2, power) === 0;
  };
}

function highestPowerOfTwoFactor(value: number): number {
  let power = 0;
  while (value % 2 === 0) {
    power++;
    value /= 2;
  }
  return power;
}

function ControlsWindow({ settings, changeSetting }: ControlsWindowProps) {
  return (
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
  );
}

export default ControlsWindow;
