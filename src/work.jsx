import React from "react";
import './work.css';

const WorkExperience = ({ logo, companyName, responsibilities, date }) => {
    return (
      <section className="work-experience">
        <div className="work-logo">
          <img src={logo} alt={`${companyName} Logo`} />
        </div>
        <div className="work-details">
          <h3>{companyName}</h3>
          <p>{date}</p>
          <ul>
            {responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };
  
  export default WorkExperience;
