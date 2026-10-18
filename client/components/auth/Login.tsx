"use client";

import React, { useEffect, useMemo, useRef } from 'react';

const Login: React.FC = () => {
    // Generate static random values once per mount to prevent hydration errors
    const blobsData = useMemo(() => {
        return Array.from({ length: 6 }).map(() => ({
            size: Math.random() * 200 + 150,
            left: Math.random() * 80 + 10,
            top: Math.random() * 80 + 10,
            animationDelay: Math.random() * -20,
            animationDuration: Math.random() * 15 + 15,
        }));
    }, []);

    // Keep track of the blob DOM elements for high-performance updates
    const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            // Apply subtle parallax effect to each blob
            blobRefs.current.forEach((blob, index) => {
                if (blob) {
                    const speed = (index + 1) * 20;
                    // Using margins for parallax so we don't overwrite the CSS transform animation
                    blob.style.marginLeft = `${x * speed}px`;
                    blob.style.marginTop = `${y * speed}px`;
                }
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="mercury-wrapper">


            <svg className="svg-filter-hidden">
                <defs>
                    <filter id="gooey">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="goo"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                    </filter>
                </defs>
            </svg>

            <div className="stage" id="stage">
                {blobsData.map((data, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            blobRefs.current[index] = el;
                        }}
                        className="blob"
                        style={{
                            width: `${data.size}px`,
                            height: `${data.size}px`,
                            left: `${data.left}%`,
                            top: `${data.top}%`,
                            animationDelay: `${data.animationDelay}s`,
                            animationDuration: `${data.animationDuration}s`,
                        }}
                    />
                ))}
            </div>

            <main className="auth-container">
                <header className="header">
                    <span className="brand-id">System Node: 0x992</span>
                    <h1>NEURAL<br/>ACCESS</h1>
                </header>

                <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>User Identity</label>
                        <input type="text" placeholder="ID-492-BASE" required />
                        <div className="input-glow"></div>
                    </div>

                    <div className="form-group">
                        <label>Sequence Key</label>
                        <input type="password" placeholder="••••••••" required />
                        <div className="input-glow"></div>
                    </div>

                    <div className="submit-wrap">
                        <div className="mercury-drop"></div>
                        <button type="submit" className="btn-base">Initialize Stream</button>
                    </div>
                </form>

                <footer className="footer-nav">
                    <a href="#encrypted">ENCRYPTED RECOVERY</a>
                    <a href="#archive">NEW ARCHIVE</a>
                </footer>
            </main>
        </div>
    );
};

export default Login;