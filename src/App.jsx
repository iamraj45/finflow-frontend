import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
