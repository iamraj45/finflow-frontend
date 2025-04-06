import { Link } from "react-router-dom";
import AddExpenseForm from "../components/AddExpenseForm";

export default function Home() {
  return (
    <div className="mb-6 homepage-wrapper">
      <h1 className="font-bold mb-4">FinFlow - Your personal expense tracker</h1>
      <Link to="/users">
        <button className="mb-12 bg-gray-300 rounded hover:bg-gray-400">
          View Users
        </button>
      </Link>

      <AddExpenseForm />
    </div>
  );
}
