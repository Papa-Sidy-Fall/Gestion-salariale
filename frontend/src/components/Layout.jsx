import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, Briefcase, DollarSign, Calendar, LogOut, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

const getTailwindColorClass = (hexColor, type = 'bg') => {
  const colorMap = {
    '#3B82F6': 'blue',
    '#10B981': 'green',
    '#8B5CF6': 'purple',
    '#EF4444': 'red',
    '#F97316': 'orange',
    '#EC4899': 'pink',
    '#6366F1': 'indigo',
    '#14B8A6': 'teal',
    '#06B6D4': 'cyan',
    '#059669': 'emerald',
    '#F59E0B': 'amber',
    '#6B7280': 'gray',
    '#6FA4AF': 'teal'
  };

  const baseColor = colorMap[hexColor] || 'blue';

  if (type === 'bg') return `bg-${baseColor}-600`;
  if (type === 'hoverBg') return `hover:bg-${baseColor}-700`;
  if (type === 'text') return `text-${baseColor}-600`;
  if (type === 'border') return `border-${baseColor}-500`;
  if (type === 'bg-light') return `bg-${baseColor}-50`;
  if (type === 'border-light') return `border-${baseColor}-200`;
  if (type === 'focus-border') return `focus:border-${baseColor}-500`;
  if (type === 'focus-ring') return `focus:ring-${baseColor}-100`;
  if (type === 'text-strong') return `text-${baseColor}-800`;
  return '';
};

const Layout = ({ children }) => {
  const { user, logout, companyLogo, companyColor } = useAuth();
  const navigate = useNavigate();
  const primaryColor = companyColor || '#6FA4AF';
  const primaryBgClass = getTailwindColorClass(primaryColor, 'bg');
  const primaryHoverBgClass = getTailwindColorClass(primaryColor, 'hoverBg');
  const primaryTextColorClass = getTailwindColorClass(primaryColor, 'text');

  console.log('Layout - companyColor:', companyColor);
  console.log('Layout - primaryColor:', primaryColor);
  console.log('Layout - primaryBgClass:', primaryBgClass);
  console.log('Layout - primaryHoverBgClass:', primaryHoverBgClass);
  console.log('Layout - primaryTextColorClass:', primaryTextColorClass);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['SUPER_ADMIN', 'ADMIN', 'CAISSIER'] },
    { name: 'Employés', href: '/employees', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Cycles de paie', href: '/payruns', icon: Calendar, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { name: 'Paiements', href: '/payments', icon: DollarSign, roles: ['SUPER_ADMIN', 'ADMIN', 'CAISSIER'] },
    { name: 'Entreprises', href: '/companies', icon: Building2, roles: ['SUPER_ADMIN'] },
    { name: 'Présences', href: '/attendances', icon: Briefcase, roles: ['SUPER_ADMIN', 'ADMIN'] },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barre de navigation supérieure */}
      <div className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              {companyLogo ? (
                <img className="h-10 w-auto mr-3" src={companyLogo} alt="Company Logo" />
              ) : (
                <Building2 className={`h-8 w-8 mr-3 ${primaryTextColorClass}`} />
              )}
              <span className="text-xl font-bold text-gray-900">Gestion Salariale</span>
            </div>
            <div className="flex items-center">
              {user && (
                <span className="text-gray-700 text-sm mr-4">
                  Connecté en tant que: <span className="font-medium">{user.email} ({user.role})</span>
                </span>
              )}
              <button
                onClick={handleLogout}
                className={`bg-gray-400 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${primaryBgClass} ${primaryHoverBgClass}`}
              >
                <LogOut className="h-5 w-5 mr-2 bg-gray-400" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal avec navigation latérale */}
      <div className="flex flex-1">
        {/* Navigation latérale */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
              <div className="flex-grow flex flex-col">
                <nav className="flex-1 px-2 py-4 space-y-1">
                  {navigation.map((item) => (
                    (item.roles.includes(user?.role)) && (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md
                          ${location.pathname === item.href
                            ? `${primaryBgClass} text-white`
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        <item.icon
                          className={`mr-3 flex-shrink-0 h-6 w-6
                            ${location.pathname === item.href
                              ? 'text-white'
                              : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    )
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
