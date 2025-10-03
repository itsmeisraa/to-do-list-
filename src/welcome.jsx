import { useEffect, useState, useRef } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Rating } from 'react-simple-star-rating';


// Alarm sound (put alarm.mp3 inside /public/sounds or keep the online one)
const alarmSound = new Audio("/sounds/alarm.mp3");

function Welcome() {
  // -------------------------------
  // Pomodoro Timer + Sounds
  // -------------------------------
  const rainRef = useRef(new Audio("/sounds/rain.mp3"));
  const fireRef = useRef(new Audio("/sounds/fire.mp3"));
  const libraryRef = useRef(new Audio("/sounds/library.mp3"));
  const forestRef = useRef(new Audio("/sounds/forest.mp3"));
  const instrumentalRef = useRef(new Audio("/sounds/instrumental.mp3"));

  const [currentSound, setCurrentSound] = useState(null);

  // Helper: stop current sound
  const stopCurrentSound = () => {
    if (!currentSound) return;
    const sound =
      currentSound === "rain" ? rainRef.current :
      currentSound === "fire" ? fireRef.current :
      currentSound === "library" ? libraryRef.current :
      currentSound === "forest" ? forestRef.current :
      currentSound === "instrumental" ? instrumentalRef.current :
      null;
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
    setCurrentSound(null);
  };

  // Play sound (loop)
  const playSound = (type) => {
    stopCurrentSound();
    let sound;
    if (type === "rain") sound = rainRef.current;
    if (type === "fire") sound = fireRef.current;
    if (type === "library") sound = libraryRef.current;
    if (type === "forest") sound = forestRef.current;
    if (type === "instrumental") sound = instrumentalRef.current;

    if (sound) {
      sound.loop = true; // ✅ keep looping
      sound.play();
      setCurrentSound(type);
    }
  };

  // -------------------------------
  // Timer
  // -------------------------------
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem("pomodoroTime");
    return savedTime ? Number(savedTime) : 25 * 60;
  });
  const [isRunning, setIsRunning] = useState(() => localStorage.getItem("pomodoroRunning") === "true");
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            alarmSound.play();
            stopCurrentSound(); // stop sound when finished
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem("pomodoroTime", time);
    localStorage.setItem("pomodoroRunning", isRunning);
  }, [time, isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // --- TIMER ACTIONS ---
  const startTimer = () => {
    setIsRunning(true);
    playSound("rain"); // ✅ auto play rain when starting Pomodoro
  };

  const stopTimer = () => {
    setIsRunning(false);
    stopCurrentSound(); // ✅ stop sound
  };

  const resetTimer = () => {
    setTime(25 * 60);
    stopCurrentSound(); // ✅ stop sound
  };

  const breakTimer = () => {
    setTime(5 * 60);
    stopCurrentSound(); // ✅ stop sound
  };

  // -------------------------------
  // ToDo List
  // -------------------------------
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [input, setInput] = useState("");

 const addTask = () => {
  if (input.trim() !== "") {
    setTasks(prev => [...prev, { text: input, rating: 0 }]);
    setInput("");
  }
};


  const deleteTask = (index) => setTasks(prev => prev.filter((_, i) => i !== index));
  const moveUp = (index) => {
    if (index === 0) return;
    const newTasks = [...tasks];
    [newTasks[index - 1], newTasks[index]] = [newTasks[index], newTasks[index - 1]];
    setTasks(newTasks);
  };
  const moveDown = (index) => {
    if (index === tasks.length - 1) return;
    const newTasks = [...tasks];
    [newTasks[index + 1], newTasks[index]] = [newTasks[index], newTasks[index + 1]];
    setTasks(newTasks);
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // -------------------------------
  // Vanta Background
  // -------------------------------
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
          birdSize: 1.00,
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

  // -------------------------------
  // JSX
  // -------------------------------
  return (
    <div id="vanta-background" style={{ width: '100%', minHeight: '200vh' }}>
      {/* Navbar */}
      <nav className="navbar">
        <ul>
          <li><a href="#welcome-section">Home</a></li>
          <li><a href="#promologue-section">Promologue</a></li>
          <li><a href="#todo-section">To-Do List</a></li>
          <li><a href="#contact-section">Contact</a></li>
        </ul>
      </nav>

      {/* Welcome Section */}
      <section id="welcome-section" style={{ cursor:'default',height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', fontFamily: '"Lora", serif',
        textShadow: '0 0 10px rgba(0,0,0,0.7)' }}>
        <h1 style={{ zIndex: 20, fontSize: '2rem', fontWeight: '600', color: 'white',
          background: 'rgba(0,0,0,0.6)', padding: '15px 30px',
          borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
          <Typewriter
            words={['Welcome to your To-Do List','Plan. Do. Achieve.','Stay Organized, Stay Productive.']}
            loop={true} typeSpeed={100} deleteSpeed={60} delaySpeed={300}
          />
        </h1>
        <div style={{ position: 'absolute', bottom: '20px', fontSize: '2rem',
          color: 'white', animation: 'bounce 2s infinite', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          ⬇️
        </div>
      </section>

      {/* ToDo + Promologue Section */}
      <section style={{ display: 'flex', minHeight: '100vh', padding: '2rem', gap: '2rem', color: 'white' }}>
        
        {/* Left side - To Do List */}
        <div id="todo-section" style={{ flex: 1, background: 'rgba(0,0,0,0.6)', padding: '2rem',
          borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className='todo-title'>📝 My To-Do List</h1>
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Add a task..." className='input'/>
            <button onClick={addTask} className="todo-btn">Add</button>
          </div>
          <ul className="todo-list">
  {tasks.map((task, index) => (
    <li key={index}>
      {task.text /* instead of just task */}
      <div className='star-rating' >
        <Rating 
          onClick={(rateValue) => {
            const stars = rateValue / 20;
            const newTasks = [...tasks];
            newTasks[index].rating = stars;
            setTasks(newTasks);
          }}
          ratingValue={task.rating * 20}
          size={20}
          label={false}
          transition
          fillColor="gold"
          emptyColor="lightgray"
        />
        <button className="todo-btn" onClick={() => moveUp(index)}>⬆️</button>
        <button className="todo-btn" onClick={() => moveDown(index)}>⬇️</button>
        <button className="todo-btn" onClick={() => deleteTask(index)}>❌</button>
      </div>
    </li>
  ))}
</ul>

        </div>

        {/* Right side - Promologue + Timer */}
        <div id="promologue-section" style={{ flex: 1, background: 'rgba(0,0,0,0.6)', padding: '2rem',
          borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className='todo-title'>💡 Promologue</h2>
          <p className='todo-sub'>"Small steps every day lead to big changes."</p>
          <p className='todo-sub'>"Don’t watch the clock; do what it does. Keep going."</p>

          <div className="timer-box">⏱ {formatTime(time)}</div>

          <div className="timer-buttons">
            <button onClick={startTimer}>▶ Start</button>
            <button onClick={stopTimer}>⏸ Stop</button>
            <button onClick={resetTimer}>🔄 Reset</button>
            <button onClick={breakTimer}>☕ Break</button>
          </div>

        
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <h3 className='todo-sub'>🎶 Background Sounds</h3>
            <button  className='sounds' onClick={() => playSound("rain")}>🌧 Rain</button>
            <button className='sounds'  onClick={() => playSound("fire")}>🔥 Fire</button>
            <button className='sounds'  onClick={() => playSound("library")}>📚 Library</button>
            <button className='sounds'  onClick={() => playSound("forest")}>🌲 forest</button>
            <button className='sounds'  onClick={() => playSound("instrumental")}>🎹 instrumental</button>
           </div>
           <div className='timer-buttons'>
            <button onClick={stopCurrentSound}>🔇 </button>
           </div>
         
        </div>
      </section>

          {/* Contact Section */}
<div id="contact-section" style={{ marginTop: '2rem', textAlign: 'center', color: 'white' }}>
  <h3 className="todo-title">Contact Me</h3>

  {/* Israa */}
  <div className="contact-card">
    <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" className="contact-icon" />
    <span className="contact-name">Israa</span>
    <p>
      <span className="contact-label">Email: </span>
      <a href="mailto:israaisraa202000@gmail.com">israaisraa202000@gmail.com</a>
    </p>
    <p>
      <span className="contact-label">GitHub: </span>
      <a href="https://github.com/itsmeisraa" target="_blank" rel="noreferrer">itsmeisraa</a>
    </p>
  </div>

  {/* Mahdi */}
  <div className="contact-card">
    <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" className="contact-icon" />
    <span className="contact-name">Mahdi</span>
    <p>
      <span className="contact-label">Email: </span>
      <a href="mailto:midofad2006@gmail.com">midofad2006@gmail.com</a>
    </p>
    <p>
      <span className="contact-label">GitHub: </span>
      <a href="https://github.com/maxhdi-fdl" target="_blank" rel="noreferrer">maxhdi-fdl</a>
    </p>
  </div>
    

      {/* Footer */}
      <div className="footer">
        &copy; 2025 <a href='https://github.com/itsmeisraa'> Israa  </a>& <a href="https://github.com/maxhdi-fdl"> Mahdi </a>. All rights reserved.
      </div>
      {/* CSS */}
      <style>
        {`
          /* Scroll arrow bounce */
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }

          /* Navbar */
          .navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: rgba(0,0,0,0.6);
            padding: 10px 0;
            z-index: 100;
            display: flex;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.4);
          }
          .navbar ul {
            list-style: none;
            display: flex;
            gap: 30px;
            margin: 0;
            padding: 0;
          }
          .navbar ul li a {
            color: white;
            text-decoration: none;
            font-family: "Lora", serif;
            font-size: 18px;
            text-shadow: 1px 2px 10px rgba(0,0,0,0.7);
            position: relative;
            transition: color 0.3s ease;
          }
          .navbar ul li a::after {
            content: '';
            position: absolute;
            width: 0%;
            height: 2px;
            bottom: -3px;
            left: 0;
            background-color: white;
            transition: width 0.3s ease;
          }
          .navbar ul li a:hover::after {
            width: 100%;
          }
          .navbar ul li a:hover {
            color: #DD6CE6;
          }

          html {
            scroll-behavior: smooth;
          }

          /* Todo List */
          ul.todo-list {
            list-style: none;
            padding: 0;
            margin: 0;
            width: 100%;
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

          .todo-title {
          cursor:default;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 45px;
            transition: text-shadow 0.3s ease;
          }
          .todo-title:hover {
            text-shadow: 1px 2px 10px white;
          }

          .todo-sub {
          cursor:default;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 20px;
            transition: text-shadow 0.3s ease;
          }
          .todo-sub:hover {
            text-shadow: 1px 2px 10px white;
          }

          .input {
            border-radius: 6px;
            border: none;
            background-color: #f5f5f5;
            padding: 8px 12px;
            width: 200px;
            outline: none;
            transition: box-shadow 0.3s;
            color: black;
          }
          .input:focus {
            box-shadow: 0 0 10px #4fa138;
          }

          .todo-btn {
            background: #DD6CE6;
            border: none;
            padding: 5px 10px;
            border-radius: 6px;
            cursor: pointer;
            color: white;
            font-weight: bold;
            font-size: 20px;
            margin-left: 5px;
            transition: all 0.3s ease;
          }
          .todo-btn:hover {
            background: #AB4CB5;
            transform: translateY(-2px) scale(1.05);
          }

          /* Chronometer circle */
          .timer-box {
            margin-top: 2rem;
            width: 160px;
            height: 160px;
            line-height: 160px;
            border-radius: 50%;
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            color: white;
            background: rgba(255,255,255,0.1);
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            font-family: "Courier New", Courier, monospace;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
            animation: pulse 1500ms infinite;
          }
          @keyframes pulse {
            0%,100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .timer-box:hover {
            background: rgba(255,255,255,0.25);
            animation: none;
          }

          .timer-buttons {
            margin-top: 1rem;
            display: flex;
            gap: 10px;
            justify-content: center;
          }
          .timer-buttons button {
            background: #DD6CE6;
            border: none;
            border-radius: 6px;
            padding: 8px 15px;
            font-size: 1rem;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          }
          .timer-buttons button:hover {
            background: #AB4CB5;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
          }
          .timer-buttons button:active {
            transform: translateY(0) scale(0.98);
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          }

          .footer {
            text-align: center;
            padding: 1rem;
            font-size: 1rem;
            color: white;
            background: rgba(0,0,0,0.6);
            border-top: 1px solid rgba(255,255,255,0.2);
            margin-top: 2rem;
            font-family: "Lora", serif;
          }
          a{
            cursor:pointer;
            transition: text-shadow 0.3s ease, font-size 0.2s;
          }
          a:hover {
            text-shadow: 1px 2px 10px white;
            font-size:18px
          }
            #contact-section{
            text-align: center;
            padding: 1rem;
            font-size: 1rem;
            color: white;
            background: rgba(0,0,0,0.6);
            border-top: 1px solid rgba(255,255,255,0.2);
            margin-top: 2rem;
            font-family: "Lora", serif;}
            #contact-section a {
  color: white;
  text-decoration: none;
  transition: text-shadow 0.3s ease, font-size 0.2s;
  
}

#contact-section a:hover {
  text-shadow: 1px 2px 10px white;
  font-size: 18px;

.star-rating .star-widget,
.star-rating .star-widget div,
.star-rating .star-widget > * {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
}

/* If the component wraps stars in some unnamed divs, target any child divs */
.star-rating div {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
}

/* Force each star SVG side by side */
svg.star-svg {
  display: inline-block !important;
  vertical-align: middle !important;
}

}
.israa {
  display: block;           /* Makes it start on its own line */
  font-size: 1.8rem;        /* Big, like a title */
  font-weight: bold;         /* Emphasis */
  color: #FFFFFF;            /* White text */
  margin-bottom: 5px;        /* Space between title and email */
  text-shadow: 1px 1px 5px rgba(0,0,0,0.5); /* Optional shadow */
}

.israa + a {
  display: block;           /* Starts on its own line under title */
  font-size: 1.4rem;        /* Slightly smaller than title */
  font-weight: bold;
  color: #FFDD57;           /* Highlight color for email */
  text-decoration: none;    /* Remove underline */
  text-shadow: 1px 1px 5px rgba(0,0,0,0.3); /* Subtle shadow */
  transition: all 0.3s ease;
}

.israa + a:hover {
  color: #FFD700;           /* Brighter on hover */
  font-size: 1.45rem;       /* Slight growth on hover */
  text-shadow: 1px 1px 8px rgba(0,0,0,0.7);
}
.contact-card {
      display: inline-block;
      text-align: left;
      background: rgba(255,255,255,0.1);
      padding: 15px 25px;
      margin: 10px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      transition: transform 0.3s ease, background 0.3s ease;
    }
    .contact-card:hover {
      transform: translateY(-5px);
      background: rgba(255,255,255,0.2);
    }
    .contact-icon {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 10px;
    }
    .contact-name {
      font-size: 1.5rem;
      font-weight: bold;
      display: inline-block;
      vertical-align: middle;
    }
    .contact-label {
      font-weight: bold;
      font-size: 1.2rem;
    }
    #contact-section a {
      color: #DD6CE6;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    #contact-section a:hover {
      color: #AB4CB5;
      text-shadow: 1px 1px 8px rgba(0,0,0,0.5);
    }
     .sounds {
            background: #DD6CE6;
            border: none;
            border-radius: 6px;
            padding: 8px 18px;
            margin-left:8px;
            font-size: 1rem;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          }
          .sounds:hover {
            background: #E0BCE0;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
          }
          .sounds:active {
            transform: translateY(0) scale(0.98);
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          }
      @media (max-width: 768px) {
  /* Navbar stays horizontal */
  .navbar {
    padding: 8px 0;
  }
 
  .navbar ul {
    flex-direction: row; /* Keep in one line */
    gap: 15px;           /* Small gap between items */
    justify-content: center;
  }
  .navbar ul li a {
    font-size: 16px;     /* Slightly smaller for mobile */
    padding: 6px 10px;   /* Touch-friendly */
  }

  /* Optional hover underline animation remains */
  .navbar ul li a::after {
    bottom: -2px;
  }

  /* Stack To-Do + Chrono vertically */
  section[style*="display: flex"] {
    flex-direction: column !important;
    align-items: center;
  }
  #todo-section, #promologue-section {
    width: 90% !important;
    margin-bottom: 2rem;
  }

  /* Timer & Buttons */
  .timer-box {
    width: 140px;
    height: 140px;
    line-height: 140px;
    font-size: 1.6rem;
  }
  .timer-buttons button {
    font-size: 0.9rem;
    padding: 6px 12px;
  }

  /* To-Do List */
  .todo-title {
    font-size: 2rem !important;
  }
  .todo-sub {
    font-size: 1rem !important;
  }
  .input {
    width: 80%;
  }
  .todo-btn {
    font-size: 18px;
    padding: 5px 10px;
  }

  /* Contact Section */
  #contact-section h3.todo-title {
    font-size: 1.8rem;
  }
  .contact-card {
    width: 90%;
    padding: 12px 20px;
    margin: 10px auto;
  }
  .contact-name {
    font-size: 1.3rem;
  }
  .contact-label {
    font-size: 1rem;
  }
  #contact-section a {
    font-size: 1.2rem;
  }

  /* Footer */
  .footer {
    font-size: 0.9rem;
    padding: 0.8rem 0;
  }
         .sounds {
    font-size: 0.9rem;
    padding: 6px 14px;
    margin: 6px 4px;
    border-radius: 5px;
  }
}
}

        `}
      </style>
    </div>
    </div>
  );
}

export default Welcome;
