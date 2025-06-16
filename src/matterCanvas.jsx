import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import decomp from "poly-decomp";
import nameSVG from "./assets/boundobj.svg";

Matter.Common.setDecomp(decomp);

const THICCNESS = 60;
const SPAWN_INTERVAL_MS = 1500;
let MAX_BALLS = 100;

const MatterCanvas = () => {
    const matterRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const svgBodyRef = useRef(null);
    const spriteBodyRef = useRef(null);
    const svgVerticesRef = useRef(null);
    const svgBoundsRef = useRef(null);
    const rightWallRef = useRef(null);
    const leftWallRef = useRef(null);
    const groundRef = useRef(null);

    useEffect(() => {
        const matterContainer = matterRef.current;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        const {
            Engine, Render, Runner, Bodies, Composite, Svg, Body
        } = Matter;

        const engine = Engine.create();
        const render = Render.create({
            element: matterContainer,
            engine,
            options: {
                width: window.innerWidth,
                height: isMobile ? window.screen.height * 0.85 : window.innerHeight,
                background: "transparent",
                wireframes: false,
            },
        });

        engineRef.current = engine;
        renderRef.current = render;

        const height = isMobile ? window.screen.height * 0.85 : window.innerHeight;

        const ground = Bodies.rectangle(window.innerWidth / 2, height + THICCNESS / 2, window.innerWidth * 3, THICCNESS, { isStatic: true });
        const leftWall = Bodies.rectangle(-THICCNESS / 2, height / 2, THICCNESS, height * 2, { isStatic: true });
        const rightWall = Bodies.rectangle(window.innerWidth + THICCNESS / 2, height / 2, THICCNESS, height * 2, { isStatic: true });
        groundRef.current = ground;
        leftWallRef.current = leftWall;
        rightWallRef.current = rightWall;

        Composite.add(engine.world, [ground, leftWall, rightWall]);

        const colors = ["#C85A5A", "#E69A5C", "#E8C45E", "#7FAF75", "#6C90B7"];
        const ballSize = window.innerWidth < 800 ? 25 : 40;
        if (window.innerWidth < 800) MAX_BALLS = 55;

        let spawnedCount = 0;
        const spawnBall = () => {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const ball = Bodies.circle(Math.random() * window.innerWidth, 10, ballSize, {
                friction: 0.3,
                frictionAir: 0.00001,
                restitution: 0.9,
                render: {
                    fillStyle: color,
                    strokeStyle: "#4B5562",
                    lineWidth: 4,
                },
            });
            Composite.add(engine.world, ball);
        };
        const intervalId = setInterval(() => {
            if (spawnedCount++ >= MAX_BALLS) return clearInterval(intervalId);
            spawnBall();
        }, SPAWN_INTERVAL_MS);

        const loadSVGVertices = async () => {
            const res = await fetch(nameSVG);
            const raw = await res.text();
            const svgDoc = new DOMParser().parseFromString(raw, "image/svg+xml");
            const paths = Array.from(svgDoc.querySelectorAll("path, polygon"));

            let rawVertices = paths.flatMap(el => {
                if (el.tagName.toLowerCase() === "path") {
                    return Svg.pathToVertices(el, 30);
                } else if (el.tagName.toLowerCase() === "polygon") {
                    return el.getAttribute("points").trim().split(/\s+/).map(p => {
                        const [x, y] = p.split(",").map(Number);
                        return { x, y };
                    });
                }
                return [];
            });

            const bounds = rawVertices.reduce((acc, v) => ({
                minX: Math.min(acc.minX, v.x),
                maxX: Math.max(acc.maxX, v.x),
                minY: Math.min(acc.minY, v.y),
                maxY: Math.max(acc.maxY, v.y),
            }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

            svgVerticesRef.current = rawVertices;
            svgBoundsRef.current = bounds;

            recreateBodies();
        };

        const recreateBodies = () => {
            const rawVertices = svgVerticesRef.current;
            const bounds = svgBoundsRef.current;

            const width = window.innerWidth;
            const height = isMobile ? window.screen.height * 0.85 : window.innerHeight;
            const svgWidth = bounds.maxX - bounds.minX;
            const svgHeight = bounds.maxY - bounds.minY;

            renderRef.current.canvas.width = width;
            renderRef.current.canvas.height = height;
            renderRef.current.options.width = width;
            renderRef.current.options.height = height;

            const scale = (width * 0.7) / svgWidth;
            const scaledVertices = rawVertices.map(v => ({
                x: (v.x - bounds.minX - svgWidth / 2) * scale * .94,
                y: (v.y - bounds.minY - svgHeight / 2) * scale * .94
            }));

            const centerX = width / 2;
            const centerY = height / 2;
            let xerror = .97;
            let yerror = 1.12;

            if(width < 800){
                xerror = .98;
                yerror = 1.04;
            }

            if (svgBodyRef.current) Composite.remove(engine.world, svgBodyRef.current);
            if (spriteBodyRef.current) Composite.remove(engine.world, spriteBodyRef.current);

            const svgBody = Bodies.fromVertices(centerX * xerror, centerY * yerror, [scaledVertices], {
                isStatic: true,
                render: {
                    fillStyle: "transparent",
                    strokeStyle: "#000",
                    lineWidth: 0
                }
            }, true);

            const spriteScaleX = (svgWidth * scale) / 208;
            const spriteScaleY = (svgHeight * scale) / 135;

            const spriteBody = Bodies.rectangle(centerX, centerY, 100, 100, {
                isStatic: true,
                collisionFilter: { mask: 0 },
                render: {
                    sprite: {
                        texture: '/nameobj.svg',
                        xScale: spriteScaleX,
                        yScale: spriteScaleY
                    }
                }
            });

            svgBodyRef.current = svgBody;
            spriteBodyRef.current = spriteBody;

            Composite.add(engine.world, [svgBody, spriteBody]);

            if (rightWallRef.current) {
                Body.setPosition(rightWallRef.current, {
                    x: width + THICCNESS / 2,
                    y: height / 2
                });
            }

            if (leftWallRef.current) {
                Body.setPosition(leftWallRef.current, {
                    x: -THICCNESS / 2,
                    y: height / 2
                });
            }

            if (groundRef.current) {
                Body.setPosition(groundRef.current, {
                    x: width / 2,
                    y: height + THICCNESS / 2
                });
            }
        };

        loadSVGVertices();

        window.addEventListener("resize", recreateBodies);

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("resize", recreateBodies);
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            Matter.World.clear(engine.world);
            render.canvas.remove();
            render.textures = {};
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
                pointerEvents: "none"
            }}
        />
    );
};

export default MatterCanvas;