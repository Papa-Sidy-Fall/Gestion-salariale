import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalSalary: 0,
    paidAmount: 0,
    pendingAmount: 0,
    upcomingPayments: []
  });

  // Données du graphique - évolution de la masse salariale sur 6 mois
  const [salaryEvolution, setSalaryEvolution] = useState([
    { month: 'Juillet', amount: 1200000 },
    { month: 'Août', amount: 1250000 },
    { month: 'Septembre', amount: 1300000 },
    { month: 'Octobre', amount: 1350000 },
    { month: 'Novembre', amount: 1400000 },
    { month: 'Décembre', amount: 1500000 }
  ]);

  // Charger les vraies données depuis l'API
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Récupérer les statistiques des employés
      const employeesResponse = await axios.get(`http://localhost:3000/api/employees?companyId=${user?.companyId || ''}`);
      const employees = employeesResponse.data.employees || [];

      // Récupérer les statistiques des paiements
      const paymentsResponse = await axios.get(`http://localhost:3000/api/payments/stats?companyId=${user?.companyId || ''}`);
      const paymentStats = paymentsResponse.data.stats;

      // Récupérer les prochains paiements (bulletins non payés)
      const payRunsResponse = await axios.get(`http://localhost:3000/api/payruns?companyId=${user?.companyId || ''}`);
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
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.isActive).length;

      // Calculer la masse salariale (somme des taux des employés actifs)
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
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // En cas d'erreur, garder les données par défaut
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${color}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="text-2xl">{icon}</div>
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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Navigation pour Super Admin */}
              {user?.role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => navigate('/companies')}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Entreprises
                </button>
              )}

              <span className="text-sm text-gray-700">
                Bienvenue, {user?.email}
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Employés actifs"
              value={stats.totalEmployees}
              icon="👥"
              color="border-l-4 border-blue-500"
            />
            <StatCard
              title="Masse salariale"
              value={`${stats.totalSalary.toLocaleString()} FCFA`}
              icon="💰"
              color="border-l-4 border-green-500"
            />
            <StatCard
              title="Montant payé"
              value={`${stats.paidAmount.toLocaleString()} FCFA`}
              icon="✅"
              color="border-l-4 border-indigo-500"
            />
            <StatCard
              title="Montant restant"
              value={`${stats.pendingAmount.toLocaleString()} FCFA`}
              icon="⏳"
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
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;