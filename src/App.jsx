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
import Project from "./project.jsx";
import egi from "./assets/work/EGI-logo copy.png";
import utah from "./assets/work/utah.svg";
import plural from "./assets/work/pluralsight3.png";
import me from "./assets/about/me.jpg";
import email from "./assets/contacts/email.svg";
import github from "./assets/contacts/github.svg";
import linkedin from "./assets/contacts/linkedin.svg";
import MatterCanvas from "./matterCanvas.jsx";
import resume from "./assets/contacts/resume.svg";
import sourcerer from "./assets/work/resume.png";
import malloc from "./assets/work/malloc.png";


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


const handleDownload = () => {
  const link = document.createElement('a');
  link.href = '/resume/Jacob Hopkins Resume.pdf'; // relative to public folder
  link.download = 'Jacob Hopkins Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



function App() {
  return (
    <div className="App">
       <title>Jacob Hopkins</title>
       <link rel="icon" type="image/x-icon" href="/J.svg"></link>
      <MatterCanvas />
      <header className="banner">
        <nav>
          <button className="aboutB" onClick={() => document.getElementById('section1').scrollIntoView({ behavior: "smooth" })}>About</button>
          <button className="workB" onClick={() => document.getElementById('section2').scrollIntoView({ behavior: "smooth" })}>Work</button>
          <button className="ProjectsB" onClick={() => document.getElementById('section3').scrollIntoView({ behavior: "smooth" })}>Projects</button>
          <button className="SkillsB" onClick={() => document.getElementById('section4').scrollIntoView({ behavior: "smooth" })}>Skills</button>
          <button className="ContactB" onClick={() => document.getElementById('section5').scrollIntoView({ behavior: "smooth" })}>Contact</button>
        </nav>
      </header>
      <section id="section0" className="head-section">
        {/* <h1>I'm Jacob Hopkins,</h1>
        <p>A Full Stack developer out of Salt Lake City</p> */}
        <h1>I'm</h1>
        <h1>Jacob</h1>
        <h1>Hopkins</h1>
      </section>
      <section id="section1" className="about main"><h2 className="underline">About</h2>
        <div id="about-info"><img src={me} alt={`Picture of Jacob Hopkins`} />
          <div id="about-right"><p>My name is Jacob Hopkins, I am studying Computer Science at the University of Utah. I am a BS/MS Student so I am working on my undergraduate and masters concurrently. I'm passionate about all forms of full stack developement and love growing my skills.</p><button onClick={handleDownload}><img src={resume} alt="Resume Download" className="icon" />Resume</button>
          </div>
        </div>
      </section>
      <section id="section2" className="work main"><h2 className="underline">Work</h2>
        <WorkExperience logo={plural}
          companyName="Pluralsight"
          responsibilities={[
            "As a Result of an after-action report, I designed and deployed a fallback mechanism using internal user team APIs to automatically recover missing user data, improving system resilience and preventing recurrence of similar issues.",
            "Proactively identified and resolved security vulnerabilities by monitoring for issues, applying guideline-compliant fixes, testing thoroughly and redeploying updates.",
          ]}
          date="May 2025 - Current" />
        <WorkExperience logo={egi}
          companyName="Energy and Geoscience Institute"
          responsibilities={[
            "Collaborated with Geologists and Civil Engineers to design and develop custom software solutions tailored to industry needs.",
            "Led the design and development of a cutting-edge CO2 absorption calculation tool, streamlining environmental impact assessments for Geologists."
          ]}
          date="December 2024 - May 2025" />
        <WorkExperience logo={utah}
          companyName="University of Utah"
          responsibilities={[
            "Held office hours for additional student support, addressing questions on course material, assignments, and exam preparation.",
            "Worked closely with the course instructor and other TAs to coordinate teaching efforts and share best practices."
          ]}
          date="August 2024 - December 2024" /></section>
      <section id="section3" className="project main"><h2 className="underline">Projects</h2>
        <Project image={sourcerer} name="Sourcerer" tools="C#, MySQL, ASP.NET" bullets={["Worked as a full-stack developer on a team to build a machine learning-powered online source generator", "Designed and developed a cross-platform application using Flutter, deployed on web, iOS, and Android, ensuring aconsistent and seamless user experience across devices.", "Built a scalable Flask backend integrated with a MySQL database, enabling secure and efficient data storage andretrieval. Deployed on an EC2 Instance."]} />
        <Project image={malloc} name="Pooled Memory Allicator"  tools="C, Linux" bullets={["Developed a custom Memory Allocator in C using explicit and implicit free list strategies, achieving an increase inmemory allocation efficiency by processing requests 30% faster than traditional methods within the project scope.", "Implemented a suite of functional tests and stress tests to validate behavior under high load."]} />
      </section>
      <section id="section4" className="skills main"><h2 className="underline">Skills</h2><SvgGrid /></section>
      <section id="section5" className="contact main"><h2 className="underline">Contact</h2><ButtonRow /><p>Email: jacobkhopkins@gmail.com</p></section>
    </div>
  );
}

export default App;
