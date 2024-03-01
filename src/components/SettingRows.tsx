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
  validator: (newValue: number) => boolean;
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
  validator,
}: NumberSettingRowProps) {
  const [inputValue, setInputValue] = useState(value);
  function applyChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) {
    const target = e.target as HTMLInputElement;
    const newValue = parseInt(target.value);
    if (validator(newValue)) changeHandler(newValue);
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const newValue = parseInt(target.value);
    setInputValue(newValue);
    if (validator(newValue)) target.classList.remove("is-invalid");
    else target.classList.add("is-invalid");
  }
  function increaseValue(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const oldValue = parseInt(e.currentTarget.value);
    for (let i = 1; i < 1000; i++) {
      const newValue = oldValue + i;
      if (validator(newValue)) {
        setInputValue(newValue);
        break;
      }
    }
  }
  function decreaseValue(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const oldValue = parseInt(e.currentTarget.value);
    for (let i = 1; i < 1000; i++) {
      const newValue = oldValue - i;
      if (validator(newValue)) {
        setInputValue(newValue);
        break;
      }
    }
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const key = e.key;
    if (key === "Enter") applyChange(e);
    if (key === "ArrowUp") increaseValue(e);
    if (key === "ArrowDown") decreaseValue(e);
  }
  return (
    <div className="settings-row">
      <label>{labelText}</label>
      <input
        type="number"
        onBlur={applyChange}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
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