import React from "react";
import './svgGrid.css';


const modules = import.meta.glob('./assets/tech-stack/*.svg', { eager: true });
const svgFiles = Object.values(modules).map(m => m.default);

const SvgGrid = () => {
  return (
    <div className="svg-grid">
      {svgFiles.map((svg, index) => (
        <div key={index} className="svg-item">
          <img src={svg} alt={`SVG ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};
export default SvgGrid;