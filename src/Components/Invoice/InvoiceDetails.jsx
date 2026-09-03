import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useInvoice } from "./InvoiceContext";
import PaymentForm from "./PaymentForm";
import "./InvoiceDetails.css";

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const { fetchInvoice, fetchInvoicePayments, loading, error } = useInvoice();
  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLocalLoading(true);
      try {
        const invoiceData = await fetchInvoice(invoiceId);
        setInvoice(invoiceData);

        const paymentData = await fetchInvoicePayments(invoiceId);
        setPayments(paymentData);
      } catch (err) {
        console.error("Error loading invoice details:", err);
      } finally {
        setLocalLoading(false);
      }
    };

    loadData();
  }, [invoiceId, fetchInvoice, fetchInvoicePayments]);

  if (localLoading)
    return (
      <div className="invoice-details-loading">
        <div className="invoice-details-spinner"></div>
        <p className="invoice-details-loading-text">
          Loading invoice details...
        </p>
      </div>
    );
  if (error) return <div className="invoice-details-error">Error: {error}</div>;
  if (!invoice)
    return <div className="invoice-details-error">Invoice not found</div>;

  // تحويل القيم الرقمية للتأكد من أنها أرقام وليس نصوص
  const totalAmount = parseFloat(invoice.total_amount || 0);
  const paidAmount = parseFloat(invoice.paid_amount || 0);
  const remainingAmount = parseFloat(invoice.remaining_amount || 0);

  // حساب المبلغ المدفوع فعلياً من سجل الدفعات
  const actualPaidAmount = payments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount || 0),
    0
  );

  // التحقق من تناسق حالة الفاتورة مع المبالغ
  const isStatusConsistent = () => {
    if (remainingAmount <= 0 && invoice.status === "paid") return true;
    if (
      remainingAmount > 0 &&
      remainingAmount < totalAmount &&
      invoice.status === "partial"
    )
      return true;
    if (remainingAmount === totalAmount && invoice.status === "pending")
      return true;
    return false;
  };

  // التحقق مما إذا كان يمكن الدفع (يوجد مبلغ متبقي)
  const canPay = remainingAmount > 0;

  return (
    <div className="invoice-details-container">
      <div className="invoice-details-card">
        <div className="invoice-details-header">
          <h2 className="invoice-details-title">
            Invoice Details #{invoice.invoice_id}
          </h2>
          <span className={`status-badge ${invoice.status}`}>
            {getStatusText(invoice.status)}
            {!isStatusConsistent() && " (Inconsistent)"}
          </span>
        </div>

        {!isStatusConsistent() && (
          <div className="inconsistency-warning">
            <strong>Warning:</strong> Invoice status doesn't match payment
            amounts. Please contact support if this is incorrect.
          </div>
        )}

        <div className="invoice-details-content">
          <div className="appointment-info-section">
            <h3 className="section-title">Appointment Information</h3>
            <p>
              <strong>Appointment Date:</strong>{" "}
              {new Date(invoice.appointment.appointment_date).toLocaleString()}
            </p>
            <p>
              <strong>Doctor:</strong> {invoice.appointment.doctor.name}
            </p>
            <p>
              <strong>Specialty:</strong>{" "}
              {invoice.appointment.doctor.specialty_name}
            </p>
          </div>

          <div className="financial-info-section">
            <h3 className="section-title">Financial Information</h3>
            <p>
              <strong>Total Amount:</strong> {totalAmount.toFixed(2)} SAR
            </p>
            <p>
              <strong>Paid Amount (Invoice):</strong> {paidAmount.toFixed(2)}{" "}
              SAR
            </p>
            <p>
              <strong>Paid Amount (Calculated):</strong>{" "}
              {actualPaidAmount.toFixed(2)} SAR
            </p>
            <p>
              <strong>Remaining Amount:</strong> {remainingAmount.toFixed(2)}{" "}
              SAR
            </p>
            <p>
              <strong>Status:</strong> {getStatusText(invoice.status)}
            </p>
          </div>
        </div>

        {canPay && (
          <button
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className={`payment-toggle-btn ${
              showPaymentForm ? "cancel" : "pay"
            }`}
          >
            {showPaymentForm ? "Cancel Payment" : "Pay Invoice"}
          </button>
        )}

        {showPaymentForm && canPay && (
          <PaymentForm
            invoice={invoice}
            onSuccess={() => {
              setShowPaymentForm(false);
              // إعادة تحميل البيانات بعد الدفع الناجح
              const loadData = async () => {
                const invoiceData = await fetchInvoice(invoiceId);
                setInvoice(invoiceData);
                const paymentData = await fetchInvoicePayments(invoiceId);
                setPayments(paymentData);
              };
              loadData();
            }}
          />
        )}
      </div>

      <div className="payments-history-card">
        <h3 className="section-title">Payment History</h3>
        {payments && payments.length > 0 ? (
          <div className="payments-table-container">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Amount (SAR)</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td>{payment.payment_id}</td>
                    <td>{parseFloat(payment.amount || 0).toFixed(2)}</td>
                    <td>{new Date(payment.payment_date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total Paid: {actualPaidAmount.toFixed(2)} SAR
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="no-payments-message">
            No payments recorded for this invoice.
          </p>
        )}
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

export default InvoiceDetails;
