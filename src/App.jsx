import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './pages/Users';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/common/PrivateRoute';
import { CategoryProvider } from './context/CategoryContext';
import BudgetPage from './pages/BudgetPage';
import { BudgetProvider } from './context/BudgetContext';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <CategoryProvider>
                <Home />
              </CategoryProvider>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <PrivateRoute>
              <BudgetProvider>
              <BudgetPage />
              </BudgetProvider>
            </PrivateRoute>
          }
        />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
