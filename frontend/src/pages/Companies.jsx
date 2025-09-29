import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Users, UserPlus, ArrowLeft } from 'lucide-react';

const Companies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyEmployees, setCompanyEmployees] = useState([]);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CAISSIER'
  });
  const [employeeFormData, setEmployeeFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    contractType: 'FIXE',
    rate: '',
    bankDetails: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchCompanies();
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

  const validatePhone = (phone) => {
    // Format téléphone international ou local
    const phoneRegex = /^(\+?[1-9]\d{0,3})?[-.\s]?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/;
    return phoneRegex.test(phone) || phone === '';
  };

  const validateCompanyName = (name) => {
    // Au moins 2 caractères, lettres, chiffres, espaces, tirets
    const nameRegex = /^[A-Za-zÀ-ÿ0-9\s\-&]{2,}$/;
    return nameRegex.test(name);
  };

  const validateName = (name) => {
    return name.length >= 2;
  };

  const validatePosition = (position) => {
    return position.length >= 2;
  };

  const validateAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations avec regex
    if (!editingCompany) {
      if (!validateCompanyName(formData.name)) {
        alert('Le nom de l\'entreprise doit contenir au moins 2 caractères (lettres, chiffres, espaces, tirets autorisés)');
        return;
      }

      if (!validateEmail(formData.adminEmail)) {
        alert('Veuillez saisir une adresse email valide');
        return;
      }

      if (!validatePassword(formData.adminPassword)) {
        alert('Le mot de passe doit contenir au moins 6 caractères avec au moins une lettre et un chiffre');
        return;
      }

      if (formData.adminPassword !== formData.confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      alert('Veuillez saisir un numéro de téléphone valide');
      return;
    }

    if (formData.email && !validateEmail(formData.email)) {
      alert('Veuillez saisir une adresse email valide pour l\'entreprise');
      return;
    }

    try {
      if (editingCompany) {
        await axios.put(`http://localhost:3000/api/companies/${editingCompany.id}`, formData);
      } else {
        const response = await axios.post('http://localhost:3000/api/companies', formData);
        alert(`Entreprise créée avec succès !\nAdmin: ${response.data.admin.email}\nMot de passe: ${formData.adminPassword}`);
      }

      fetchCompanies();
      setShowModal(false);
      resetForm();
      setEditingCompany(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || '',
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || ''
    });
    setShowModal(true);
  };

  const handleViewCompanyDetails = async (company) => {
    setSelectedCompany(company);
    await loadCompanyData(company.id);
  };

  const handleBackToList = () => {
    setSelectedCompany(null);
    setCompanyEmployees([]);
    setCompanyUsers([]);
  };

  const loadCompanyData = async (companyId) => {
    try {
      // Charger les employés
      const employeesResponse = await axios.get(`http://localhost:3000/api/employees?companyId=${companyId}`);
      setCompanyEmployees(employeesResponse.data.employees || []);

      // Charger les utilisateurs
      const usersResponse = await axios.get(`http://localhost:3000/api/auth/users?companyId=${companyId}`);
      setCompanyUsers(usersResponse.data.users || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!validateEmail(userFormData.email)) {
      alert('Veuillez saisir une adresse email valide');
      return;
    }

    if (!validatePassword(userFormData.password)) {
      alert('Le mot de passe doit contenir au moins 6 caractères avec au moins une lettre et un chiffre');
      return;
    }

    if (userFormData.password !== userFormData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        email: userFormData.email,
        password: userFormData.password,
        role: userFormData.role,
        companyId: selectedCompany.id
      });

      await loadCompanyData(selectedCompany.id);
      setShowUserModal(false);
      setUserFormData({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CAISSIER'
      });
      alert('Utilisateur créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    if (!validateName(employeeFormData.firstName)) {
      alert('Le prénom doit contenir au moins 2 caractères');
      return;
    }

    if (!validateName(employeeFormData.lastName)) {
      alert('Le nom doit contenir au moins 2 caractères');
      return;
    }

    if (!validatePosition(employeeFormData.position)) {
      alert('Le poste doit contenir au moins 2 caractères');
      return;
    }

    if (!validateAmount(employeeFormData.rate)) {
      alert('Le salaire doit être un nombre positif valide');
      return;
    }

    try {
      const data = {
        ...employeeFormData,
        rate: parseFloat(employeeFormData.rate),
        companyId: selectedCompany.id
      };

      await axios.post('http://localhost:3000/api/employees', data);

      await loadCompanyData(selectedCompany.id);
      setShowEmployeeModal(false);
      setEmployeeFormData({
        firstName: '',
        lastName: '',
        position: '',
        contractType: 'FIXE',
        rate: '',
        bankDetails: ''
      });
      alert('Employé créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };




  const handleDelete = async (companyId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/companies/${companyId}`);
      fetchCompanies();
      alert('Entreprise supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur: ' + (error.response?.data?.error || error.message));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      adminEmail: '',
      adminPassword: '',
      confirmPassword: ''
    });
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
                Gestion des Entreprises
              </h1>
            </div>
            {user?.role === 'SUPER_ADMIN' && (
              <div className="flex items-center">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Nouvelle entreprise
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {selectedCompany ? (
            /* Vue détaillée d'une entreprise - Interface Admin complète */
            <div className="space-y-6">
              {/* Header avec bouton retour */}
              <div className="bg-white shadow px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={handleBackToList}
                      className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedCompany.name}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Interface d'administration complète
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        // Sauvegarder l'entreprise sélectionnée dans le localStorage
                        localStorage.setItem('selectedCompany', JSON.stringify({
                          id: selectedCompany.id,
                          name: selectedCompany.name
                        }));
                        // Naviguer vers le dashboard
                        navigate('/dashboard');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Voir le dashboard
                    </button>
                  </div>
                </div>
              </div>

              {/* Section Employés */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Employés ({companyEmployees.length})
                  </h3>
                  <button
                    onClick={() => setShowEmployeeModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter employé
                  </button>
                </div>
                <ul className="divide-y divide-gray-200">
                  {companyEmployees.map((employee) => (
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
                              {employee.position} • {employee.contractType} • {employee.rate.toLocaleString()} FCFA
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                {companyEmployees.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucun employé dans cette entreprise.</p>
                  </div>
                )}
              </div>

              {/* Section Utilisateurs */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Utilisateurs ({companyUsers.length})
                  </h3>
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Ajouter utilisateur
                  </button>
                </div>
                <ul className="divide-y divide-gray-200">
                  {companyUsers.map((user) => (
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
                {companyUsers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Aucun utilisateur dans cette entreprise.</p>
                  </div>
                )}
              </div>

              {/* Actions rapides */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Actions d'administration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Nouveau cycle de paie
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Générer bulletins
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Voir paiements
                    </button>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Statistiques
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Vue liste des entreprises */
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {companies.map((company) => (
                  <li key={company.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-blue-300 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-blue-700" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-medium text-gray-900">
                            {company.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {company.address}
                          </div>
                          <div className="text-sm text-gray-500">
                            {company.email} • {company.phone}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {company.users?.length || 0} utilisateurs • {company.employees?.length || 0} employés
                          </div>
                        </div>
                      </div>
                      {user?.role === 'SUPER_ADMIN' && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewCompanyDetails(company)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                          >
                            Détails
                          </button>
                          <button
                            onClick={() => handleEdit(company)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {companies.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune entreprise trouvée.</p>
                  {user?.role === 'SUPER_ADMIN' && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Créer la première entreprise
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal création entreprise */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCompany ? 'Modifier l\'entreprise' : 'Créer une nouvelle entreprise'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {!editingCompany && (
                  <>
                    <div className="border-t pt-4 mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Créer le compte Administrateur</h4>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email de l'Admin</label>
                      <input
                        type="email"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                        placeholder="admin@entreprise.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                      <input
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.adminPassword}
                        onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                        placeholder="Minimum 6 caractères"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                      <input
                        type="password"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        placeholder="Répéter le mot de passe"
                      />
                    </div>
                  </>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCompany(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    {editingCompany ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal création utilisateur */}
      {showUserModal && selectedCompany && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Créer un utilisateur pour {selectedCompany.name}
              </h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                    placeholder="utilisateur@entreprise.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
                  <input
                    type="password"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                    placeholder="Minimum 6 caractères"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe *</label>
                  <input
                    type="password"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={userFormData.confirmPassword}
                    onChange={(e) => setUserFormData({...userFormData, confirmPassword: e.target.value})}
                    placeholder="Répéter le mot de passe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rôle *</label>
                  <select
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                    required
                  >
                    <option value="ADMIN">Administrateur</option>
                    <option value="CAISSIER">Caissier</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserModal(false);
                      setUserFormData({
                        email: '',
                        password: '',
                        confirmPassword: '',
                        role: 'CAISSIER'
                      });
                    }}
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

      {/* Modal création employé */}
      {showEmployeeModal && selectedCompany && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ajouter un employé à {selectedCompany.name}
              </h3>
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prénom *</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={employeeFormData.firstName}
                      onChange={(e) => setEmployeeFormData({...employeeFormData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom *</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={employeeFormData.lastName}
                      onChange={(e) => setEmployeeFormData({...employeeFormData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Poste *</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    value={employeeFormData.position}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, position: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type de contrat *</label>
                    <select
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={employeeFormData.contractType}
                      onChange={(e) => setEmployeeFormData({...employeeFormData, contractType: e.target.value})}
                      required
                    >
                      <option value="FIXE">Fixe</option>
                      <option value="JOURNALIER">Journalier</option>
                      <option value="HONORAIRE">Honoraire</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salaire/Taux *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={employeeFormData.rate}
                      onChange={(e) => setEmployeeFormData({...employeeFormData, rate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Coordonnées bancaires</label>
                  <textarea
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    value={employeeFormData.bankDetails}
                    onChange={(e) => setEmployeeFormData({...employeeFormData, bankDetails: e.target.value})}
                    placeholder="IBAN, numéro de compte, etc."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmployeeModal(false);
                      setEmployeeFormData({
                        firstName: '',
                        lastName: '',
                        position: '',
                        contractType: 'FIXE',
                        rate: '',
                        bankDetails: ''
                      });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Ajouter
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

export default Companies;