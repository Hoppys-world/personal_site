import React, { useState } from "react";
import './svgGrid.css';

const modules = import.meta.glob('./assets/tech-stack/*.svg', { eager: true });
const svgFiles = Object.entries(modules).map(([path, module]) => {
  const filename = path.split('/').pop().replace('.svg', ''); // Extract filename as title
  return { src: module.default, title: filename };
});

const SvgGrid = () => {
  const [hoverTitle, setHoverTitle] = useState('');

  return (
    <div className="svg-grid-container">
      <div className="hover-title">
        <t>{hoverTitle || ""} {/* Default message */}</t>
      </div>
      <div className="svg-grid">
        {svgFiles.map((svg, index) => (
          <div 
            key={index} 
            className="svg-item"
            onMouseEnter={() => setHoverTitle(svg.title)}
            onMouseLeave={() => setHoverTitle('')}
            onClick={() => setHoverTitle(svg.title)}
          >
            <img src={svg.src} alt={svg.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SvgGrid;
