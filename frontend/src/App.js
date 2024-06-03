import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CalendarMain from './pages/calendarMain';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" Component={CalendarMain} />
      </Routes>
    </Router>
  );
}

export default App;