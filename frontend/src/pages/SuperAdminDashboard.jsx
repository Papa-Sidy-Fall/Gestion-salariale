import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Users, DollarSign, TrendingUp, Eye, Settings } from 'lucide-react';

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
  if (type === 'bg-light') return `bg-${baseColor}-100`;
  if (type === 'text-strong') return `text-${baseColor}-800`;
  if (type === 'border-light') return `border-${baseColor}-200`;
  return '';
};

const SuperAdminDashboard = () => {
  const { user, logout, companyColor, companyLogo } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    totalCompanies: 0,
    totalEmployees: 0,
    totalSalary: 0,
    totalPayments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
    calculateGlobalStats();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/companies');
      setCompanies(response.data.companies);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGlobalStats = async () => {
    try {
      // Récupérer toutes les entreprises avec leurs données
      const companiesResponse = await axios.get('http://localhost:3000/api/companies');
      const allCompanies = companiesResponse.data.companies;

      let totalEmployees = 0;
      let totalSalary = 0;
      let totalPayments = 0;

      for (const company of allCompanies) {
        // Compter les employés
        totalEmployees += company.employees?.length || 0;

        // Calculer la masse salariale
        if (company.employees) {
          totalSalary += company.employees.reduce((sum, emp) => sum + emp.rate, 0);
        }
      }

      // Récupérer tous les paiements
      const paymentsResponse = await axios.get('http://localhost:3000/api/payments');
      totalPayments = paymentsResponse.data.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

      setGlobalStats({
        totalCompanies: allCompanies.length,
        totalEmployees,
        totalSalary,
        totalPayments
      });
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
    }
  };

  const handleViewCompany = (company) => {
    // Sauvegarder l'entreprise sélectionnée
    localStorage.setItem('selectedCompany', JSON.stringify({
      id: company.id,
      name: company.name,
      logo: company.logo,
      color: company.color
    }));
    // Recharger pour afficher le dashboard de l'entreprise
    window.location.reload();
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${color}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-bold text-gray-900">
                {value}
              </dd>
              {subtitle && (
                <dd className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {companyLogo && (
                <img
                  src={companyLogo}
                  alt="Logo entreprise"
                  className="h-8 w-8 rounded-full object-cover mr-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                Vue Globale - Super Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/companies')}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Gérer les entreprises
              </button>
              <span className="text-sm text-gray-700">
                Super Admin
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Statistiques Globales */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques Globales</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Entreprises"
                value={globalStats.totalCompanies}
                icon={Building2}
                color={`border-l-4 ${getTailwindColorClass(companyColor, 'border')}`}
              />
              <StatCard
                title="Employés Totaux"
                value={globalStats.totalEmployees}
                icon={Users}
                color={`border-l-4 ${getTailwindColorClass(companyColor, 'border')}`}
              />
              <StatCard
                title="Masse Salariale"
                value={`${globalStats.totalSalary.toLocaleString()} FCFA`}
                icon={DollarSign}
                color={`border-l-4 ${getTailwindColorClass(companyColor, 'border')}`}
              />
              <StatCard
                title="Paiements Effectués"
                value={`${globalStats.totalPayments.toLocaleString()} FCFA`}
                icon={TrendingUp}
                color={`border-l-4 ${getTailwindColorClass(companyColor, 'border')}`}
              />
            </div>
          </div>

          {/* Liste des Entreprises */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className={`px-4 py-5 sm:px-6 flex justify-between items-center ${getTailwindColorClass(companyColor, 'bg-light')}`}>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Toutes les Entreprises
              </h3>
              <button
                onClick={() => navigate('/companies')}
                className={`${getTailwindColorClass(companyColor, 'bg')} ${getTailwindColorClass(companyColor, 'hoverBg')} text-white px-4 py-2 rounded-md text-sm font-medium`}
              >
                + Nouvelle Entreprise
              </button>
            </div>
            <ul className="divide-y divide-gray-200">
              {companies.map((company) => (
                <li key={company.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="flex-shrink-0 h-12 w-12">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="h-12 w-12 rounded-lg object-cover"
                            style={{ backgroundColor: company.color || '#6FA4AF' }}
                          />
                        ) : (
                          <div
                            className="h-12 w-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: company.color || '#6FA4AF' }}
                          >
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              {company.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {company.address || 'Pas d\'adresse'}
                            </p>
                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {company.employees?.length || 0} employés
                              </span>
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {company.users?.length || 0} utilisateurs
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewCompany(company)}
                        className={`${getTailwindColorClass(companyColor, 'bg')} ${getTailwindColorClass(companyColor, 'hoverBg')} text-white px-4 py-2 rounded-md text-sm font-medium flex items-center`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir Dashboard
                      </button>
                      <button
                        onClick={() => navigate('/companies')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Gérer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {companies.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Aucune entreprise créée.</p>
                <button
                  onClick={() => navigate('/companies')}
                  className={`${getTailwindColorClass(companyColor, 'bg')} ${getTailwindColorClass(companyColor, 'hoverBg')} text-white px-4 py-2 rounded-md text-sm font-medium`}
                >
                  Créer la première entreprise
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
