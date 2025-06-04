import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const THICCNESS = 60;

const MatterCanvas = () => {
    const matterRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const groundRef = useRef(null);
    const leftWallRef = useRef(null);
    const rightWallRef = useRef(null);
    const height = document.documentElement.scrollHeight;

    useEffect(() => {
        const matterContainer = matterRef.current;
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite;

        const engine = Engine.create();
        const render = Render.create({
            element: matterContainer,
            engine: engine,
            options: {
                width: matterContainer.clientWidth,
                height: height,
                background: "transparent",
                wireframes: false,
                showAngleIndicator: false
            }
        });

        engineRef.current = engine;
        renderRef.current = render;
        const colors = ['#073E7B', '#F55A3C', '#F19648', '#F5D259', '#77F09B'];
        let ballSize = 40;
        let ballCount = 100;
        let ballRes = .8;
        const screenWidth = window.innerWidth;
        if (screenWidth < 1000){
            ballCount = 45;
            ballRes = 0.8;
            ballSize = 30;
        }
        for (let i = 0; i < ballCount; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            let circle = Bodies.circle(i, 10, ballSize, {
                friction: 0.3,
                frictionAir: 0.00001,
                restitution: ballRes,
                render: {
                    fillStyle: color,
                    strokeStyle: '#4B5562',                           
                    lineWidth: 4                                   
                  }
            });
            Composite.add(engine.world, circle);
        }

        const ground = Bodies.rectangle(
            matterContainer.clientWidth / 2,
            height + THICCNESS / 2,
            27184,
            THICCNESS,
            { isStatic: true }
        );

        const leftWall = Bodies.rectangle(
            0 - THICCNESS / 2,
            height / 2,
            THICCNESS,
            height * 5,
            { isStatic: true }
        );

        const rightWall = Bodies.rectangle(
            matterContainer.clientWidth + THICCNESS / 2,
            height / 2,
            THICCNESS,
            height * 5,
            { isStatic: true }
        );

        groundRef.current = ground;
        leftWallRef.current = leftWall;
        rightWallRef.current = rightWall;

        Composite.add(engine.world, [ground, leftWall, rightWall]);

        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        Composite.add(engine.world, mouseConstraint);

        mouseConstraint.mouse.element.removeEventListener(
            "mousewheel",
            mouseConstraint.mouse.mousewheel
        );
        mouseConstraint.mouse.element.removeEventListener(
            "DOMMouseScroll",
            mouseConstraint.mouse.mousewheel
        );

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        const handleResize = () => {
            render.canvas.width = matterContainer.clientWidth;
            render.canvas.height = height;

            Matter.Body.setPosition(
                groundRef.current,
                Matter.Vector.create(
                  matterContainer.clientWidth / 2,
                  height + THICCNESS / 2
                )
              );

            Matter.Body.setPosition(
                rightWallRef.current,
                Matter.Vector.create(
                    matterContainer.clientWidth + THICCNESS / 2,
                    matterContainer.height / 2
                )
            );
        };

        window.addEventListener("resize", handleResize);
        // const timeoutId = setTimeout(() => {
        //     Matter.Render.stop(render);
        //     console.log("Render paused after 30 seconds");
        //   }, 10000);  // 30000 ms = 30 seconds
        return () => {
            //clearTimeout(timeoutId);          // Cleanup
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            Matter.World.clear(engine.world);
            render.canvas.remove();
            render.textures = {};
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
  <div
    ref={matterRef}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `1000px`,   // Cover full scrollable document height
      zIndex: 2,
      pointerEvents: 'none'
    }}
  />
);
      

};

export default MatterCanvas;
