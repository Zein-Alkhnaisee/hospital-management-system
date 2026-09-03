import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useWalletTopup } from "./WalletTopupContext";
import { useNavigate } from "react-router-dom";
import "./TopupForm.css";
import "./WalletAnimations.css";

const TopupForm = ({ existingTopup = null, onSuccess }) => {
  const {
    createTopup,
    updateTopup,
    loading: contextLoading, // إعادة تسمية لتجنب التعارض
    error: contextError,
  } = useWalletTopup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm();

  const [receiptImage, setReceiptImage] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // حالة محلية للتتبع
  const navigate = useNavigate();

  const amountValue = watch("amount");

  useEffect(() => {
    if (existingTopup) {
      const amount = existingTopup.amount
        ? parseFloat(existingTopup.amount).toString()
        : "";
      setValue("amount", amount);
      console.log("Set amount value to:", amount);
    }
  }, [existingTopup, setValue]);

  const onSubmit = async (data) => {
    setFormError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // التأكد من أن amount ليس فارغًا أو غير معرف
      if (!data.amount || data.amount === "0") {
        setFormError("Amount is required and must be greater than 0");
        setIsSubmitting(false);
        return;
      }

      // تحقق من أن amount هو رقم صحيح
      const amount = parseFloat(data.amount);
      if (isNaN(amount) || amount <= 0) {
        setFormError("Please enter a valid amount greater than 0");
        setIsSubmitting(false);
        return;
      }

      formData.append("amount", amount.toString());

      // التعامل مع صورة الإيصال - هذه قد تكون مصدر المشكلة
      if (receiptImage) {
        formData.append("receipt_image_url", receiptImage);
      } else if (existingTopup && !receiptImage) {
        // عند التعديل بدون تغيير الصورة، أرسل رابط الصورة الحالي كنص
        formData.append("receipt_image_url", existingTopup.receipt_image_url);
      }

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (existingTopup) {
        // حاول أولاً بدون _method=PUT
        await updateTopup(existingTopup.wallet_topup_id, formData);
      } else {
        await createTopup(formData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/wallet-topups");
      }

      reset();
      setReceiptImage(null);
    } catch (err) {
      setFormError(
        err.message || "An error occurred while processing the request"
      );
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("File size must be less than 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setFormError("Unsupported file type. Please use JPEG, PNG, or GIF");
        return;
      }

      setReceiptImage(file);
      setFormError("");
    }
  };

  // دمج حالة التحميل من السياق والحالة المحلية
  const isLoading = contextLoading || isSubmitting;

  return (
    <div className="wallet-topup-form-container">
      <div className="wallet-topup-form-card wallet-card-hover wallet-fade-in">
        <div className="wallet-topup-form-card-body">
          <h4 className="wallet-topup-form-title">
            {existingTopup
              ? "Edit Top-up Request"
              : "New Wallet Top-up Request"}
          </h4>

          {(formError || contextError) && (
            <div className="alert alert-danger">
              {formError || contextError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="wallet-topup-form-label">Amount (USD)</label>
              <input
                type="number"
                className={`wallet-topup-form-input ${
                  errors.amount ? "wallet-topup-form-input-error" : ""
                }`}
                step="0.01"
                min="1"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Minimum amount is $0.01" },
                  validate: (value) =>
                    parseFloat(value) > 0 || "Amount must be greater than 0",
                })}
              />
              {errors.amount && (
                <div className="wallet-topup-form-feedback">
                  {errors.amount.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="wallet-topup-form-label">
                Receipt Image{" "}
                {!existingTopup && <span className="text-danger">*</span>}
              </label>
              <input
                type="file"
                className="wallet-topup-form-input"
                accept="image/*"
                onChange={handleImageChange}
                id="receipt-image-input"
              />
              {existingTopup?.receipt_image_url && !receiptImage && (
                <div className="mt-2">
                  <small>Current Image:</small>
                  <img
                    src={existingTopup.receipt_image_url}
                    alt="Receipt"
                    className="wallet-topup-form-image-preview"
                  />
                </div>
              )}
              {receiptImage && (
                <div className="mt-2">
                  <small>New Image:</small>
                  <img
                    src={URL.createObjectURL(receiptImage)}
                    alt="New Receipt"
                    className="wallet-topup-form-image-preview"
                  />
                </div>
              )}
            </div>

            <div className="wallet-topup-form-buttons">
              <button
                type="submit"
                className="wallet-topup-form-submit-btn"
                disabled={isLoading} // استخدام الحالة المدمجة
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    {existingTopup ? "Updating..." : "Submitting..."}
                  </>
                ) : existingTopup ? (
                  "Update Request"
                ) : (
                  "Submit Request"
                )}
              </button>

              {!existingTopup && (
                <button
                  type="button"
                  className="wallet-topup-form-cancel-btn"
                  onClick={() => navigate("/wallet-topups")}
                >
                  Back to Requests
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopupForm;
