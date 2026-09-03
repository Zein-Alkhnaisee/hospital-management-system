import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';

const Diagnostics = () => {
  const { axios, isAuthenticated, user } = useAuth();
  const [apiTests, setApiTests] = useState({});
  const [loading, setLoading] = useState(false);

  const testAllEndpoints = async () => {
    setLoading(true);
    const tests = {};
    
    try {
      // اختبار 1: جلب جميع التخصصات
      const specialtiesResponse = await axios.get('/specialties');
      tests.specialties = {
        success: specialtiesResponse.data.success,
        data: specialtiesResponse.data.data,
        count: specialtiesResponse.data.data?.length || 0
      };
    } catch (error) {
      tests.specialties = { 
        error: error.message, 
        status: error.response?.status,
        data: error.response?.data 
      };
    }
    
    try {
      // اختبار 2: جلب جميع الأطباء
      const doctorsResponse = await axios.get('/doctors');
      let doctorsData = [];
      let count = 0;
      
      if (doctorsResponse.data && Array.isArray(doctorsResponse.data.doctors)) {
        doctorsData = doctorsResponse.data.doctors;
        count = doctorsResponse.data.doctors.length;
      } else if (Array.isArray(doctorsResponse.data)) {
        doctorsData = doctorsResponse.data;
        count = doctorsResponse.data.length;
      }
      
      tests.doctors = {
        success: !!doctorsResponse.data,
        data: doctorsData,
        count: count
      };
    } catch (error) {
      tests.doctors = { 
        error: error.message, 
        status: error.response?.status,
        data: error.response?.data 
      };
    }
    
    try {
      // اختبار 3: جلب أطباء قسم معين
      const specialtyDoctorsResponse = await axios.get('/specialties/1/doctors');
      tests.specialty_doctors = {
        success: !!specialtyDoctorsResponse.data,
        data: specialtyDoctorsResponse.data,
        count: specialtyDoctorsResponse.data?.doctors?.length || 0
      };
    } catch (error) {
      tests.specialty_doctors = { 
        error: error.message, 
        status: error.response?.status,
        data: error.response?.data 
      };
    }
    
    setApiTests(tests);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      testAllEndpoints();
    }
  }, [isAuthenticated]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>API Diagnostics</h2>
      <p>User: {user?.email}</p>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p>Token: {localStorage.getItem('token') ? 'Exists' : 'Missing'}</p>
      
      <button onClick={testAllEndpoints} disabled={loading}>
        {loading ? 'Testing...' : 'Run Tests'}
      </button>
      
      <h3>Endpoints Test Results:</h3>
      <pre>{JSON.stringify(apiTests, null, 2)}</pre>
    </div>
  );
};

export default Diagnostics;