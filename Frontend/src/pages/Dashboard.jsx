import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Logout
        </button>
      </div>
      <p className="text-gray-600">Notes dashboard yahan aayega — agla feature 🚀</p>
    </div>
  );
};

export default Dashboard;