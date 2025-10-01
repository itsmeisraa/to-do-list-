// welcome.jsx
import { useEffect } from 'react'
import { Typewriter } from 'react-simple-typewriter'

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
            if (window.VANTA && window.VANTA.current) {
                window.VANTA.current.destroy();
            }
        };
    }, []);

    return (
        <div 
            id="vanta-background" 
            style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' , fontFamily: '"Lora", serif',
                textShadow: '0 0 10px rgba(0,0,0,0.7)' , background: 'linear-gradient(90deg, #ff0001, #ff9800)' , padding: '10px 20px' ,  borderRadius: '10px' , 
                fontSize: '3rem' , fontWeight: '700' 
            }}
        >
            <h1   style={{
    zIndex: 20,
    fontSize: '2rem',          // a bit smaller than h1
    fontWeight: '500',           // lighter than bold
    background: '#FFFF',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: 'sans-serif',  // clean default ,
    fontWeight: 'bold'
  }}
>
                <Typewriter
                    words={[
    'Welcome to your To-Do List',
    'Plan. Do. Achieve.',
    'Stay Organized, Stay Productive.'
  ]}
                    loop={true}       // only type once
                    typeSpeed={100}    // speed of typing (ms per character)
                    deleteSpeed={60}   // not needed if loop=false
                    delaySpeed={1000}  // delay before delete (if loop true)
                />
            </h1>
        </div>
        
    );
}

export default Welcome
