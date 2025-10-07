import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Calendar, Clock, Users, CheckCircle, XCircle, Coffee, AlertCircle, Plus, Filter, Calculator } from 'lucide-react';

const Attendances = () => {
  const { user, companyColor } = useAuth();
  const [attendances, setAttendances] = useState([]);

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
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    status: ''
  });
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: 'PRESENT',
    notes: ''
  });
  const [manualEntryData, setManualEntryData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    notes: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchAttendances();
    fetchStats();
  }, [filters]);

  const fetchEmployees = async () => {
    try {
      const companyId = user?.role === 'SUPER_ADMIN' ? '' : user?.companyId;
      const response = await axios.get(`http://localhost:3000/api/employees${companyId ? `?companyId=${companyId}` : ''}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmployees(response.data.employees.filter(e => e.isActive)); // Inclure tous les employés actifs
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    }
  };

  const fetchAttendances = async () => {
    try {
      const companyId = user?.role === 'SUPER_ADMIN' ? '' : user?.companyId;
      const params = new URLSearchParams();

      if (companyId) params.append('companyId', companyId);
      if (filters.employeeId) params.append('employeeId', filters.employeeId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`http://localhost:3000/api/attendances?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAttendances(response.data.attendances);
    } catch (error) {
      console.error('Erreur lors du chargement des pointages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const companyId = user?.role === 'SUPER_ADMIN' ? '' : user?.companyId;
      const params = new URLSearchParams();

      if (companyId) params.append('companyId', companyId);
      if (filters.employeeId) params.append('employeeId', filters.employeeId);

      const response = await axios.get(`http://localhost:3000/api/attendances/stats?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      await axios.post('http://localhost:3000/api/attendances/check-in', {
        employeeId,
        date: new Date().toISOString()
      });

      fetchAttendances();
      fetchStats();
      setShowCheckInModal(false);
      alert('Arrivée pointée avec succès!');
    } catch (error) {
      console.error('Erreur lors du pointage:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      await axios.post('http://localhost:3000/api/attendances/check-out', {
        employeeId,
        date: new Date().toISOString()
      });

      fetchAttendances();
      fetchStats();
      alert('Départ pointé avec succès!');
    } catch (error) {
      console.error('Erreur lors du pointage:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        checkIn: formData.checkIn ? new Date(`${formData.date}T${formData.checkIn}`).toISOString() : undefined,
        checkOut: formData.checkOut ? new Date(`${formData.date}T${formData.checkOut}`).toISOString() : undefined,
        date: new Date(formData.date).toISOString()
      };

      await axios.post('http://localhost:3000/api/attendances', data);

      fetchAttendances();
      fetchStats();
      setShowModal(false);
      resetForm();
      alert('Pointage créé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

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

      fetchAttendances();
      fetchStats();
      setShowManualEntryModal(false);
      resetManualEntryForm();
      alert('Heures saisies avec succès!');
    } catch (error) {
      console.error('Erreur lors de la saisie manuelle:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '',
      checkOut: '',
      status: 'PRESENT',
      notes: ''
    });
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

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diffMs = new Date(`2000-01-01T${checkOut}`) - new Date(`2000-01-01T${checkIn}`);
    return (diffMs / (1000 * 60 * 60)).toFixed(1);
  };

  const calculateAmount = (hours, hourlyRate) => {
    if (!hours || !hourlyRate) return 0;
    return (parseFloat(hours) * hourlyRate).toFixed(0);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'ABSENT': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'CONGE': return <Coffee className="h-5 w-5 text-blue-600" />;
      case 'MALADIE': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800';
      case 'ABSENT': return 'bg-red-100 text-red-800';
      case 'CONGE': return 'bg-blue-100 text-blue-800';
      case 'MALADIE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PRESENT': return 'Présent';
      case 'ABSENT': return 'Absent';
      case 'CONGE': return 'Congé';
      case 'MALADIE': return 'Maladie';
      default: return status;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const honoraireEmployees = employees.filter(emp => emp.contractType === 'HONORAIRE');
  const canAccessManualEntry = user?.role === 'SUPER_ADMIN' || user?.role === 'CAISSIER';

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
              <Clock className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion des Pointages
              </h1>
            </div>
            {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCheckInModal(true)}
                  className={`${primaryBgClass} ${primaryHoverBgClass} text-white px-4 py-2 rounded-md text-sm font-medium flex items-center`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pointage Rapide
                </button>
                {honoraireEmployees.length > 0 && (
                  <button
                    onClick={() => setShowManualEntryModal(true)}
                    className={`${primaryBgClass} ${primaryHoverBgClass} text-white px-4 py-2 rounded-md text-sm font-medium flex items-center`}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Saisie Manuelle
                  </button>
                )}
                <button
                  onClick={() => setShowModal(true)}
                  className={`${primaryBgClass} ${primaryHoverBgClass} text-white px-4 py-2 rounded-md text-sm font-medium flex items-center`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Pointage
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filtres */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtres</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <input
                  type="date"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">Tous les statuts</option>
                  <option value="PRESENT">Présent</option>
                  <option value="ABSENT">Absent</option>
                  <option value="CONGE">Congé</option>
                  <option value="MALADIE">Maladie</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Jours</p>
                    <p className="text-2xl font-bold">{stats.totalDays}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Liste des pointages */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {attendances.map((attendance) => (
                <li key={attendance.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="flex-shrink-0">
                        {getStatusIcon(attendance.status)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {attendance.employee.firstName} {attendance.employee.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {attendance.employee.position} • {attendance.employee.contractType}
                            </p>
                          </div>
                          <div className="text-right mr-4">
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(attendance.date)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatTime(attendance.checkIn)} - {formatTime(attendance.checkOut)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {attendance.hoursWorked > 0 && (
                        <span className="text-sm font-medium text-gray-700">
                          {attendance.hoursWorked.toFixed(1)}h
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}>
                        {getStatusText(attendance.status)}
                      </span>
                    </div>
                  </div>
                  {attendance.notes && (
                    <div className="mt-2 ml-9">
                      <p className="text-sm text-gray-600 italic">Note: {attendance.notes}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {attendances.length === 0 && (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Aucun pointage trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Pointage Rapide */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-indigo-600" />
                Pointage Rapide
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sélectionner un employé
                  </label>
                  <select
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedEmployee || ''}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">-- Choisir --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.contractType})
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`${primaryBgLightClass} p-4 rounded-md text-center`}>
                  <Clock className={`h-12 w-12 mx-auto ${primaryTextColorClass} mb-2`} />
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date().toLocaleTimeString('fr-FR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => selectedEmployee && handleCheckIn(selectedEmployee)}
                    disabled={!selectedEmployee}
                    className={`${primaryBgClass} ${primaryHoverBgClass} disabled:bg-gray-300 text-white px-4 py-3 rounded-md text-sm font-medium flex items-center justify-center`}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Arrivée
                  </button>
                  <button
                    onClick={() => selectedEmployee && handleCheckOut(selectedEmployee)}
                    disabled={!selectedEmployee}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-md text-sm font-medium flex items-center justify-center"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Départ
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setShowCheckInModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouveau Pointage */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-md bg-white/30 p-6 rounded-lg">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Créer un pointage
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employé *</label>
                  <select
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  >
                    <option value="">-- Sélectionner --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date *</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Heure arrivée</label>
                    <input
                      type="time"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Heure départ</label>
                    <input
                      type="time"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut *</label>
                  <select
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="PRESENT">Présent</option>
                    <option value="ABSENT">Absent</option>
                    <option value="CONGE">Congé</option>
                    <option value="MALADIE">Maladie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    rows="2"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Notes optionnelles..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-sm font-medium text-white ${primaryBgClass} ${primaryHoverBgClass} border border-transparent rounded-md`}
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

export default Attendances;
