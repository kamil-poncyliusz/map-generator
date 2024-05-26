import { useState } from "react";

interface SettingRowProps {
  labelText: string;
  hoverText: string;
}

interface CheckboxSettingRowProps extends SettingRowProps {
  value: boolean;
  changeHandler: (newValue: boolean) => void;
}

interface NumberSettingRowProps extends SettingRowProps {
  value: number;
  changeHandler: (newValue: number) => void;
  validators: ((newValue: number) => boolean)[];
}

interface FloatSettingRowProps extends SettingRowProps {
  value: number;
  changeHandler: (newValue: number) => void;
  validators: ((newValue: number) => boolean)[];
}

interface SelectSettingRowProps extends SettingRowProps {
  options: string[];
  value: number;
  changeHandler: (newValue: number) => void;
  validators: ((newValue: number) => boolean)[];
}

interface ColorSettingRowProps extends SettingRowProps {
  value: string;
  changeHandler: (newValue: string) => void;
}

interface ButtonSettingRowProps extends SettingRowProps {
  clickHandler: () => void;
}

export function CheckboxSettingRow({ labelText, hoverText, value = false, changeHandler }: CheckboxSettingRowProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    changeHandler(target.checked);
  }
  return (
    <div className="setting-row">
      <label title={hoverText} className="hover-text">
        {labelText}
      </label>
      <input type="checkbox" onChange={handleChange} defaultChecked={value} />
    </div>
  );
}

export function NumberSettingRow({ labelText, hoverText, value, changeHandler, validators }: NumberSettingRowProps) {
  const [inputValue, setInputValue] = useState(value);
  function isValid(newValue: number) {
    return validators.every((validator) => validator(newValue));
  }
  function applyChange(e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const newValue = parseInt(target.value);
    if (isValid(newValue)) changeHandler(newValue);
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const newValue = parseInt(target.value);
    setInputValue(newValue);
    if (isValid(newValue)) target.classList.remove("is-invalid");
    else target.classList.add("is-invalid");
  }
  function increaseValue(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const oldValue = parseInt(e.currentTarget.value);
    for (let i = 1; i < 2000; i++) {
      const newValue = oldValue + i;
      if (isValid(newValue)) {
        setInputValue(newValue);
        break;
      }
    }
  }
  function decreaseValue(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const oldValue = parseInt(e.currentTarget.value);
    for (let i = 1; i < 2000; i++) {
      const newValue = oldValue - i;
      if (isValid(newValue)) {
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
    <div className="setting-row">
      <label title={hoverText} className="hover-text">
        {labelText}
      </label>
      <input type="number" onBlur={applyChange} onInput={handleInput} onKeyDown={handleKeyDown} value={inputValue} />
    </div>
  );
}

export function FloatSettingRow({ labelText, hoverText, value, changeHandler, validators }: FloatSettingRowProps) {
  const [inputValue, setInputValue] = useState(value);
  function isValid(newValue: number) {
    return validators.every((validator) => validator(newValue));
  }
  function applyChange(e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    if (isValid(newValue)) changeHandler(newValue);
  }
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    setInputValue(newValue);
    if (isValid(newValue)) target.classList.remove("is-invalid");
    else target.classList.add("is-invalid");
  }
  function increaseValue(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const oldValue = parseFloat(e.currentTarget.value);
    for (let i = 0.01; i < 100; i += 0.01) {
      const newValue = Math.round((oldValue + i) * 100) / 100;
      if (isValid(newValue)) {
        setInputValue(newValue);
        break;
      }
    }
  }
  function decreaseValue(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const oldValue = parseFloat(e.currentTarget.value);
    for (let i = 0.01; i < 100; i += 0.01) {
      const newValue = Math.round((oldValue - i) * 100) / 100;
      if (isValid(newValue)) {
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
    <div className="setting-row">
      <label title={hoverText} className="hover-text">
        {labelText}
      </label>
      <input type="number" onBlur={applyChange} onInput={handleInput} onKeyDown={handleKeyDown} value={inputValue} />
    </div>
  );
}

export function SelectSettingRow({
  labelText,
  hoverText,
  options,
  value,
  changeHandler,
  validators,
}: SelectSettingRowProps) {
  function isValid(newValue: number) {
    return validators.every((validator) => validator(newValue));
  }
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const target = e.target as HTMLSelectElement;
    const newValue = parseInt(target.value);
    if (isValid(newValue)) changeHandler(newValue);
  }
  return (
    <div className="setting-row">
      <label title={hoverText} className="hover-text">
        {labelText}
      </label>
      <select onChange={handleChange} value={value}>
        {options.map((option, index) => (
          <option key={option} value={index}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ColorSettingRow({ labelText, hoverText, value, changeHandler }: ColorSettingRowProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    changeHandler(target.value);
  }
  return (
    <div className="setting-row">
      <label title={hoverText} className="hover-text">
        {labelText}
      </label>
      <input type="color" onChange={handleChange} value={value} />
    </div>
  );
}

export function ButtonSettingRow({ labelText, hoverText, clickHandler }: ButtonSettingRowProps) {
  return (
    <div className="setting-row">
      <button title={hoverText} className="hover-text" onClick={clickHandler}>
        {labelText}
      </button>
    </div>
  );
}
