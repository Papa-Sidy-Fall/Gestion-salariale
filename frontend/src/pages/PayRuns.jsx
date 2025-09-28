import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PayRuns = () => {
  const { user } = useAuth();
  const [payRuns, setPayRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayRun, setSelectedPayRun] = useState(null);
  const [formData, setFormData] = useState({
    period: new Date().toISOString().slice(0, 7) // YYYY-MM format
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/payruns', {
        ...formData,
        companyId: user?.companyId
      });

      fetchPayRuns();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleGeneratePayslips = async (payRunId) => {
    if (!confirm('Êtes-vous sûr de vouloir générer les bulletins pour ce cycle ?')) return;

    try {
      await axios.post(`http://localhost:3000/api/payruns/${payRunId}/generate-payslips`);
      fetchPayRuns();
      alert('Bulletins générés avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleApprove = async (payRunId) => {
    if (!confirm('Êtes-vous sûr de vouloir approuver ce cycle de paie ?')) return;

    try {
      await axios.post(`http://localhost:3000/api/payruns/${payRunId}/approve`);
      fetchPayRuns();
      alert('Cycle approuvé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleClose = async (payRunId) => {
    if (!confirm('Êtes-vous sûr de vouloir clôturer ce cycle de paie ?')) return;

    try {
      await axios.post(`http://localhost:3000/api/payruns/${payRunId}/close`);
      fetchPayRuns();
      alert('Cycle clôturé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la clôture:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      period: new Date().toISOString().slice(0, 7)
    });
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
            <div className="flex items-center">
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Nouveau cycle
              </button>
            </div>
          </div>
        </div>
      </div>

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
                          <span className="text-sm font-medium text-gray-700">
                            📅
                          </span>
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
                        {payRun.status === 'BROUILLON' && (
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
                          </>
                        )}
                        {payRun.status === 'APPROUVE' && (
                          <button
                            onClick={() => handleClose(payRun.id)}
                            className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                          >
                            Clôturer
                          </button>
                        )}
                        {payRun.status === 'CLOTURE' && (
                          <span className="text-gray-500 text-sm">Terminé</span>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Créer un nouveau cycle de paie
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Période (YYYY-MM)</label>
                  <input
                    type="month"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                  />
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
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Créer
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