import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import decomp from "poly-decomp";
import './polyfill/pathseg.js';

import starSVG1 from './assets/star1.svg';
import starSVG2 from './assets/plus.svg';
import starSVG3 from './assets/half.svg';
import "./App.css";

import SvgGrid from "./svgGrid.jsx";

function App() {
  const sceneRef = useRef(null);
  const engineRef = useRef(Matter.Engine.create());
  let static_bodies = 0;

  // Move svgConfigs outside useEffect so it’s a stable reference
  const svgConfigs = useRef([
    {
      url: starSVG1,
      position: { x: 200, y: 400 },
      scale: 5,
      color: '#f19648',
    },
    {
      url: starSVG2,
      position: { x: 1000, y: 200 },
      scale: 2,
      color: '#f55a3c',
    },
    {
      url: starSVG3,
      position: { x: 800, y: 400 },
      scale: 1,
      color: '#063e7b',
    },
  ]).current;

  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;

    Matter.Common.setDecomp(decomp);

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "transparent",
      }
    });
    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    Matter.Composite.add(world, Matter.Bodies.rectangle(
      window.innerWidth / 2, window.innerHeight,
      window.innerWidth, 60, { isStatic: true, render: { fillStyle: 'brown' } }
    ));

    const loadAndAddSVG = async (world, url, position, scale, color) => {
      try {
        const response = await fetch(url);
        const raw = await response.text();
        const doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
        const paths = doc.querySelectorAll('path');

        if (paths.length === 0) {
          console.warn(`No paths found in SVG: ${url}`);
          return;
        }

        let allVertices = [];
        paths.forEach(path => {
          const vertices = Matter.Svg.pathToVertices(path, 0.1);
          const scaledVertices = vertices.map(v => ({ x: v.x * scale, y: v.y * scale }));
          allVertices.push(scaledVertices);
        });

        const body = Matter.Bodies.fromVertices(position.x, position.y, allVertices, {
          render: { fillStyle: color, strokeStyle: color, lineWidth: 1 },
          restitution: 0.9,
        }, true);
        console.log("Calling add");
        Matter.Composite.add(world, body);
        Matter.Body.setAngle(body, Math.PI / 3);
      } catch (err) {
        console.error(`Failed to load SVG ${url}:`, err);
      }
    };

    console.log("length: " + svgConfigs.length);
    svgConfigs.forEach(config => {
      if (static_bodies < svgConfigs.length) {
        loadAndAddSVG(world, config.url, config.position, config.scale, config.color);
      }
      static_bodies = static_bodies + 1;
    });

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Matter.Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      Matter.World.clear(world);
      render.canvas.remove();
      render.textures = {};
    };
  }, []); // Empty dependencies to run once on mount

  return (
    <div className="App">
      <div ref={sceneRef} className="matter-scene" />
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
        <p>A Full Stack developer from Salt Lake</p>
      </section>
      <section id="section1" className="about"><h2>About</h2><p>-</p></section>
      <section id="section2" className="work"><h2>Work</h2></section>
      <section id="section3" className="skills"><h2>Skills</h2><SvgGrid /></section>
      <section id="section4" className="contact"><h2>Contact</h2><p>Email: Jacobkhopkins@gmail.com</p><p>Linkedin: www.linkedin.com/in/jacob-hopkins-codes</p></section>
    </div>
  );
}

export default App;
