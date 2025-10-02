import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DollarSign, Clock, CheckCircle, AlertCircle, FileText, CreditCard, Calculator } from 'lucide-react';

const CashierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingPayslips, setPendingPayslips] = useState([]);
  const [todayPayments, setTodayPayments] = useState([]);
  const [honoraireEmployees, setHonoraireEmployees] = useState([]);
  const [stats, setStats] = useState({
    todayPayments: 0,
    todayAmount: 0,
    pendingCount: 0,
    pendingAmount: 0,
    budget: 0
  });
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'ESPECES'
  });
  const [manualEntryData, setManualEntryData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    notes: ''
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchPendingPayslips();
    fetchTodayPayments();
    fetchHonoraireEmployees();
    fetchCompanyStats();
  }, []);


  const fetchPendingPayslips = async () => {
    try {
      const companyId = user?.companyId;
      const response = await axios.get(`http://localhost:3000/api/payruns?companyId=${companyId}`);
      const payRuns = response.data.payRuns;

      const pending = [];
      let pendingAmount = 0;

      payRuns.forEach(payRun => {
        if (payRun.payslips) {
          payRun.payslips.forEach(payslip => {
            if (payslip.status !== 'PAYE') {
              const totalPaid = payslip.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
              const remainingAmount = payslip.net - totalPaid;

              if (remainingAmount > 0) {
                pending.push({
                  ...payslip,
                  payRunPeriod: payRun.period,
                  remainingAmount
                });
                pendingAmount += remainingAmount;
              }
            }
          });
        }
      });

      setPendingPayslips(pending);
      setStats(prev => ({
        ...prev,
        pendingCount: pending.length,
        pendingAmount
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des bulletins:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayPayments = async () => {
    try {
      const companyId = user?.companyId;
      const response = await axios.get(`http://localhost:3000/api/payments/company/${companyId}`);
      const allPayments = response.data.payments;

      // Filtrer les paiements du jour
      const today = new Date().toDateString();
      const todayPaymentsList = allPayments.filter(p =>
        new Date(p.date).toDateString() === today
      );

      const todayAmount = todayPaymentsList.reduce((sum, p) => sum + p.amount, 0);

      setTodayPayments(todayPaymentsList);
      setStats(prev => ({
        ...prev,
        todayPayments: todayPaymentsList.length,
        todayAmount
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    }
  };

  const fetchHonoraireEmployees = async () => {
    try {
      const companyId = user?.companyId;
      const response = await axios.get(`http://localhost:3000/api/employees?companyId=${companyId}`);
      const employees = response.data.employees.filter(e =>
        e.isActive && e.contractType === 'HONORAIRE'
      );
      setHonoraireEmployees(employees);
    } catch (error) {
      console.error('Erreur lors du chargement des employés honoraires:', error);
    }
  };

  const fetchCompanyStats = async () => {
    try {
      const companyId = user?.companyId;
      const response = await axios.get(`http://localhost:3000/api/companies/${companyId}/stats`);
      setStats(prev => ({
        ...prev,
        budget: response.data.budget || 0
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques entreprise:', error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/api/payments', {
        payslipId: selectedPayslip.id,
        amount: parseFloat(paymentData.amount),
        method: paymentData.method
      });

      fetchPendingPayslips();
      fetchTodayPayments();
      setShowPaymentModal(false);
      setSelectedPayslip(null);
      setPaymentData({ amount: '', method: 'ESPECES' });
      showNotification('Paiement enregistré avec succès!');
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const openPaymentModal = (payslip) => {
    setSelectedPayslip(payslip);
    setPaymentData({
      amount: payslip.remainingAmount.toString(),
      method: 'ESPECES'
    });
    setShowPaymentModal(true);
  };

  const generateInvoice = async (paymentId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/payments/${paymentId}/invoice`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture-${paymentId.slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      showNotification('Erreur lors du téléchargement de la facture', 'error');
    }
  };

  const calculateHours = useCallback((checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diffMs = new Date(`2000-01-01T${checkOut}`) - new Date(`2000-01-01T${checkIn}`);
    const hours = diffMs / (1000 * 60 * 60);
    return Math.round(hours * 10) / 10; // Arrondi à 1 décimale, retourne un nombre
  }, []);

  const calculateAmount = useCallback((hours, hourlyRate) => {
    if (!hours || !hourlyRate) return 0;
    const amount = hours * hourlyRate;
    return Math.round(amount); // Retourne un entier arrondi
  }, []);

  // Calculs mémorisés pour le modal
  const calculatedHours = useMemo(() => {
    if (!manualEntryData.checkIn || !manualEntryData.checkOut) return 0;
    return calculateHours(manualEntryData.checkIn, manualEntryData.checkOut);
  }, [manualEntryData.checkIn, manualEntryData.checkOut, calculateHours]);

  const calculatedAmount = useMemo(() => {
    if (!calculatedHours || !selectedEmployee?.hourlyRate) return 0;
    return calculateAmount(calculatedHours, selectedEmployee.hourlyRate);
  }, [calculatedHours, selectedEmployee?.hourlyRate, calculateAmount]);

  const handleManualEntry = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...manualEntryData,
        checkIn: new Date(`${manualEntryData.date}T${manualEntryData.checkIn}`).toISOString(),
        checkOut: new Date(`${manualEntryData.date}T${manualEntryData.checkOut}`).toISOString(),
        date: new Date(manualEntryData.date).toISOString()
      };

      await axios.post('http://localhost:3000/api/attendances/manual-entry', data);

      setShowManualEntryModal(false);
      resetManualEntryForm();
      showNotification('Heures saisies avec succès!');
    } catch (error) {
      console.error('Erreur lors de la saisie manuelle:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const resetManualEntryForm = () => {
    setManualEntryData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '',
      checkOut: '',
      notes: ''
    });
  };

  const openManualEntryModal = (employee) => {
    setSelectedEmployee(employee);
    setManualEntryData({
      ...manualEntryData,
      employeeId: employee.id
    });
    setShowManualEntryModal(true);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Disparaît après 5 secondes
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
              <CreditCard className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Caissier
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/payments')}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Tous les paiements
              </button>
              <span className="text-sm text-gray-700">
                Caissier - {user?.company?.name}
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

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === 'error' ? '❌' : '✅'}
            </span>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Statistiques du Jour */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques du Jour</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard
                title="Paiements Effectués"
                value={stats.todayPayments}
                icon={CheckCircle}
                color="border-l-4 border-green-500"
                subtitle="Aujourd'hui"
              />
              <StatCard
                title="Montant du Jour"
                value={`${stats.todayAmount.toLocaleString()} FCFA`}
                icon={DollarSign}
                color="border-l-4 border-blue-500"
              />
              <StatCard
                title="En Attente"
                value={stats.pendingCount}
                icon={Clock}
                color="border-l-4 border-orange-500"
                subtitle="Bulletins"
              />
              <StatCard
                title="Montant Restant"
                value={`${stats.pendingAmount.toLocaleString()} FCFA`}
                icon={AlertCircle}
                color="border-l-4 border-red-500"
              />
              <StatCard
                title="Budget Restant"
                value={`${stats.budget.toLocaleString()} FCFA`}
                icon={DollarSign}
                color="border-l-4 border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bulletins en Attente */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 bg-orange-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Bulletins en Attente de Paiement
                </h3>
              </div>
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {pendingPayslips.slice(0, 10).map((payslip) => (
                  <li key={payslip.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {payslip.employee.firstName} {payslip.employee.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {payslip.payRunPeriod} • {payslip.employee.position}
                        </p>
                        <p className="text-sm font-medium text-orange-600 mt-1">
                          Restant: {payslip.remainingAmount.toLocaleString()} FCFA
                        </p>
                      </div>
                      <button
                        onClick={() => openPaymentModal(payslip)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Payer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {pendingPayslips.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
                  <p className="mt-2 text-gray-500">Tous les paiements sont à jour!</p>
                </div>
              )}
            </div>

            {/* Paiements du Jour */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 bg-green-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Paiements du Jour
                </h3>
              </div>
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {todayPayments.map((payment) => (
                  <li key={payment.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {payment.payslip.employee.firstName} {payment.payslip.employee.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.date).toLocaleTimeString('fr-FR')} • {payment.method}
                        </p>
                        <p className="text-sm font-medium text-green-600 mt-1">
                          {payment.amount.toLocaleString()} FCFA
                        </p>
                      </div>
                      <button
                        onClick={() => generateInvoice(payment.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                        title="Télécharger la facture"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Facture
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {todayPayments.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">Aucun paiement aujourd'hui.</p>
                </div>
              )}
            </div>
          </div>

          {/* Employés Honoraires */}
          {honoraireEmployees.length > 0 && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 bg-purple-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-purple-600" />
                  Employés Honoraires - Saisie des Heures
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Saisissez manuellement les heures travaillées pour calculer automatiquement le montant.
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {honoraireEmployees.map((employee) => (
                  <li key={employee.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {employee.position} • {employee.hourlyRate} FCFA/h
                        </p>
                      </div>
                      <button
                        onClick={() => openManualEntryModal(employee)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <Calculator className="h-4 w-4 mr-1" />
                        Saisir Heures
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions Rapides */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Actions Rapides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/payments')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center justify-center"
              >
                <FileText className="h-5 w-5 mr-2" />
                Tous les Paiements
              </button>
              <button
                onClick={() => navigate('/payruns')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center justify-center"
              >
                <Clock className="h-5 w-5 mr-2" />
                Cycles de Paie
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center justify-center"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Paiement */}
      {showPaymentModal && selectedPayslip && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Enregistrer un Paiement
              </h3>
              <div className="mb-4 bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Employé:</strong> {selectedPayslip.employee.firstName} {selectedPayslip.employee.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Période:</strong> {selectedPayslip.payRunPeriod}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Net à payer:</strong> {selectedPayslip.net.toLocaleString()} FCFA
                </p>
                <p className="text-sm font-medium text-orange-600">
                  <strong>Restant:</strong> {selectedPayslip.remainingAmount.toLocaleString()} FCFA
                </p>
              </div>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mode de paiement *</label>
                  <select
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={paymentData.method}
                    onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
                    required
                  >
                    <option value="ESPECES">Espèces</option>
                    <option value="VIREMENT">Virement bancaire</option>
                    <option value="ORANGE_MONEY">Orange Money</option>
                    <option value="WAVE">Wave</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPayslip(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                  >
                    Enregistrer le Paiement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Saisie Manuelle des Heures */}
      {showManualEntryModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calculator className="h-6 w-6 mr-2 text-purple-600" />
                Saisie Manuelle des Heures
              </h3>
              <div className="mb-4 bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Employé:</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Taux horaire:</strong> {selectedEmployee.hourlyRate} FCFA/h
                </p>
                {manualEntryData.checkIn && manualEntryData.checkOut && (
                  <div className="mt-2 p-2 bg-purple-50 rounded">
                    <p className="text-sm font-medium text-purple-800">
                      Heures travaillées: {calculatedHours.toFixed(1)}h
                    </p>
                    <p className="text-sm font-medium text-purple-800">
                      Montant estimé: {calculatedAmount.toLocaleString()} FCFA
                    </p>
                  </div>
                )}
              </div>
              <form onSubmit={handleManualEntry} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date *</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={manualEntryData.date}
                    onChange={(e) => setManualEntryData({...manualEntryData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Heure arrivée *</label>
                    <input
                      type="time"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={manualEntryData.checkIn}
                      onChange={(e) => setManualEntryData({...manualEntryData, checkIn: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Heure départ *</label>
                    <input
                      type="time"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={manualEntryData.checkOut}
                      onChange={(e) => setManualEntryData({...manualEntryData, checkOut: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    rows="2"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={manualEntryData.notes}
                    onChange={(e) => setManualEntryData({...manualEntryData, notes: e.target.value})}
                    placeholder="Notes optionnelles..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowManualEntryModal(false);
                      setSelectedEmployee(null);
                      resetManualEntryForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
                  >
                    Enregistrer les Heures
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
