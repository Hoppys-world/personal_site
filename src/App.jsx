import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import decomp from "poly-decomp";
import './polyfill/pathseg.js';

import starSVG1 from './assets/star1.svg';
import starSVG2 from './assets/plus.svg';
import starSVG3 from './assets/half.svg';
import "./App.css";
import SvgGrid from "./svgGrid.jsx";
import WorkExperience from "./work.jsx";
import egi from "./assets/work/EGI-logo copy.png";
import utah from "./assets/work/utah.svg";
import plural from "./assets/work/pluralsight3.png";
import me from "./assets/about/me.jpg";
import email from "./assets/contacts/email.svg";
import github from "./assets/contacts/github.svg";
import linkedin from "./assets/contacts/linkedin.svg";
import MatterCanvas from "./matterCanvas.jsx";
import resume from "./assets/contacts/resume.svg";


const ButtonRow = () => {
  return (
    <div className="button-row">
      <a href="https://github.com/Hoppys-world" className="button">
        <img src={github} alt="GitHub" className="icon" />
      </a>
      <a href="https://www.linkedin.com/in/jacob-hopkins-codes" className="button">
        <img src={linkedin} alt="LinkedIn" className="icon" />
      </a>
      <a href="mailto:jacobkhopkins@gmail.com" className="button">
        <img src={email} alt="Email" className="icon" />
      </a>
    </div>

  );
};

function App() {
  return (
    <div className="App">
      <MatterCanvas />

      <header className="banner">
        <nav>
          <button onClick={() => document.getElementById('section1').scrollIntoView({ behavior: "smooth" })}>About</button>
          <button onClick={() => document.getElementById('section2').scrollIntoView({ behavior: "smooth" })}>Work</button>
          <button onClick={() => document.getElementById('section3').scrollIntoView({ behavior: "smooth" })}>Skills</button>
          <button onClick={() => document.getElementById('section4').scrollIntoView({ behavior: "smooth" })}>Contact</button>
        </nav>
      </header>

      <section id="section0" className="head-section">

        <h1>I'm Jacob Hopkins,</h1>
        <p>A Full Stack developer out of Salt Lake City</p>
      </section>
      <section id="section1" className="about main"><h2>About</h2>
      <div id="about-info"><img src={me} alt={`Picture of Jacob Hopkins`} />
      <div id="about-right"><p>Here is a description of me, there is more text about me here I am. I am a student at the Universit of Utah</p><button><img src={resume} alt="Resume Download" className="icon" />Resume</button>
      </div>
      </div>
      </section>
      <section id="section2" className="work main"><h2>Work</h2>
        <WorkExperience logo={plural}
          companyName="Pluralsight"
          responsibilities={[
            "Led front-end development and Led front-end development and Led front-end development and Led front-end development ",
            "Collaborated with cross-functional teams and Collaborated with cross-functional teams and Collaborated with cross-functional teams ",
            "Improved app performance by 30% and Improved app performance by 30% and Improved app performance by 30%"
          ]} />
        <WorkExperience logo={egi}
          companyName="Energy and Geoscience Instatute"
          responsibilities={[
            "Led front-end development and Led front-end development and Led front-end development and Led front-end development ",
            "Collaborated with cross-functional teams and Collaborated with cross-functional teams and Collaborated with cross-functional teams ",
            "Improved app performance by 30% and Improved app performance by 30% and Improved app performance by 30%"
          ]} />
        <WorkExperience logo={utah}
          companyName="University of Utah"
          responsibilities={[
            "Led front-end development and Led front-end development and Led front-end development and Led front-end development ",
            "Collaborated with cross-functional teams and Collaborated with cross-functional teams and Collaborated with cross-functional teams ",
            "Improved app performance by 30% and Improved app performance by 30% and Improved app performance by 30%"
          ]} /></section>
      <section id="section3" className="skills main"><h2>Skills</h2><SvgGrid /></section>
      <section id="section4" className="contact main"><h2>Contact</h2><ButtonRow /><div></div></section>
    </div>
  );
}

export default App;
