import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useInvoice } from "./InvoiceContext";
import "./PaymentDetails.css";

const PaymentDetails = () => {
  const { paymentId } = useParams();
  const { fetchPayment, loading, error } = useInvoice();
  const [payment, setPayment] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const loadPayment = async () => {
      setLocalLoading(true);
      const paymentData = await fetchPayment(paymentId);
      setPayment(paymentData);
      setLocalLoading(false);
    };

    loadPayment();
  }, [paymentId, fetchPayment]);

  if (localLoading)
    return (
      <div className="payment-details-loading">
        <div className="payment-details-spinner"></div>
        <p className="payment-details-loading-text">
          Loading payment details...
        </p>
      </div>
    );
  if (error) return <div className="payment-details-error">Error: {error}</div>;
  if (!payment)
    return <div className="payment-details-error">Payment not found</div>;

  return (
    <div className="payment-details-container">
      <div className="payment-details-card">
        <h2 className="payment-details-title">
          Payment Details #{payment.payment_id}
        </h2>

        <div className="payment-details-content">
          <div className="payment-info-section">
            <h3 className="section-title">Payment Information</h3>
            <p>
              <strong>Payment ID:</strong> {payment.payment_id}
            </p>
            <p>
              <strong>Amount:</strong> {payment.amount} SAR
            </p>
            <p>
              <strong>Payment Date:</strong>{" "}
              {new Date(payment.payment_date).toLocaleString()}
            </p>
            <p>
              <strong>Invoice ID:</strong> {payment.invoice_id}
            </p>
          </div>

          <div className="invoice-info-section">
            <h3 className="section-title">Invoice Information</h3>
            <p>
              <strong>Status:</strong> {getStatusText(payment.invoice.status)}
            </p>
            <p>
              <strong>Total Amount:</strong> {payment.invoice.total_amount} SAR
            </p>
            <p>
              <strong>Paid Amount:</strong> {payment.invoice.paid_amount} SAR
            </p>
            <p>
              <strong>Remaining Amount:</strong>{" "}
              {payment.invoice.remaining_amount} SAR
            </p>
          </div>
        </div>

        <div className="appointment-info-section">
          <h3 className="section-title">Appointment Information</h3>
          <p>
            <strong>Appointment Date:</strong>{" "}
            {new Date(
              payment.invoice.appointment.appointment_date
            ).toLocaleString()}
          </p>
          <p>
            <strong>Doctor:</strong> {payment.invoice.appointment.doctor.name}
          </p>
          <p>
            <strong>Specialty:</strong>{" "}
            {payment.invoice.appointment.doctor.specialty_name}
          </p>
        </div>

        <div className="action-buttons">
          <Link
            to={`/invoices/${payment.invoice_id}`}
            className="action-button primary"
          >
            View Invoice
          </Link>
          <Link to="/payments" className="action-button secondary">
            Back to Payments
          </Link>
        </div>
      </div>
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

export default PaymentDetails;
