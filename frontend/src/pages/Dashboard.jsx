import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, DollarSign, CheckCircle, Clock, Plus, FileText, CreditCard, BarChart3, Check, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import SuperAdminDashboard from './SuperAdminDashboard';
import CashierDashboard from './CashierDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalSalary: 0,
    paidAmount: 0,
    pendingAmount: 0,
    upcomingPayments: []
  });

  // Données du graphique - évolution de la masse salariale sur 6 mois
  const [salaryEvolution, setSalaryEvolution] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  // Charger l'entreprise sélectionnée et les statistiques
  useEffect(() => {
    const savedCompany = localStorage.getItem('selectedCompany');
    if (savedCompany) {
      const companyData = JSON.parse(savedCompany);
      setSelectedCompany(companyData);
    }

    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Déterminer l'entreprise à utiliser :
      // - Si Super Admin avec entreprise sélectionnée : utiliser celle-ci
      // - Si Super Admin sans sélection : utiliser son entreprise ou vide
      // - Si Admin/Caissier : utiliser leur entreprise
      let companyIdParam = '';
      const savedCompany = localStorage.getItem('selectedCompany');

      if (user?.role === 'SUPER_ADMIN' && savedCompany) {
        const companyData = JSON.parse(savedCompany);
        companyIdParam = companyData.id;
      } else if (user?.role !== 'SUPER_ADMIN') {
        companyIdParam = user?.companyId || '';
      }

      // Récupérer les statistiques des employés
      const employeesResponse = await axios.get(`http://localhost:3000/api/employees?companyId=${companyIdParam}`);
      const employees = employeesResponse.data.employees || [];

      // Récupérer les statistiques des paiements
      const paymentsResponse = await axios.get(`http://localhost:3000/api/payments/stats?companyId=${companyIdParam}`);
      const paymentStats = paymentsResponse.data.stats;

      // Récupérer les prochains paiements (bulletins non payés)
      const payRunsResponse = await axios.get(`http://localhost:3000/api/payruns?companyId=${companyIdParam}`);
      const payRuns = payRunsResponse.data.payRuns || [];

      const upcomingPayments = [];
      payRuns.forEach(payRun => {
        if (payRun.payslips) {
          payRun.payslips.forEach(payslip => {
            if (payslip.status !== 'PAYE') {
              const totalPaid = payslip.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
              const remainingAmount = payslip.net - totalPaid;

              if (remainingAmount > 0) {
                upcomingPayments.push({
                  ...payslip,
                  payRun: { period: payRun.period },
                  amount: remainingAmount
                });
              }
            }
          });
        }
      });

      // Calculer les statistiques
      const activeEmployees = employees.filter(emp => emp.isActive).length;

      // Calculer la masse salariale (somme des taux des employés actifs seulement)
      const totalSalary = employees
        .filter(emp => emp.isActive)
        .reduce((sum, emp) => sum + emp.rate, 0);

      const newStats = {
        totalEmployees: activeEmployees,
        totalSalary: totalSalary,
        paidAmount: paymentStats.totalAmount || 0,
        pendingAmount: totalSalary - (paymentStats.totalAmount || 0),
        upcomingPayments: upcomingPayments.slice(0, 5) // Limiter à 5 paiements
      };

      setStats(newStats);

      // Récupérer les données du graphique (évolution sur 6 mois)
      await fetchSalaryEvolution(companyIdParam);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // En cas d'erreur, garder les données par défaut
    }
  };

  const fetchSalaryEvolution = async (companyId) => {
    setChartLoading(true);
    try {
      // Générer les 6 derniers mois
      const months = [];
      const currentDate = new Date();

      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

        months.push({ period, monthName });
      }

      // Pour chaque mois, récupérer les payruns et calculer la masse salariale
      const evolutionData = [];

      for (const month of months) {
        try {
          const payRunsResponse = await axios.get(`http://localhost:3000/api/payruns?companyId=${companyId}&period=${month.period}`);
          const payRuns = payRunsResponse.data.payRuns || [];

          // Calculer la masse salariale totale pour ce mois
          let totalSalary = 0;
          payRuns.forEach(payRun => {
            if (payRun.payslips) {
              payRun.payslips.forEach(payslip => {
                totalSalary += payslip.gross || 0;
              });
            }
          });

          evolutionData.push({
            month: month.monthName.charAt(0).toUpperCase() + month.monthName.slice(1),
            amount: totalSalary
          });
        } catch (error) {
          // Si pas de données pour ce mois, mettre 0
          evolutionData.push({
            month: month.monthName.charAt(0).toUpperCase() + month.monthName.slice(1),
            amount: 0
          });
        }
      }

      setSalaryEvolution(evolutionData);
    } catch (error) {
      console.error('Erreur lors du chargement des données du graphique:', error);
      // Données par défaut si erreur
      setSalaryEvolution([
        { month: 'Mois 1', amount: 0 },
        { month: 'Mois 2', amount: 0 },
        { month: 'Mois 3', amount: 0 },
        { month: 'Mois 4', amount: 0 },
        { month: 'Mois 5', amount: 0 },
        { month: 'Mois 6', amount: 0 }
      ]);
    } finally {
      setChartLoading(false);
    }
  };

  // Routing selon le rôle
  if (user?.role === 'SUPER_ADMIN' && !selectedCompany) {
    // Super Admin sans entreprise sélectionnée → Vue globale
    return <SuperAdminDashboard />;
  }

  if (user?.role === 'CAISSIER') {
    // Caissier → Dashboard spécifique
    return <CashierDashboard />;
  }

  // Admin ou Super Admin avec entreprise sélectionnée → Dashboard Admin

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${color}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-blue-400" />
            
        


          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`shadow ${selectedCompany && user?.role === 'SUPER_ADMIN' ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-b-4' : 'bg-white'}`}
           style={selectedCompany && user?.role === 'SUPER_ADMIN' ? { borderBottomColor: selectedCompany.color || '#6FA4AF' } : {}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo de l'entreprise si disponible - PLUS VISIBLE */}
              {(selectedCompany?.logo || user?.company?.logo) && (
                <div className="flex items-center mr-6">
                  <img
                    src={selectedCompany?.logo || user?.company?.logo}
                    alt="Logo entreprise"
                    className="h-14 w-14 rounded-xl object-cover shadow-lg border-2 border-white"
                    style={{
                      backgroundColor: selectedCompany?.color || user?.company?.color || '#6FA4AF',
                      boxShadow: `0 4px 8px rgba(0,0,0,0.1), 0 0 0 2px ${selectedCompany?.color || user?.company?.color || '#6FA4AF'}20`
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      console.warn('Erreur de chargement du logo:', e.target.src);
                    }}
                  />
                  {selectedCompany && user?.role === 'SUPER_ADMIN' && (
                    <div className="ml-3">
                      <h2 className="text-lg font-bold text-gray-900 leading-tight">
                        {selectedCompany.name}
                      </h2>
                      <p className="text-xs text-indigo-600 font-medium">
                        Dashboard entreprise
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Titre principal avec indicateur d'entreprise */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.role === 'SUPER_ADMIN' && !selectedCompany ? 'Vue Globale - Super Admin' :
                   user?.role === 'SUPER_ADMIN' && selectedCompany ? 'Gestion des Entreprises' :
                   user?.role === 'ADMIN' ? 'Tableau de bord' :
                   'Gestion des Paiements'}
                </h1>
                {selectedCompany && user?.role === 'SUPER_ADMIN' && (
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                      <Building2 className="h-4 w-4 mr-1" />
                      Entreprise sélectionnée: {selectedCompany.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Navigation selon le rôle */}
              {user?.role === 'SUPER_ADMIN' && (
                <>
                  <button
                    onClick={() => navigate('/companies')}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Entreprises
                  </button>
                  {selectedCompany && (
                    <button
                      onClick={() => {
                        localStorage.removeItem('selectedCompany');
                        setSelectedCompany(null);
                        window.location.reload();
                      }}
                      className="text-orange-600 hover:text-orange-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Vue globale
                    </button>
                  )}
                </>
              )}

              {user?.role === 'ADMIN' && (
                <>
                  <button
                    onClick={() => navigate('/employees')}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Employés
                  </button>
                  <button
                    onClick={() => navigate('/payruns')}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Cycles de paie
                  </button>
                </>
              )}

              {user?.role === 'CAISSIER' && (
                <button
                  onClick={() => navigate('/payments')}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Paiements
                </button>
              )}

              <span className="text-sm text-gray-700">
                {user?.role === 'SUPER_ADMIN' ? 'Super Admin' :
                 user?.role === 'ADMIN' ? `Admin - ${user?.company?.name || 'Entreprise'}` :
                 `Caissier - ${user?.company?.name || 'Entreprise'}`}
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
          {/* Contenu selon le rôle */}
          {user?.role === 'SUPER_ADMIN' && !selectedCompany ? (
            /* Vue Super Admin - Résumé des entreprises (sans entreprise sélectionnée) */
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Vue d'ensemble des entreprises
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Gérez toutes les entreprises depuis cette interface.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <button
                      onClick={() => navigate('/companies')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-medium"
                    >
                      Accéder à la gestion des entreprises
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      Créez, modifiez et supprimez des entreprises
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (user?.role === 'ADMIN' || (user?.role === 'SUPER_ADMIN' && selectedCompany)) ? (
            /* Vue Admin - Dashboard complet */
            <>
              {/* Indicateur d'entreprise sélectionnée pour Super Admin */}
              {selectedCompany && user?.role === 'SUPER_ADMIN' && (
                <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src={selectedCompany.logo}
                        alt="Logo entreprise"
                        className="h-12 w-12 rounded-lg object-cover border-2 border-white shadow-md"
                        style={{ backgroundColor: selectedCompany.color || '#6FA4AF' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-bold text-gray-900">
                        Dashboard de l'entreprise: {selectedCompany.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Vous consultez actuellement les données de cette entreprise.
                        <button
                          onClick={() => {
                            localStorage.removeItem('selectedCompany');
                            setSelectedCompany(null);
                            window.location.reload();
                          }}
                          className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium underline"
                        >
                          Retour à la vue globale
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                  title="Employés actifs"
                  value={stats.totalEmployees}
                  icon={Users}
                  color="border-l-4 border-blue-500"
                />
                <StatCard
                  title="Masse salariale"
                  value={`${stats.totalSalary.toLocaleString()} FCFA`}
                  icon={DollarSign}
                  color="border-l-4 border-green-500"
                />
                <StatCard
                  title="Montant payé"
                  value={`${stats.paidAmount.toLocaleString()} FCFA`}
                  icon={Check}
                  color="border-l-4 border-indigo-500"
                />
                <StatCard
                  title="Montant restant"
                  value={`${stats.pendingAmount.toLocaleString()} FCFA`}
                  icon={Clock}
                  color="border-l-4 border-yellow-500"
                />
              </div>

          {/* Charts and additional content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolution de la masse salariale */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Évolution de la masse salariale (6 derniers mois)
                </h3>
                <div className="h-64">
                  {chartLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-gray-600">Chargement des données...</span>
                    </div>
                  ) : salaryEvolution.length > 0 && salaryEvolution.some(item => item.amount > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salaryEvolution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip
                          formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Masse salariale']}
                          labelStyle={{ color: '#374151' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <BarChart3 className="h-16 w-16 mb-4 text-gray-300" />
                      <p className="text-center">
                        Aucune donnée de paie disponible pour les 6 derniers mois.<br />
                        <span className="text-sm">Les données apparaîtront après la création des premiers cycles de paie.</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Prochains paiements */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Prochains paiements à effectuer
                </h3>
                <div className="space-y-3">
                  {stats.upcomingPayments && stats.upcomingPayments.length > 0 ? (
                    stats.upcomingPayments.slice(0, 3).map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {payment.employee?.firstName} {payment.employee?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {payment.payRun?.period || 'Salaire du mois'}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {payment.amount?.toLocaleString() || '0'} FCFA
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Aucun paiement en attente
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Actions rapides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/payruns')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Gérer cycles de paie
              </button>
              <button
                onClick={() => navigate('/employees')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Gérer employés
              </button>
              <button
                onClick={() => navigate('/payruns?tab=generate')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Générer bulletins
              </button>
              <button
                onClick={() => navigate('/payments')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Voir paiements
              </button>
            </div>
          </div>
            </>
          ) : user?.role === 'CAISSIER' ? (
            /* Vue Caissier - Paiements uniquement */
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Gestion des paiements
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Enregistrez les paiements, générez les reçus et consultez les bulletins.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <button
                      onClick={() => navigate('/payments')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-medium"
                    >
                      Accéder aux paiements
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      Gérer les paiements et générer les reçus
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;