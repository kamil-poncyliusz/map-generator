import { useState } from "react";

export function VariantSelectField({ changeHandler }: { changeHandler: (newValue: number) => void }) {
  const [selectedValue, setSelectedValue] = useState("0");
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const target = e.target as HTMLSelectElement;
    setSelectedValue(target.value);
    changeHandler(parseInt(target.value));
  }

  return (
    <div id="variant-selection-wrapper">
      <select name="variant-select" id="variant-select" value={selectedValue} onChange={handleChange}>
        <option value="0" disabled>Select a variant</option>
        <option value="1">Perlin Noise Map</option>
        <option value="2">Perlin Noise</option>
        <option value="3">Cellular Automata Map</option>
        <option value="4">Diamond Square Noise Map</option>
      </select>
    </div>
  );
}