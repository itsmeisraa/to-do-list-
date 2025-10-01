// App.jsx (or App.js)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './welcome.jsx';
import TodoList from './components/ui/Todolist.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/todo" element={<TodoList />} />
      </Routes>
    </Router>
  );
}

export default App;
