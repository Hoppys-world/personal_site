import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const THICCNESS = 60;
const SPAWN_INTERVAL_MS = 1500;
let MAX_BALLS = 80;

const MatterCanvas = () => {
    const matterRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const groundRef = useRef(null);
    const leftWallRef = useRef(null);
    const rightWallRef = useRef(null);
    const nameRef = useRef(null);

    useEffect(() => {
        const matterContainer = matterRef.current;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const initialHeight = isMobile
            ? window.screen.height * .85 // Includes area under the bottom bar
            : null;


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
                width: window.innerWidth,
                height: isMobile ? initialHeight : window.innerHeight,
                background: "transparent",
                wireframes: false,
                showAngleIndicator: false,
            },
        });

        engineRef.current = engine;
        renderRef.current = render;

        const colors = ["#C85A5A", "#E69A5C", "#E8C45E", "#7FAF75", "#6C90B7"];
        let ballSize = 60;
        let ballRes = 0.8;

        if (window.innerWidth < 1000) {
            MAX_BALLS = 45;
            ballRes = 0.9;
            ballSize = 35;
        }

        const spawnBall = () => {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const circle = Bodies.circle(
                Math.random() * window.innerWidth,
                10,
                ballSize,
                {
                    friction: 0.3,
                    frictionAir: 0.00001,
                    restitution: ballRes,
                    render: {
                        fillStyle: color,
                        strokeStyle: "#4B5562",
                        lineWidth: 4,
                    },
                }
            );
            Composite.add(engine.world, circle);
        };

        let spawnedCount = 0;
        const intervalId = setInterval(() => {
            if (spawnedCount >= MAX_BALLS) {
                clearInterval(intervalId);
                return;
            }
            spawnBall();
            spawnedCount++;
        }, SPAWN_INTERVAL_MS);

        // Static bodies
        const createStaticBodies = () => {
            const width = window.innerWidth;
            const height = isMobile ? initialHeight : window.innerHeight;

            const ground = Bodies.rectangle(
                width / 2,
                height + THICCNESS / 2,
                width * 3,
                THICCNESS,
                { isStatic: true }
            );

            const leftWall = Bodies.rectangle(
                -THICCNESS / 2,
                height / 2,
                THICCNESS,
                height * 2,
                { isStatic: true }
            );

            const rightWall = Bodies.rectangle(
                width + THICCNESS / 2,
                height / 2,
                THICCNESS,
                height * 2,
                { isStatic: true }
            );

            const name = Bodies.rectangle(
                width / 2,
                height / 2,
                400,
                THICCNESS,
                { isStatic: true }
            );

            groundRef.current = ground;
            leftWallRef.current = leftWall;
            rightWallRef.current = rightWall;
            nameRef.current = name;

            Composite.add(engine.world, [ground, leftWall, rightWall]);
        };

        createStaticBodies();

        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false,
                },
            },
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

        // Resize handler
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const width = window.innerWidth;
                const height = isMobile ? initialHeight : window.innerHeight;

                render.canvas.width = width;
                render.canvas.height = height;
                render.options.width = width;
                render.options.height = height;

                Matter.Body.setPosition(
                    groundRef.current,
                    Matter.Vector.create(width / 2, height + THICCNESS / 2)
                );
                Matter.Body.setPosition(
                    leftWallRef.current,
                    Matter.Vector.create(-THICCNESS / 2, height / 2)
                );
                Matter.Body.setPosition(
                    rightWallRef.current,
                    Matter.Vector.create(width + THICCNESS / 2, height / 2)
                );
                Matter.Body.setPosition(
                    nameRef.current,
                    Matter.Vector.create(width / 2, height / 2)
                );
            }, 100);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            clearInterval(intervalId);
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
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                zIndex: 2,
                pointerEvents: "none",
            }}
        />
    );
};

export default MatterCanvas;
