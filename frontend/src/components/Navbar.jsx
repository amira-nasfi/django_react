import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/patients', label: 'Patients' },
  { path: '/observations', label: 'Observations' },
  { path: '/practitioners', label: 'Praticiens' },
  { path: '/encounters', label: 'Rencontres' },
  { path: '/conditions', label: 'Conditions' },
  { path: '/medication-requests', label: 'Prescriptions' },
  { path: '/allergy-intolerances', label: 'Allergies' },
  { path: '/procedures', label: 'Procédures' },
  { path: '/diagnostic-reports', label: 'Rapports' },
  { path: '/appointments', label: 'Rendez-vous' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold whitespace-nowrap">FHIR API</Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap ${location.pathname === item.path ? 'bg-blue-900' : 'hover:bg-blue-600'}`}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm hidden md:block">{user.username}</span>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">Déconnexion</button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden pb-3 space-y-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded text-sm ${location.pathname === item.path ? 'bg-blue-900' : 'hover:bg-blue-600'}`}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
