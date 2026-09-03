import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../Api/axiosInstance";
import { useAuth } from "../Components/AuthContext/AuthContext";

const WalletTopupContext = createContext();

export const useWalletTopup = () => useContext(WalletTopupContext);

export const WalletTopupProvider = ({ children }) => {
  const { token } = useAuth();
  const [topups, setTopups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const fetchTopups = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/wallet-topups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopups(response.data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load top-up requests";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createTopup = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post("/wallet-topups", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setRefreshFlag((prev) => prev + 1);
      return response.data;
    } catch (err) {
      const serverError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create top-up request";
      setError(serverError);
      throw new Error(serverError);
    } finally {
      setLoading(false);
    }
  };

  const updateTopup = async (id, formData) => {
    setLoading(true);
    try {
      // جرب استخدام POST مع _method=PUT إذا فشلت PUT المباشرة
      let response;

      try {
        // المحاولة الأولى: استخدام PUT مباشرة
        response = await axios.put(`/wallet-topups/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (putError) {
        // إذا فشلت PUT، جرب POST مع _method=PUT
        console.log("PUT failed, trying POST with _method=PUT");
        formData.append("_method", "PUT");

        response = await axios.post(`/wallet-topups/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setRefreshFlag((prev) => prev + 1);
      return response.data;
    } catch (err) {
      const serverError =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to update top-up request";
      setError(serverError);
      throw new Error(serverError);
    } finally {
      setLoading(false);
    }
  };

  const deleteTopup = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/wallet-topups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefreshFlag((prev) => prev + 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete request");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTopupDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/wallet-topups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load request details");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTopups();
    }
  }, [token, refreshFlag]);

  const value = {
    topups,
    loading,
    error,
    createTopup,
    updateTopup,
    deleteTopup,
    getTopupDetails,
    refresh: () => setRefreshFlag((prev) => prev + 1),
  };

  return (
    <WalletTopupContext.Provider value={value}>
      {children}
    </WalletTopupContext.Provider>
  );
};
