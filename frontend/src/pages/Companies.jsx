import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Companies = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
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

  const handleSwitchToCompany = (company) => {
    // Sauvegarder l'entreprise sélectionnée dans le localStorage
    localStorage.setItem('selectedCompany', JSON.stringify({
      id: company.id,
      name: company.name
    }));

    // Rediriger vers le dashboard avec le contexte de cette entreprise
    navigate('/dashboard');
    alert(`Vous êtes maintenant dans le contexte de l'entreprise "${company.name}"`);
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
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {companies.map((company) => (
                <li key={company.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-blue-300 flex items-center justify-center">
                          <span className="text-lg font-medium text-blue-700">
                            🏢
                          </span>
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
                          onClick={() => handleSwitchToCompany(company)}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Basculer vers cette entreprise
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
        </div>
      </div>

      {/* Modal */}
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
    </div>
  );
};

export default Companies;