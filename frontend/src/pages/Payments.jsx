import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { DollarSign, Check } from 'lucide-react';

const Payments = () => {
  const { user, companyColor } = useAuth();
  const [payments, setPayments] = useState([]);

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
    return '';
  };

  const primaryColor = companyColor || '#6FA4AF';
  const primaryBgClass = getTailwindColorClass(primaryColor, 'bg');
  const primaryHoverBgClass = getTailwindColorClass(primaryColor, 'hoverBg');
  const primaryTextColorClass = getTailwindColorClass(primaryColor, 'text');
  const primaryBorderColorClass = getTailwindColorClass(primaryColor, 'border');
  const primaryBgLightClass = getTailwindColorClass(primaryColor, 'bg-light');
  const primaryBorderLightClass = getTailwindColorClass(primaryColor, 'border-light');
  const primaryFocusBorderClass = getTailwindColorClass(primaryColor, 'focus-border');
  const primaryFocusRingClass = getTailwindColorClass(primaryColor, 'focus-ring');
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    method: 'ESPECES'
  });

  useEffect(() => {
    fetchPayments();
    fetchPendingPayslips();
  }, []);

  const fetchPayments = async () => {
    try {
      // Déterminer l'entreprise à utiliser selon le rôle
      let companyIdParam = '';
      if (user?.role === 'SUPER_ADMIN') {
        // Pour Super Admin, on peut voir tous les paiements ou filtrer par entreprise sélectionnée
        // Pour l'instant, on voit tous les paiements
        companyIdParam = '';
      } else if (user?.role !== 'SUPER_ADMIN') {
        // Pour Admin et Caissier, filtrer par leur entreprise
        companyIdParam = user?.companyId || '';
      }

      const url = companyIdParam
        ? `http://localhost:3000/api/payments/company/${companyIdParam}`
        : 'http://localhost:3000/api/payments';

      const response = await axios.get(url);
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    }
  };

  const fetchPendingPayslips = async () => {
    try {
      // Déterminer l'entreprise à utiliser selon le rôle
      let companyIdParam = '';
      if (user?.role === 'SUPER_ADMIN') {
        // Pour Super Admin, on peut voir tous les bulletins ou filtrer par entreprise sélectionnée
        // Pour l'instant, on voit tous les bulletins
        companyIdParam = '';
      } else if (user?.role !== 'SUPER_ADMIN') {
        // Pour Admin et Caissier, filtrer par leur entreprise
        companyIdParam = user?.companyId || '';
      }

      // Récupérer tous les cycles de paie pour trouver les bulletins en attente
      const url = companyIdParam
        ? `http://localhost:3000/api/payruns?companyId=${companyIdParam}`
        : 'http://localhost:3000/api/payruns';

      const payRunsResponse = await axios.get(url);
      const payRuns = payRunsResponse.data.payRuns;

      // Extraire tous les bulletins des cycles approuvés
      const allPayslips = [];
      payRuns.forEach(payRun => {
        if (payRun.payslips) {
          payRun.payslips.forEach(payslip => {
            if (payslip.status !== 'PAYE') {
              allPayslips.push({
                ...payslip,
                payRunPeriod: payRun.period,
                companyName: payRun.company?.name
              });
            }
          });
        }
      });

      setPayslips(allPayslips);
    } catch (error) {
      console.error('Erreur lors du chargement des bulletins:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de validation pour le montant
  const validateAmount = (amount) => {
    // Nombre positif avec décimales optionnelles
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const num = parseFloat(amount);
    return amountRegex.test(amount) && num > 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Validation du montant avec regex
    if (!validateAmount(formData.amount)) {
      alert('Veuillez saisir un montant valide (nombre positif avec maximum 2 décimales)');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/payments', {
        payslipId: selectedPayslip.id,
        amount: parseFloat(formData.amount),
        method: formData.method
      });

      fetchPayments();
      fetchPendingPayslips();
      setShowModal(false);
      setSelectedPayslip(null);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      method: 'ESPECES'
    });
  };

  const openPaymentModal = (payslip) => {
    setSelectedPayslip(payslip);
    // Calculer le montant restant à payer
    const totalPaid = payslip.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const remainingAmount = payslip.net - totalPaid;

    setFormData({
      amount: remainingAmount.toString(),
      method: 'ESPECES'
    });
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'PARTIEL': return 'bg-blue-100 text-blue-800';
      case 'PAYE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return 'En attente';
      case 'PARTIEL': return 'Partiel';
      case 'PAYE': return 'Payé';
      default: return status;
    }
  };

  const getMethodText = (method) => {
    switch (method) {
      case 'ESPECES': return 'Espèces';
      case 'VIREMENT': return 'Virement';
      case 'ORANGE_MONEY': return 'Orange Money';
      case 'WAVE': return 'Wave';
      default: return method;
    }
  };

  const generateInvoicePDF = async (paymentId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/payments/${paymentId}/invoice`, {
        responseType: 'blob' // Important pour recevoir le PDF en blob
      });

      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture-${paymentId.slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      alert('Erreur lors du téléchargement de la facture');
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion des paiements
              </h1>
            </div>
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'CAISSIER') && (
              <div className="flex items-center">
                <button
                  onClick={() => setShowModal(true)}
                  className={`${primaryBgClass} ${primaryHoverBgClass} text-white px-4 py-2 rounded-md text-sm font-medium`}
                >
                  Nouveau paiement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bulletins en attente de paiement */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Bulletins en attente de paiement
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {payslips.map((payslip) => {
                  const totalPaid = payslip.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
                  const remainingAmount = payslip.net - totalPaid;

                  return (
                    <li key={payslip.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-gray-700" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {payslip.employee.firstName} {payslip.employee.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payslip.payRunPeriod} • {payslip.companyName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Restant: {remainingAmount.toLocaleString()} FCFA
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payslip.status)}`}>
                            {getStatusText(payslip.status)}
                          </span>
                          <button
                            onClick={() => openPaymentModal(payslip)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                          >
                            Payer
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {payslips.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun bulletin en attente de paiement.</p>
                </div>
              )}
            </div>

            {/* Historique des paiements */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Historique des paiements
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {payments.slice(0, 10).map((payment) => (
                  <li key={payment.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-green-300 flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-700" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.payslip.employee.firstName} {payment.payslip.employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString()} • {getMethodText(payment.method)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.amount.toLocaleString()} FCFA
                        </div>
                        <button
                          onClick={() => generateInvoicePDF(payment.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                          title="Télécharger la facture PDF"
                        >
                          📄 Facture
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {payments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun paiement enregistré.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de paiement */}
      {showModal && selectedPayslip && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 p-6 rounded-lg bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Enregistrer un paiement
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Employé:</strong> {selectedPayslip.employee.firstName} {selectedPayslip.employee.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Montant net:</strong> {selectedPayslip.net.toLocaleString()} FCFA
                </p>
                {selectedPayslip.payments && selectedPayslip.payments.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <strong>Déjà payé:</strong> {selectedPayslip.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} FCFA
                  </p>
                )}
              </div>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant</label>
                  <input
                    type="number"
                    step="0.01"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${primaryFocusBorderClass} ${primaryFocusRingClass}`}
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mode de paiement</label>
                  <select
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${primaryFocusBorderClass} ${primaryFocusRingClass}`}
                    value={formData.method}
                    onChange={(e) => setFormData({...formData, method: e.target.value})}
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
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-sm font-medium text-white ${primaryBgClass} ${primaryHoverBgClass} border border-transparent rounded-md`}
                  >
                    Enregistrer
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

export default Payments;
