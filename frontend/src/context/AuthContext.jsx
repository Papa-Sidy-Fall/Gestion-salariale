import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [companyColor, setCompanyColor] = useState('#6FA4AF'); // Couleur par défaut
  const [companyLogo, setCompanyLogo] = useState(null); // Logo par défaut
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/profile');
      const fetchedUser = response.data.user;
      setUser(fetchedUser);

      if (fetchedUser.companyId) {
        const companyResponse = await axios.get(`http://localhost:3000/api/companies/${fetchedUser.companyId}`);
        setCompanyColor(companyResponse.data.company.color || '#6FA4AF');
        setCompanyLogo(companyResponse.data.company.logo || null);
      } else {
        setCompanyColor('#6FA4AF');
        setCompanyLogo(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setCompanyColor('#6FA4AF');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('Envoi des données de connexion à l\'API:', { email, password }); // Ajout du log
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email,
      password
    });

    const { user, token } = response.data;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);

    if (user.companyId) {
      const companyResponse = await axios.get(`http://localhost:3000/api/companies/${user.companyId}`);
      setCompanyColor(companyResponse.data.company.color || '#6FA4AF');
      setCompanyLogo(companyResponse.data.company.logo || null);
    } else {
      setCompanyColor('#6FA4AF');
      setCompanyLogo(null);
    }

    return user;
  };

  const register = async (email, password, role, companyId) => {
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      email,
      password,
      role,
      companyId
    });

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCompanyColor('#6FA4AF');
    setCompanyLogo(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    companyColor,
    companyLogo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
