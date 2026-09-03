import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";

const InvoiceContext = createContext();
export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const { axios } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all invoices
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/invoices");
      setInvoices(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch invoices");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Fetch a specific invoice
  const fetchInvoice = useCallback(
    async (invoiceId) => {
      setLoading(true);
      try {
        const response = await axios.get(`/invoices/${invoiceId}`);
        setError(null);
        return response.data.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch invoice");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  // Fetch all payments
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/payments");
      setPayments(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch payments");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  // Fetch a specific payment
  const fetchPayment = useCallback(
    async (paymentId) => {
      setLoading(true);
      try {
        const response = await axios.get(`/payments/${paymentId}`);
        setError(null);
        return response.data.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch payment");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  // Fetch payments for a specific invoice
  const fetchInvoicePayments = useCallback(
    async (invoiceId) => {
      setLoading(true);
      try {
        const response = await axios.get(`/invoices/${invoiceId}/payments`);
        setError(null);
        return response.data.data;
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch invoice payments"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  // Pay an invoice
  const payInvoice = useCallback(
    async (invoiceId, amount) => {
      setLoading(true);
      try {
        const response = await axios.post(`/invoices/${invoiceId}/pay`, {
          amount,
        });
        setError(null);

        // Refresh data after successful payment
        await fetchInvoices();
        await fetchPayments();

        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to pay invoice");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [axios, fetchInvoices, fetchPayments]
  );

  const value = {
    invoices,
    payments,
    loading,
    error,
    fetchInvoices,
    fetchInvoice,
    fetchPayments,
    fetchPayment,
    fetchInvoicePayments,
    payInvoice,
  };

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};
