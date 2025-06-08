import React from "react";
import './project.css';


const Project = ({ image, name, tools, bullets }) => {
    return (
      <section className="project-experience">
        <div className="project-image">
          <img src={image} alt={`${name} image`} />
        </div>
        <div className="project-details">
          <div className="project-heading">
          <h3>{name}</h3>
          <p>{tools}</p>
          </div>
          <ul>
            {bullets.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };
  
  export default Project;