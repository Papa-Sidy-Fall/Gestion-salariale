import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Calendar, Trash2 } from 'lucide-react';

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

const PayRuns = () => {
  const { user } = useAuth();
  const [payRuns, setPayRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayRun, setSelectedPayRun] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    period: new Date().toISOString().slice(0, 7), // YYYY-MM format
    fixedEmployeePaymentOption: 'FULL_MONTH' // Nouvelle option par défaut
  });

  useEffect(() => {
    fetchPayRuns();
  }, []);

  const fetchPayRuns = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/payruns');
      setPayRuns(response.data.payRuns);
    } catch (error) {
      console.error('Erreur lors du chargement des cycles de paie:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de validation pour la période
  const validatePeriod = (period) => {
    // Format YYYY-MM
    const periodRegex = /^\d{4}-\d{2}$/;
    if (!periodRegex.test(period)) return false;

    const [year, month] = period.split('-').map(Number);
    // Vérifier que le mois est entre 01 et 12
    return month >= 1 && month <= 12 && year >= 2000 && year <= 2100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de la période
    if (!validatePeriod(formData.period)) {
      showNotification('Veuillez saisir une période valide au format YYYY-MM (ex: 2024-01)', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/payruns', {
        ...formData,
        companyId: user?.companyId,
        fixedEmployeePaymentOption: formData.fixedEmployeePaymentOption // Envoyer la nouvelle option
      });

      fetchPayRuns();
      setShowModal(false);
      resetForm();
      showNotification('Cycle de paie créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const handleGeneratePayslips = async (payRunId) => {
    showNotification('Génération des bulletins en cours...', 'info');
    try {
      await axios.post(`http://localhost:3000/api/payruns/${payRunId}/generate-payslips`);
      fetchPayRuns();
      showNotification('Bulletins générés avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const handleApprove = async (payRunId) => {
    showNotification('Approbation du cycle en cours...', 'info');
    try {
      await axios.post(`http://localhost:3000/api/payruns/${payRunId}/approve`);
      fetchPayRuns();
      showNotification('Cycle approuvé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const handleClose = async (payRunId) => {
    showNotification('Clôture du cycle en cours...', 'info');
    try {
      await axios.post(`http://localhost:3000/api/payruns/${payRunId}/close`);
      fetchPayRuns();
      showNotification('Cycle clôturé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la clôture:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      period: new Date().toISOString().slice(0, 7)
    });
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Disparaît après 5 secondes
  };

  const handleDelete = async (payRunId, status) => {
    const isClosed = status === 'CLOTURE';
    const message = isClosed
      ? '⚠️ ATTENTION: Vous allez supprimer un cycle CLÔTURÉ. Cette action est IRRÉVERSIBLE et peut affecter les données comptables. Le budget sera remboursé automatiquement.'
      : 'Êtes-vous sûr de vouloir supprimer ce cycle de paie ? Cette action est irréversible.';

    showNotification(message, 'info'); // Remplacer confirm par une notification

    try {
      await axios.delete(`http://localhost:3000/api/payruns/${payRunId}`);
      fetchPayRuns();
      showNotification('Cycle de paie supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'BROUILLON': return 'bg-yellow-100 text-yellow-800';
      case 'APPROUVE': return 'bg-blue-100 text-blue-800';
      case 'CLOTURE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'BROUILLON': return 'Brouillon';
      case 'APPROUVE': return 'Approuvé';
      case 'CLOTURE': return 'Clôturé';
      default: return status;
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
                Cycles de paie
              </h1>
            </div>
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <div className="flex items-center">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Nouveau cycle
                </button>
              </div>
            )}
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
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {payRuns.map((payRun) => (
                <li key={payRun.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-gray-700" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Période: {payRun.period}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payRun.company?.name} • {payRun.payslips?.length || 0} bulletins
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payRun.status)}`}>
                        {getStatusText(payRun.status)}
                      </span>
                      <div className="flex space-x-2">
                        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && payRun.status === 'BROUILLON' && (
                          <>
                            <button
                              onClick={() => handleGeneratePayslips(payRun.id)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              Générer bulletins
                            </button>
                            <button
                              onClick={() => handleApprove(payRun.id)}
                              className="text-green-600 hover:text-green-900 text-sm font-medium"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => handleDelete(payRun.id, payRun.status)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Supprimer
                            </button>
                          </>
                        )}
                        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && payRun.status === 'APPROUVE' && (
                          <button
                            onClick={() => handleClose(payRun.id)}
                            className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                          >
                            Clôturer
                          </button>
                        )}
                        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && payRun.status === 'CLOTURE' && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500 text-sm">Terminé</span>
                            <button
                              onClick={() => handleDelete(payRun.id, payRun.status)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
                              title="Supprimer ce cycle clôturé"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {payRun.payslips && payRun.payslips.length > 0 && (
                    <div className="mt-4 ml-14">
                      <div className="text-sm text-gray-600">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {payRun.payslips.slice(0, 3).map((payslip) => (
                            <div key={payslip.id} className="bg-gray-50 p-2 rounded text-xs">
                              {payslip.employee.firstName} {payslip.employee.lastName}: {payslip.net.toLocaleString()} FCFA
                            </div>
                          ))}
                          {payRun.payslips.length > 3 && (
                            <div className="bg-gray-50 p-2 rounded text-xs text-gray-500">
                              +{payRun.payslips.length - 3} autres...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {payRuns.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun cycle de paie trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden">
            {/* Header avec fond uni */}
            <div className={`${getTailwindColorClass(user?.company?.color || '#6FA4AF', 'bg')} px-6 py-4 rounded-t-2xl`}>
              <h3 className="text-xl font-bold text-white flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                Créer un nouveau cycle de paie
              </h3>
              <p className={`${getTailwindColorClass(user?.company?.color || '#6FA4AF', 'text-strong')} text-sm mt-1`}>
                Définissez la période pour générer les bulletins de salaire
              </p>
            </div>

            <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Section principale */}
                <div className="bg-white rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Configuration du cycle
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        Période (YYYY-MM) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="month"
                          className={`w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getTailwindColorClass(user?.company?.color || '#6FA4AF', 'focus-border')} ${getTailwindColorClass(user?.company?.color || '#6FA4AF', 'focus-ring')} transition-all duration-200 bg-gray-50 focus:bg-white`}
                          value={formData.period}
                          onChange={(e) => setFormData({...formData, period: e.target.value})}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Sélectionnez le mois pour lequel vous souhaitez créer les bulletins</p>
                    </div>

                    {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Option de paiement employés fixes <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className={`w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl ${getTailwindColorClass(user?.company?.color || '#6FA4AF', 'focus-border')} ${getTailwindColorClass(user?.company?.color || '#6FA4AF', 'focus-ring')} transition-all duration-200 bg-gray-50 focus:bg-white`}
                            value={formData.fixedEmployeePaymentOption}
                            onChange={(e) => setFormData({...formData, fixedEmployeePaymentOption: e.target.value})}
                          >
                            <option value="FULL_MONTH">Payer le mois complet</option>
                            <option value="DAYS_WORKED">Payer uniquement les jours travaillés</option>
                          </select>
                        </div>
                        <p className="text-xs text-gray-500">Décidez comment payer les employés à salaire fixe pour ce cycle.</p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    ❌ Annuler
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-3 text-sm font-semibold text-white ${getTailwindColorClass(user?.company?.color || '#6FA4AF', 'bg')} ${getTailwindColorClass(user?.company?.color || '#6FA4AF', 'hoverBg')} rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Créer le cycle
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

export default PayRuns;
