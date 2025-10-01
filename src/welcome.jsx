import { useEffect, useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'
import TodoList from './components/ui/TodoList.jsx'

function Welcome() {
    // Chronometer logic
    const [time, setTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Vanta background
    useEffect(() => {
        if (window.THREE && window.VANTA) {
            initVanta();
            return;
        }

        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
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

        return () => {
            if (window.VANTA && window.VANTA.current) {
                window.VANTA.current.destroy();
            }
        };
    }, []);

    return (
        <div id="vanta-background" style={{ width: '100%', minHeight: '200vh' }}>
            {/* Welcome Section */}
            <section 
                style={{ 
                    height: '100vh', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontFamily: '"Lora", serif',
                    textShadow: '0 0 10px rgba(0,0,0,0.7)',
                }}
            >
                <h1
                    style={{
                        zIndex: 20,
                        fontSize: '2rem',
                        fontWeight: '600',
                        color: 'white',
                        fontFamily: 'sans-serif',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '15px 30px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    }}
                >
                    <Typewriter
                        words={[
                            'Welcome to your To-Do List',
                            'Plan. Do. Achieve.',
                            'Stay Organized, Stay Productive.'
                        ]}
                        loop={true}
                        typeSpeed={100}
                        deleteSpeed={60}
                        delaySpeed={1000}
                    />
                </h1>

                {/* Scroll down arrow */}
                <div 
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        fontSize: '2rem',
                        color: 'white',
                        animation: 'bounce 2s infinite',
                        cursor: 'pointer'
                    }}
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    ⬇️
                </div>
            </section>

            {/* ToDo + Promologue Section */}
            <section 
                style={{ 
                    display: 'flex', 
                    minHeight: '100vh',
                    padding: '2rem',
                    gap: '2rem',
                    color: 'white'
                }}
            >
                {/* Left side - To Do List */}
                <div style={{ 
                    flex: 1, 
                    background: 'rgba(0,0,0,0.6)', 
                    padding: '2rem', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
                }}>
                    <h2 style={{ marginBottom: '1rem' }}>📝 My To-Do List</h2>
                    <TodoList />
                </div>

                {/* Right side - Promologue */}
                <div style={{ 
                    flex: 1, 
                    background: 'rgba(0,0,0,0.6)', 
                    padding: '2rem', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
                }}>
                    <h2>💡 Promologue</h2>
                    <p>"Small steps every day lead to big changes."</p>
                    <p>"Don’t watch the clock; do what it does. Keep going."</p>

                    {/* Chronometer */}
                    <div style={{
                        marginTop: '2rem',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '10px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
                    }}>
                        ⏱ {formatTime(time)}
                    </div>
                </div>
            </section>

            {/* Arrow bounce animation */}
            <style>
                {`
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-10px); }
                        60% { transform: translateY(-5px); }
                    }

                    ul.todo-list {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    ul.todo-list li {
                        background: rgba(255,255,255,0.1);
                        padding: 10px 15px;
                        border-radius: 6px;
                        margin-bottom: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    }
                    ul.todo-list li.done {
                        text-decoration: line-through;
                        color: #bbb;
                    }
                    button.todo-btn {
                        background: #ff9800;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 6px;
                        cursor: pointer;
                        color: white;
                        font-weight: bold;
                    }
                    button.todo-btn:hover {
                        background: #e67e00;
                    }
                `}
            </style>
        </div>
    );
}

export default Welcome
