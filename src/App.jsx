import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Home Page</h1>
              <Link to="/users">
                <button>View All Users</button>
              </Link>
            </div>
          }
        />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
