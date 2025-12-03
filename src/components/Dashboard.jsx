import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Chattr</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome, {user?.username}! 🎉
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                <p className="text-green-800 font-medium">
                  ✅ Authentication Successful
                </p>
                <p className="text-green-700 text-sm mt-1">
                  You are now logged in to Chattr
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  Your Profile
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <img
                      src={user?.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Username</p>
                      <p className="font-medium text-gray-900">{user?.username}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bio</p>
                    <p className="font-medium text-gray-900">
                      {user?.bio || 'No bio yet'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-2 text-blue-900">
                  🚀 Next Steps
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                  <li>Implement real-time messaging with Socket.io</li>
                  <li>Add group chat functionality</li>
                  <li>Create user search and friend system</li>
                  <li>Add media sharing capabilities</li>
                  <li>Implement online/offline status</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;