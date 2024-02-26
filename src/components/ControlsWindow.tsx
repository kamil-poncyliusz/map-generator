import { Settings } from "../App";
import { NumberSettingRow } from "./SettingRows";

interface ControlsWindowProps {
  settings: Settings;
  changeSetting: (settingName: string) => (newValue: number) => void;
}

function ControlsWindow({ settings, changeSetting }: ControlsWindowProps) {
  console.log("ControlsWindow rendered");
  return (
    <div id="controls-window">
      <NumberSettingRow
        labelText="Seed"
        value={settings["seed"]}
        changeHandler={changeSetting("seed")}
      />
      <NumberSettingRow
        labelText="Size"
        value={settings["size"]}
        changeHandler={changeSetting("size")}
      />
      <NumberSettingRow
        labelText="First octave"
        value={settings["firstOctave"]}
        changeHandler={changeSetting("firstOctave")}
      />
      <NumberSettingRow
        labelText="Last octave"
        value={settings["lastOctave"]}
        changeHandler={changeSetting("lastOctave")}
      />
    </div>
  );
}

export default ControlsWindow;
