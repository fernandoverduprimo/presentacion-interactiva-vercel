
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-6xl font-extrabold text-indigo-400 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-300 ease-in-out"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
