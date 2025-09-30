import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Users, UserPlus, ArrowLeft, User, Briefcase, CreditCard, ChevronDown, Edit, Trash2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

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
    logo: null,
    color: '#6FA4AF',
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
      let companyData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        color: formData.color,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        confirmPassword: formData.confirmPassword
      };

      let company;
      if (editingCompany) {
        company = await axios.put(`http://localhost:3000/api/companies/${editingCompany.id}`, companyData);
      } else {
        const response = await axios.post('http://localhost:3000/api/companies', companyData);
        company = response.data.company;
        alert(`Entreprise créée avec succès !\nAdmin: ${response.data.admin.email}\nMot de passe: ${formData.adminPassword}`);
      }

      // Upload du logo si un fichier a été sélectionné
      if (formData.logo && company) {
        const formDataLogo = new FormData();
        formDataLogo.append('logo', formData.logo);

        try {
          await axios.put(`http://localhost:3000/api/companies/${company.id || editingCompany.id}/logo`, formDataLogo, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } catch (logoError) {
          console.error('Erreur lors de l\'upload du logo:', logoError);
          alert('Entreprise créée mais erreur lors de l\'upload du logo');
        }
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
      email: company.email || '',
      logo: null, // Le logo ne peut être modifié que par upload séparé
      color: company.color || '#6FA4AF'
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
      logo: null,
      color: '#6FA4AF',
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
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden">
            {/* Header avec fond uni */}
            <div className="bg-blue-600 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                {editingCompany ? (
                  <>
                    <Edit className="h-6 w-6 mr-2" />
                    Modifier l'entreprise
                  </>
                ) : (
                  <>
                    <Building2 className="h-6 w-6 mr-2" />
                    Créer une nouvelle entreprise
                  </>
                )}
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {editingCompany ? 'Mettez à jour les informations' : 'Configurez votre nouvelle entreprise'}
              </p>
            </div>

            <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom de l'entreprise */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    <Building2 className="inline h-4 w-4 mr-2" />
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Tech Solutions SARL"
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">
                    <ArrowLeft className="inline h-4 w-4 mr-2 rotate-45" />
                    Adresse
                  </label>
                  <div className="relative">
                    <textarea
                      rows={3}
                      className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Adresse complète de l'entreprise"
                    />
                  </div>
                </div>

                {/* Téléphone et Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      <Users className="inline h-4 w-4 mr-2" />
                      Téléphone
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+221 XX XXX XX XX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo et Couleur */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      🖼️ Logo (Upload)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={(e) => setFormData({...formData, logo: e.target.files[0]})}
                      />
                      <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">
                      🎨 Couleur principale
                    </label>
                    <div className="relative">
                      <input
                        type="color"
                        className="w-full h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 cursor-pointer"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {!editingCompany && (
                  <>
                    {/* Section Admin avec style spécial */}
                    <div className="border-t-2 border-blue-200 pt-6 mt-8">
                      <div className="bg-blue-600 rounded-xl p-4 mb-6">
                        <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Créer le compte Administrateur
                        </h4>
                        <p className="text-sm text-white">
                          Cet utilisateur aura tous les droits sur l'entreprise
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-800">
                            <Mail className="inline h-4 w-4 mr-2" />
                            Email de l'Admin <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                              value={formData.adminEmail}
                              onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                              placeholder="admin@entreprise.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-800">
                              <Lock className="inline h-4 w-4 mr-2" />
                              Mot de passe <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="password"
                                className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                                value={formData.adminPassword}
                                onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
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
                  </>
                )}

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCompany(null);
                      resetForm();
                    }}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    ❌ Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {editingCompany ? (
                      <>
                        <Edit className="h-5 w-5 mr-2" />
                        Modifier
                      </>
                    ) : (
                      <>
                        <Building2 className="h-5 w-5 mr-2" />
                        Créer l'entreprise
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal création utilisateur */}
      {showUserModal && selectedCompany && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden">
            {/* Header avec fond uni */}
            <div className="bg-blue-600 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <UserPlus className="h-6 w-6 mr-2" />
                Créer un utilisateur
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                pour {selectedCompany.name}
              </p>
            </div>

            <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleCreateUser} className="space-y-4">
                {/* Section principale */}
                <div className="rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations du compte
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                          value={userFormData.email}
                          onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                          placeholder="utilisateur@entreprise.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          <Lock className="inline h-4 w-4 mr-2" />
                          Mot de passe <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                            value={userFormData.password}
                            onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                            placeholder="Min. 6 caractères"
                            required
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
                            value={userFormData.confirmPassword}
                            onChange={(e) => setUserFormData({...userFormData, confirmPassword: e.target.value})}
                            placeholder="Répéter le mot de passe"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        <Users className="inline h-4 w-4 mr-2" />
                        Rôle <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                          value={userFormData.role}
                          onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                          required
                        >
                          <option value="ADMIN">👑 Administrateur</option>
                          <option value="CAISSIER">💳 Caissier</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations sur le rôle */}
                <div className={`rounded-xl p-4 ${
                  userFormData.role === 'ADMIN'
                    ? 'bg-purple-50'
                    : 'bg-green-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      userFormData.role === 'ADMIN'
                        ? 'bg-purple-100'
                        : 'bg-green-100'
                    }`}>
                      {userFormData.role === 'ADMIN' ? (
                        <User className="h-6 w-6 text-purple-600" />
                      ) : (
                        <CreditCard className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Rôle: {userFormData.role === 'ADMIN' ? 'Administrateur' : 'Caissier'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {userFormData.role === 'ADMIN'
                          ? 'Accès complet à la gestion de l\'entreprise, employés et cycles de paie.'
                          : 'Accès limité aux paiements et génération de reçus.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    ❌ Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Créer l'utilisateur
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal création employé */}
      {showEmployeeModal && selectedCompany && (
        <div className="fixed inset-0 bg-[#6FA4AF] bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden">
            {/* Header avec fond uni */}
            <div className="bg-blue-600 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <UserPlus className="h-6 w-6 mr-2" />
                Ajouter un employé
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                à {selectedCompany.name}
              </p>
            </div>

            <div className="px-6 py-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleCreateEmployee} className="space-y-4">
                {/* Informations personnelles */}
                <div className="bg-[#6FA4AF] rounded-xl p-4">
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
                          value={employeeFormData.firstName}
                          onChange={(e) => setEmployeeFormData({...employeeFormData, firstName: e.target.value})}
                          placeholder="Jean"
                          required
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
                          value={employeeFormData.lastName}
                          onChange={(e) => setEmployeeFormData({...employeeFormData, lastName: e.target.value})}
                          placeholder="Dupont"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations professionnelles */}
                <div className="bg-[#6FA4AF] rounded-xl p-4">
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
                          value={employeeFormData.position}
                          onChange={(e) => setEmployeeFormData({...employeeFormData, position: e.target.value})}
                          placeholder="Développeur Full Stack"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          <ChevronDown className="inline h-4 w-4 mr-2" />
                          Type de contrat <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                            value={employeeFormData.contractType}
                            onChange={(e) => setEmployeeFormData({...employeeFormData, contractType: e.target.value})}
                            required
                          >
                            <option value="FIXE">Fixe</option>
                            <option value="JOURNALIER">Journalier</option>
                            <option value="HONORAIRE">Honoraire</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          <CreditCard className="inline h-4 w-4 mr-2" />
                          Salaire/Taux (FCFA) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.01"
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                            value={employeeFormData.rate}
                            onChange={(e) => setEmployeeFormData({...employeeFormData, rate: e.target.value})}
                            placeholder="150000"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations bancaires */}
                <div className="bg-[#6FA4AF] rounded-xl p-4">
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
                        value={employeeFormData.bankDetails}
                        onChange={(e) => setEmployeeFormData({...employeeFormData, bankDetails: e.target.value})}
                        placeholder="IBAN: CI12 3456 7890 1234 5678 9012 345&#10;Banque: Ecobank&#10;Titulaire: Jean Dupont"
                      />
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    ❌ Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Ajouter l'employé
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