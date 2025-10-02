import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Briefcase, CreditCard, ChevronDown, UserPlus, Users, Building2, ArrowLeft, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

const UserManagement = ({ companyId }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CAISSIER'
  });

  useEffect(() => {
    fetchUsers();
  }, [companyId]);

  // Fonctions de validation avec regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Au moins 6 caractères, au moins une lettre et un chiffre
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/auth/users?companyId=${companyId}`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation avec regex pour la création d'utilisateur
    if (!validateEmail(formData.email)) {
      showNotification('Veuillez saisir une adresse email valide', 'error');
      return;
    }

    if (!validatePassword(formData.password)) {
      showNotification('Le mot de passe doit contenir au moins 6 caractères avec au moins une lettre et un chiffre', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        companyId: companyId
      });

      fetchUsers();
      setShowModal(false);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CAISSIER'
      });
      showNotification('Utilisateur créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Gestion des Utilisateurs
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Nouveau Caissier
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user.email}
                </div>
                <div className="text-sm text-gray-500">
                  Rôle: {user.role}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Créé le {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden">
            {/* Header avec fond uni */}
            <div className="bg-blue-600 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <UserPlus className="h-6 w-6 mr-2" />
                Créer un nouveau Caissier
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Ajoutez un utilisateur pour gérer les paiements
              </p>
            </div>

            <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Section principale */}
                <div className="bg-white rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations du compte
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        <Users className="inline h-4 w-4 mr-2" />
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="caissier@entreprise.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          <Eye className="inline h-4 w-4 mr-2" />
                          Mot de passe <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Min. 6 caractères"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          <EyeOff className="inline h-4 w-4 mr-2" />
                          Confirmation <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            placeholder="Répéter le mot de passe"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations sur le rôle */}
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Rôle: Caissier</h4>
                      <p className="text-sm text-gray-600">
                        Ce compte aura accès uniquement à la gestion des paiements et à la génération des reçus.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({
                        email: '',
                        password: '',
                        confirmPassword: '',
                        role: 'CAISSIER'
                      });
                    }}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    ❌ Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Créer le caissier
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

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('employees');
  const [todayAttendances, setTodayAttendances] = useState({});
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    contractType: 'FIXE',
    rate: '',
    dailyRate: '',
    hourlyRate: '',
    bankDetails: '',
    companyId: user?.companyId || ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/employees');
      setEmployees(response.data.employees);
      // Fetch today's attendance for each employee
      const attendances = {};
      for (const employee of response.data.employees) {
        try {
          const attendanceRes = await axios.get(`http://localhost:3000/api/attendances/today?employeeId=${employee.id}`);
          attendances[employee.id] = attendanceRes.data;
        } catch (error) {
          // No attendance for today
          attendances[employee.id] = null;
        }
      }
      setTodayAttendances(attendances);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async (employeeId) => {
    try {
      await axios.post('http://localhost:3000/api/attendances/check-in', { employeeId });
      // Refresh attendance for this employee
      const attendanceRes = await axios.get(`http://localhost:3000/api/attendances/today?employeeId=${employeeId}`);
      setTodayAttendances(prev => ({ ...prev, [employeeId]: attendanceRes.data }));
      showNotification('Pointage arrivée effectué avec succès');
    } catch (error) {
      console.error('Erreur lors du pointage arrivée:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const handleClockOut = async (employeeId) => {
    try {
      await axios.post('http://localhost:3000/api/attendances/check-out', { employeeId });
      // Refresh attendance for this employee
      const attendanceRes = await axios.get(`http://localhost:3000/api/attendances/today?employeeId=${employeeId}`);
      setTodayAttendances(prev => ({ ...prev, [employeeId]: attendanceRes.data }));
      showNotification('Pointage départ effectué avec succès');
    } catch (error) {
      console.error('Erreur lors du pointage départ:', error);
      showNotification('Erreur: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  // Fonctions de validation avec regex
  const validateName = (name) => {
    // Lettres, espaces, apostrophes, tirets (noms français)
    const nameRegex = /^[A-Za-zÀ-ÿ\s\-']{2,}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Au moins 6 caractères, au moins une lettre et un chiffre
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const validateAmount = (amount) => {
    // Nombre positif avec décimales optionnelles
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const num = parseFloat(amount);
    return amountRegex.test(amount) && num > 0;
  };

  const validatePosition = (position) => {
    // Au moins 2 caractères, lettres, chiffres, espaces
    const positionRegex = /^[A-Za-zÀ-ÿ0-9\s\-&]{2,}$/;
    return positionRegex.test(position);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation du formulaire employé
    if (!validateName(formData.firstName)) {
      showNotification('Le prénom doit contenir au moins 2 caractères (lettres, espaces, apostrophes, tirets autorisés)', 'error');
      return;
    }

    if (!validateName(formData.lastName)) {
      showNotification('Le nom doit contenir au moins 2 caractères (lettres, espaces, apostrophes, tirets autorisés)', 'error');
      return;
    }

    if (!validatePosition(formData.position)) {
      showNotification('Le poste doit contenir au moins 2 caractères', 'error');
      return;
    }

    // Validation selon le type de contrat
    if (formData.contractType === 'FIXE' && !validateAmount(formData.rate)) {
      showNotification('Le salaire mensuel doit être un nombre positif valide', 'error');
      return;
    }

    if (formData.contractType === 'JOURNALIER' && !validateAmount(formData.dailyRate)) {
      showNotification('Le taux journalier doit être un nombre positif valide', 'error');
      return;
    }

    if (formData.contractType === 'HONORAIRE' && !validateAmount(formData.hourlyRate)) {
      showNotification('Le taux horaire doit être un nombre positif valide', 'error');
      return;
    }

    try {
      let data = {
        ...formData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        contractType: formData.contractType,
        bankDetails: formData.bankDetails,
        companyId: formData.companyId
      };

      // Ajouter les champs de salaire selon le type de contrat
      if (formData.contractType === 'FIXE') {
        data.rate = parseFloat(formData.rate);
        data.dailyRate = null;
        data.hourlyRate = null;
      } else if (formData.contractType === 'JOURNALIER') {
        data.rate = 0; // Pas utilisé pour journalier
        data.dailyRate = parseFloat(formData.dailyRate);
        data.hourlyRate = null;
      } else if (formData.contractType === 'HONORAIRE') {
        data.rate = 0; // Pas utilisé pour honoraire
        data.dailyRate = null;
        data.hourlyRate = parseFloat(formData.hourlyRate);
      }

      console.log('Données envoyées:', data);

      if (editingEmployee) {
        await axios.put(`http://localhost:3000/api/employees/${editingEmployee.id}`, data);
      } else {
        await axios.post('http://localhost:3000/api/employees', data);
      }

      fetchEmployees();
      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error.response?.data || error.message);
      showNotification('Erreur lors de la sauvegarde: ' + (error.response?.data?.error || error.message), 'error');
    }
  };
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      contractType: employee.contractType,
      rate: employee.rate.toString(),
      dailyRate: employee.dailyRate?.toString() || '',
      hourlyRate: employee.hourlyRate?.toString() || '',
      bankDetails: employee.bankDetails || '',
      companyId: employee.companyId
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir changer le statut de cet employé ?')) {
      try {
        await axios.patch(`http://localhost:3000/api/employees/${id}/toggle-status`);
        fetchEmployees();
      } catch (error) {
        console.error('Erreur lors du changement de statut:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      position: '',
      contractType: 'FIXE',
      rate: '',
      dailyRate: '',
      hourlyRate: '',
      bankDetails: '',
      companyId: user?.companyId || ''
    });
  };

  const openModal = () => {
    setEditingEmployee(null);
    resetForm();
    setShowModal(true);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Disparaît après 5 secondes
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
                Gestion RH
              </h1>
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

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'employees'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Employés
              </button>
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Utilisateurs
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'employees' ? (
            <>
              {/* Bouton ajouter employé */}
              <div className="mb-4 flex justify-end">
                <button
                  onClick={openModal}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Ajouter un employé
                </button>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <li key={employee.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {employee.firstName[0]}{employee.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.position} • {employee.contractType} • {
                                employee.contractType === 'FIXE' ? `${employee.rate.toLocaleString()} FCFA/mois` :
                                employee.contractType === 'JOURNALIER' ? `${employee.dailyRate?.toLocaleString() || 0} FCFA/jour` :
                                `${employee.hourlyRate?.toLocaleString() || 0} FCFA/heure`
                              }
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            employee.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.isActive ? 'Actif' : 'Inactif'}
                          </span>

                          {/* Clock buttons - Seulement pour ADMIN et SUPER_ADMIN, pas pour CAISSIER */}
                          {employee.isActive && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                            <div className="flex items-center space-x-1">
                              {todayAttendances[employee.id]?.checkIn ? (
                                todayAttendances[employee.id]?.checkOut ? (
                                  <span className="text-green-600 text-xs font-medium px-2 py-1 bg-green-100 rounded">
                                    Pointage complet ({todayAttendances[employee.id]?.hoursWorked?.toFixed(1)}h)
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleClockOut(employee.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                                    title="Pointer le départ"
                                  >
                                    Départ
                                  </button>
                                )
                              ) : (
                                <button
                                  onClick={() => handleClockIn(employee.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                                  title="Pointer l'arrivée"
                                >
                                  Arrivée
                                </button>
                              )}
                            </div>
                          )}

                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleToggleStatus(employee.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            {employee.isActive ? 'Désactiver' : 'Activer'}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {employees.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucun employé trouvé.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <UserManagement companyId={user?.companyId} />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden">
            {/* Header avec fond uni */}
            <div className="bg-blue-600 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                {editingEmployee ? (
                  <>
                    <Edit className="h-6 w-6 mr-2" />
                    Modifier l'employé
                  </>
                ) : (
                  <>
                    <UserPlus className="h-6 w-6 mr-2" />
                    Ajouter un employé
                  </>
                )}
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {editingEmployee ? 'Mettez à jour les informations' : 'Ajoutez un nouveau membre à votre équipe'}
              </p>
            </div>

            <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Informations personnelles */}
                <div className="bg-white rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations personnelles
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          placeholder="Jean"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          placeholder="Dupont"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations professionnelles */}
                <div className="bg-white rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Informations professionnelles
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        <Building2 className="inline h-4 w-4 mr-2" />
                        Poste <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          placeholder="Développeur Full Stack"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          <ChevronDown className="inline h-4 w-4 mr-2" />
                          Type de contrat <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                            value={formData.contractType}
                            onChange={(e) => setFormData({...formData, contractType: e.target.value})}
                          >
                            <option value="FIXE">Fixe (Salaire mensuel)</option>
                            <option value="JOURNALIER">Journalier (Taux journalier)</option>
                            <option value="HONORAIRE">Honoraire (Taux horaire)</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Champs de salaire selon le type de contrat */}
                      {formData.contractType === 'FIXE' && (
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-800">
                            <CreditCard className="inline h-4 w-4 mr-2" />
                            Salaire mensuel (FCFA) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                              value={formData.rate}
                              onChange={(e) => setFormData({...formData, rate: e.target.value})}
                              placeholder="150000"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Salaire fixe mensuel, indépendant des pointages</p>
                        </div>
                      )}

                      {formData.contractType === 'JOURNALIER' && (
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-800">
                            <CreditCard className="inline h-4 w-4 mr-2" />
                            Taux journalier (FCFA) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                              value={formData.dailyRate}
                              onChange={(e) => setFormData({...formData, dailyRate: e.target.value})}
                              placeholder="25000"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Salaire = jours travaillés × taux journalier (nécessite pointages)</p>
                        </div>
                      )}

                      {formData.contractType === 'HONORAIRE' && (
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-800">
                            <CreditCard className="inline h-4 w-4 mr-2" />
                            Taux horaire (FCFA) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                              value={formData.hourlyRate}
                              onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                              placeholder="5000"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Salaire = heures travaillées × taux horaire (nécessite pointages)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations bancaires */}
                <div className="bg-white rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Coordonnées bancaires
                  </h4>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      <Eye className="inline h-4 w-4 mr-2" />
                      Détails bancaires
                    </label>
                    <div className="relative">
                      <textarea
                        className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                        rows="2"
                        value={formData.bankDetails}
                        onChange={(e) => setFormData({...formData, bankDetails: e.target.value})}
                        placeholder="IBAN: CI12 3456 7890 1234 5678 9012 345&#10;Banque: Ecobank&#10;Titulaire: Jean Dupont"
                      />
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    ❌ Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {editingEmployee ? (
                      <>
                        <Edit className="h-5 w-5 mr-2" />
                        Modifier
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5 mr-2" />
                        Ajouter l'employé
                      </>
                    )}
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

export default Employees;