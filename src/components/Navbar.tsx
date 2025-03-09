import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">ServiceHub</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                Home
              </Link>
              <Link to="/services" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                Services
              </Link>
              <Link to="/test-credentials" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                Test Credentials
              </Link>
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {profile?.is_provider ? (
                  <Link to="/profile" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                    <Zap size={18} className="mr-1" />
                    Leads
                  </Link>
                ) : (
                  <Link to="/messages" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                    <MessageSquare size={18} className="mr-1" />
                    Messages
                  </Link>
                )}
                <Link to="/profile" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                  <User size={18} className="mr-1" />
                  Profile
                </Link>
                {profile?.is_admin && (
                  <Link to="/admin" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                    <ShieldCheck size={18} className="mr-1" />
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/test-credentials" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Test Credentials
            </Link>
            {user ? (
              <>
                {profile?.is_provider ? (
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Leads
                  </Link>
                ) : (
                  <Link 
                    to="/messages" 
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Messages
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {profile?.is_admin && (
                  <Link 
                    to="/admin" 
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;