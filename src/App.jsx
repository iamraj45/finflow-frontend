import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './pages/Users';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
