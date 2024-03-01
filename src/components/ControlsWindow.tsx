import { Settings } from "../App";
import { NumberSettingRow } from "./SettingRows";

interface ControlsWindowProps {
  settings: Settings;
  changeSetting: (settingName: keyof Settings) => (newValue: number) => void;
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
  console.log("ControlsWindow rendered");
  return (
    <div id="controls-window">
      <NumberSettingRow
        labelText="Seed"
        value={settings["seed"]}
        changeHandler={changeSetting("seed")}
        validator={isInRange(0, 1000000)}
      />
      <NumberSettingRow
        labelText="Size"
        value={settings["size"]}
        changeHandler={changeSetting("size")}
        validator={isDivisibleByPowerOfTwo(settings.lastOctave)}
      />
      <NumberSettingRow
        labelText="First octave"
        value={settings["firstOctave"]}
        changeHandler={changeSetting("firstOctave")}
        validator={isInRange(1, settings.lastOctave)}
      />
      <NumberSettingRow
        labelText="Last octave"
        value={settings["lastOctave"]}
        changeHandler={changeSetting("lastOctave")}
        validator={isInRange(
          settings.firstOctave,
          highestPowerOfTwoFactor(settings.size)
        )}
      />
    </div>
  );
}

export default ControlsWindow;
