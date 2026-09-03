import React, { useEffect, useState } from "react";
import { useInvoice } from "./InvoiceContext";
import { Link } from "react-router-dom";
import "./InvoiceList.css";

const InvoiceList = () => {
  const { invoices, loading, error, fetchInvoices } = useInvoice();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      setLocalLoading(true);
      await fetchInvoices();
      setLocalLoading(false);
    };

    loadInvoices();
  }, [fetchInvoices]);

  if (localLoading)
    return (
      <div className="invoice-details-loading">
        <div className="invoice-details-spinner"></div>
        <p className="invoice-details-loading-text">Loading invoices...</p>
      </div>
    );
  if (error) return <div className="invoice-error">Error: {error}</div>;

  return (
    <div className="invoice-list-container">
      <h2 className="invoice-title">Invoices</h2>

      {invoices && invoices.length > 0 ? (
        <div className="invoice-grid">
          {invoices.map((invoice) => {
            const totalAmount = parseFloat(invoice.total_amount || 0);
            const paidAmount = parseFloat(invoice.paid_amount || 0);
            const remainingAmount = parseFloat(invoice.remaining_amount || 0);

            return (
              <div key={invoice.invoice_id} className="invoice-card">
                <div className="invoice-header">
                  <div className="invoice-info">
                    <h3 className="invoice-id">
                      Invoice #{invoice.invoice_id}
                    </h3>
                    <p className="appointment-date">
                      Appointment:{" "}
                      {new Date(
                        invoice.appointment.appointment_date
                      ).toLocaleDateString()}
                    </p>
                    <p className="doctor-name">
                      Doctor: {invoice.appointment.doctor.name}
                    </p>
                  </div>
                  <div className="invoice-status-container">
                    <p className={`invoice-status ${invoice.status}`}>
                      {getStatusText(invoice.status)}
                    </p>
                    <p className="total-amount">
                      Total: {totalAmount.toFixed(2)} SAR
                    </p>
                    <p className="paid-amount">
                      Paid: {paidAmount.toFixed(2)} SAR
                    </p>
                    <p className="remaining-amount">
                      Due: {remainingAmount.toFixed(2)} SAR
                    </p>
                  </div>
                </div>

                <div className="invoice-actions">
                  <Link
                    to={`/invoices/${invoice.invoice_id}`}
                    className="details-button"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-invoices">
          <p>No invoices found.</p>
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

export default InvoiceList;
