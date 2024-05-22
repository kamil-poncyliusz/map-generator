import { useState } from "react";
import "./App.css";
import CellularAutomataMap from "./components/CellularAutomataMap";
import PerlinNoise from "./components/PerlinNoise";
import PerlinNoiseMap from "./components/PerlinNoiseMap";
import { VariantSelectField } from "./components/VariantSelectField";
import DiamondSquareNoiseMap from "./components/DiamondSquareNoiseMap";
import DiamondSquareNoise from "./components/DiamondSquareNoise";

function App() {
  const [mapVariant, setMapVariant] = useState(0);
  function EmptyVariant() {
    return (
      <div id="generator-wrapper">
        <div id="controls-window"></div>
        <div id="map-preview-window"></div>
      </div>
    );
  }
  const mapVariantComponents = [
    EmptyVariant,
    PerlinNoiseMap,
    PerlinNoise,
    CellularAutomataMap,
    DiamondSquareNoiseMap,
    DiamondSquareNoise,
  ];
  const changeMapVariant = (newValue: number) => {
    if (newValue < 0 || newValue >= mapVariantComponents.length) return;
    setMapVariant(newValue);
  };
  const SelectedComponent = mapVariantComponents[mapVariant];
  return (
    <>
      <VariantSelectField changeHandler={changeMapVariant} />
      {<SelectedComponent />}
    </>
  );
}

export default App;
