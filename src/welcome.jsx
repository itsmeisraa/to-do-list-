// welcome.jsx
import { useEffect } from 'react';

function Welcome() {
    useEffect(() => {
        // Check if scripts are already loaded
        if (window.THREE && window.VANTA) {
            initVanta();
            return;
        }

        // Load Three.js
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        
        // Load Vanta.js after Three.js is loaded
        threeScript.onload = () => {
            const vantaScript = document.createElement('script');
            vantaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.birds.min.js';
            vantaScript.onload = initVanta;
            document.head.appendChild(vantaScript);
        };
        
        document.head.appendChild(threeScript);

        function initVanta() {
            if (window.VANTA) {
                window.VANTA.BIRDS({
                    el: "#vanta-background",
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color1: 0xff0001,
                    birdSize: 2.00,
                    speedLimit: 6.00,
                    separation: 29.00,
                    alignment: 85.00,
                    cohesion: 50.00
                });
            }
        }

        // Cleanup
        return () => {
            // Remove any existing Vanta instances
            if (window.VANTA && window.VANTA.current) {
                window.VANTA.current.destroy();
            }
        };
    }, []);

    return (
        <div id="vanta-background" style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ color: 'white', zIndex: 20 }}>Welcome to l3alamya
            </h1>
        </div>
    );
}

export default Welcome;