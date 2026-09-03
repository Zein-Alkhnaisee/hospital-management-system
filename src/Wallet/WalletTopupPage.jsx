import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import TopupForm from "./TopupForm";
import TopupList from "./TopupList";
import TopupDetails from "./TopupDetails";
import { useWalletTopup } from "./WalletTopupContext";
import "./WalletTopupPage.css";

const WalletTopupPage = () => {
  const navigate = useNavigate();
  const { loading } = useWalletTopup();

  return (
    <div className="wallet-topup-page-container">
      <div className="wallet-topup-page-header">
        <h1 className="wallet-topup-page-title">
          <i className="bi bi-wallet2 me-2"></i>
          Wallet Top-up
        </h1>
        <Link to="/" className="wallet-topup-page-back-btn">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Home
        </Link>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div className="d-flex justify-content-end mb-4">
                <button
                  className="wallet-topup-page-new-btn"
                  onClick={() => navigate("/wallet-topups/create")}
                  disabled={loading}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  New Top-up Request
                </button>
              </div>

              <TopupList />
            </div>
          }
        />

        <Route
          path="create"
          element={
            <div>
              <div className="wallet-topup-page-header">
                <h2 className="wallet-topup-page-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  New Top-up Request
                </h2>
                <button
                  className="wallet-topup-page-back-btn"
                  onClick={() => navigate("/wallet-topups")}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to List
                </button>
              </div>
              <TopupForm onSuccess={() => navigate("/wallet-topups")} />
            </div>
          }
        />

        <Route path=":id" element={<TopupDetails />} />
      </Routes>
    </div>
  );
};

export default WalletTopupPage;
