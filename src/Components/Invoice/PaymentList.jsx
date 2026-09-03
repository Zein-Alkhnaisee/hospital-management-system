import React, { useEffect, useState } from "react";
import { useInvoice } from "./InvoiceContext";
import { Link } from "react-router-dom";
import "./PaymentList.css";

const PaymentList = () => {
  const { payments, loading, error, fetchPayments } = useInvoice();
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLocalLoading(true);
        setLocalError(null);
        await fetchPayments();
      } catch (err) {
        setLocalError(err.message || "Failed to load payments");
      } finally {
        setLocalLoading(false);
      }
    };

    loadPayments();
  }, [fetchPayments]);

  if (localLoading)
    return (
      <div className="payment-details-loading">
        <div className="payment-details-spinner"></div>
        <p className="payment-details-loading-text">Loading payments...</p>
      </div>
    );
  if (localError)
    return <div className="payment-error">Error: {localError}</div>;
  if (error) return <div className="payment-error">Error: {error}</div>;

  return (
    <div className="payment-list-container">
      <h2 className="payment-title">Payment History</h2>

      {payments && payments.length > 0 ? (
        <div className="payment-grid">
          {payments.map((payment) => (
            <div key={payment.payment_id} className="payment-card">
              <div className="payment-header">
                <div className="payment-info">
                  <h3 className="payment-id">Payment #{payment.payment_id}</h3>
                  <p className="invoice-id">Invoice: #{payment.invoice_id}</p>
                  <p className="payment-date">
                    Date: {new Date(payment.payment_date).toLocaleString()}
                  </p>
                </div>
                <div className="payment-amount-container">
                  <p className="payment-amount">{payment.amount} SAR</p>
                  <p className={`invoice-status ${payment.invoice.status}`}>
                    {getStatusText(payment.invoice.status)}
                  </p>
                </div>
              </div>

              <div className="payment-footer">
                <div className="appointment-info">
                  <p className="doctor-name">
                    Doctor: {payment.invoice.appointment.doctor.name}
                  </p>
                  <p className="appointment-date">
                    Appointment:{" "}
                    {new Date(
                      payment.invoice.appointment.appointment_date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/payments/${payment.payment_id}`}
                  className="details-button"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-payments">
          <p>No payments recorded yet.</p>
        </div>
      )}
    </div>
  );
};

const getStatusText = (status) => {
  const statusMap = {
    pending: "Pending",
    partial: "Partially Paid",
    paid: "Fully Paid",
  };
  return statusMap[status] || status;
};

export default PaymentList;
