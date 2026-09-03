import React, { useState } from "react";
import { useInvoice } from "./InvoiceContext";
import { useAuth } from "../AuthContext/AuthContext";
import "./PaymentForm.css";

const PaymentForm = ({ invoice, onSuccess }) => {
  const { payInvoice } = useInvoice();
  const { user, updateWalletBalance } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // تحويل القيم الرقمية للتأكد من أنها أرقام
  const remainingAmount = parseFloat(invoice.remaining_amount || 0);
  const walletBalance = parseFloat(user?.wallet_balance || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // التحقق من أن المبلغ المدخل صحيح
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError("Please enter a valid payment amount");
      setLoading(false);
      return;
    }

    if (paymentAmount > remainingAmount) {
      setError(
        `Payment amount cannot exceed remaining amount of ${remainingAmount.toFixed(
          2
        )} SAR`
      );
      setLoading(false);
      return;
    }

    if (paymentAmount > walletBalance) {
      setError(
        `Insufficient balance. Your current balance is ${walletBalance.toFixed(
          2
        )} SAR`
      );
      setLoading(false);
      return;
    }

    try {
      const result = await payInvoice(invoice.invoice_id, paymentAmount);

      if (result.user_balance !== undefined) {
        updateWalletBalance(result.user_balance);
      }

      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during payment"
      );
    } finally {
      setLoading(false);
    }
  };

  const maxAmount = Math.min(remainingAmount, walletBalance);

  return (
    <div className="payment-form-container">
      <h4 className="payment-form-title">Pay Invoice #{invoice.invoice_id}</h4>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label className="form-label">
            Remaining Amount: {remainingAmount.toFixed(2)} SAR
          </label>
          <label className="form-label">
            Your Current Balance: {walletBalance.toFixed(2)} SAR
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max={maxAmount}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-input"
            placeholder="Enter amount to pay"
            required
          />
          <p className="form-hint">
            Maximum payment: {maxAmount.toFixed(2)} SAR
          </p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button
          type="submit"
          disabled={
            loading ||
            !amount ||
            parseFloat(amount) <= 0 ||
            parseFloat(amount) > maxAmount
          }
          className="submit-button"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
