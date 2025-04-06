import { Link } from "react-router-dom";
import AddExpenseForm from "../components/AddExpenseForm";

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">FinFlow</h1>
      <Link to="/users">
        <button className="mb-6 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          View All Users
        </button>
      </Link>

      <AddExpenseForm />
    </div>
  );
}
