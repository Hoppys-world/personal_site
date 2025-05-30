import React from "react";
import "./App.css";

function App() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    
    <div className="App">
      <header className="banner">
        <nav>
          <button onClick={() => scrollToSection("section1")}>About</button>
          <button onClick={() => scrollToSection("section2")}>Work</button>
          <button onClick={() => scrollToSection("section3")}>Skills</button>
          <button onClick={() => scrollToSection("section4")}>Contact</button>
        </nav>
      </header>

      <section id="section0" className="head-section">
        <h1>I'm Jacob Hopkins,</h1>
        <p>A Full Stack developer from Salt Lake</p>
      </section>

      <section id="section1" className="section">
        <h2>About</h2>
        <p>This is the first section of the page.</p>
      </section>

      <section id="section2" className="section">
        <h2>Work</h2>
        <p>This is the second section of the page.</p>
      </section>

      <section id="section3" className="section">
        <h2>Skills</h2>
        <p>This is the third section of the page.</p>
      </section>

      <section id="section4" className="section">
        <h2>Contact</h2>
        <p>This is the third section of the page.</p>
      </section>
    </div>
  );
}

export default App;

