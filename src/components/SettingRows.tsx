import { useState } from "react";

interface SettingRowProps {
  labelText: string;
}

interface CheckboxSettingRowProps extends SettingRowProps {
  value: boolean;
  changeHandler: (newValue: boolean) => void;
}

interface NumberSettingRowProps extends SettingRowProps {
  value: number;
  changeHandler: (newValue: number) => void;
}

interface ButtonSettingRowProps extends SettingRowProps {
  clickHandler: () => void;
}

export function CheckboxSettingRow({
  labelText,
  value = false,
  changeHandler,
}: CheckboxSettingRowProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    changeHandler(target.checked);
  }
  return (
    <div className="setting-row">
      <label>{labelText}</label>
      <input type="checkbox" onChange={handleChange} defaultChecked={value} />
    </div>
  );
}

export function NumberSettingRow({
  labelText,
  value,
  changeHandler,
}: NumberSettingRowProps) {
  const [inputValue, setInputValue] = useState(value);
  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newValue = parseInt(target.value);
    if (typeof newValue === "number") changeHandler(newValue);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setInputValue(parseInt(target.value));
  };
  return (
    <div className="settings-row">
      <label>{labelText}</label>
      <input
        type="number"
        onBlur={handleBlur}
        onChange={handleChange}
        value={inputValue}
      />
    </div>
  );
}

export function ButtonSettingRow({
  labelText,
  clickHandler,
}: ButtonSettingRowProps) {
  return (
    <div className="setting-row">
      <button onClick={clickHandler}>{labelText}</button>
    </div>
  );
}
