import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscribers, sendEmails, logout } from '../utils/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [movieUrl, setMovieUrl] = useState('');
  const [carUrl, setCarUrl] = useState('');
  const [sportsUrl, setSportsUrl] = useState('');
  const history = useNavigate();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await getSubscribers();
      setSubscribers(response.data);
    } catch (error) {
      toast.error('Error fetching subscribers');
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendEmails(sportsUrl, carUrl, movieUrl);
      toast.success('Emails sent successfully');
    } catch (error) {
      toast.error('Failed to send emails');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      history('/admin/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="bg-gray-900 bg-opacity-80 text-white p-8 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
          Logout
        </button>
        <div className="space-y-4">
          <input
            type="text"
            value={movieUrl}
            onChange={(e) => setMovieUrl(e.target.value)}
            placeholder="Enter movie wallpaper URL"
            className="bg-gray-800 text-white p-2 rounded w-full"
          />
          <input
            type="text"
            value={carUrl}
            onChange={(e) => setCarUrl(e.target.value)}
            placeholder="Enter car wallpaper URL"
            className="bg-gray-800 text-white p-2 rounded w-full"
          />
          <input
            type="text"
            value={sportsUrl}
            onChange={(e) => setSportsUrl(e.target.value)}
            placeholder="Enter sports wallpaper URL"
            className="bg-gray-800 text-white p-2 rounded w-full"
          />
          <button 
            onClick={handleSendEmail} 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
            Send Email
          </button>
        </div>
        <h3 className="text-xl font-semibold mt-6">Subscribers</h3>
        <p className="mb-4">Total Subscribers: {subscribers.length}</p>
        <ul className="list-none p-0">
          {subscribers.map((subscriber, index) => (
            <li key={index} className="bg-gray-800 p-2 rounded mb-2">
              {subscriber.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
