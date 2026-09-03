import { useForm } from "react-hook-form";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { submitInsurance, updateInsurance } from "./insuranceService";
import "./InsuranceForm.css";

const InsuranceForm = ({ insurance, onSuccess, onCancel, user }) => {
  const isEdit = !!insurance;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: insurance?.name || "",
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      if (!isEdit && user?.active_insurance) {
        throw new Error("لديك تأمين نشط بالفعل");
      }

      // إنشاء FormData وإضافة البيانات
      const formData = new FormData();
      formData.append("name", data.name);

      // إضافة ملف الصورة إن وُجد - استخدم نفس اسم الحقل الذي يستخدمه إنشاء الملف الشخصي
      if (imageFile) {
        formData.append("image_url", imageFile); // التعديل هنا
      }

      if (isEdit) {
        await updateInsurance(user, insurance.insurance_id, formData);
        setMessage({ text: "تم تحديث التأمين بنجاح", type: "success" });
      } else {
        await submitInsurance(user, formData);
        setMessage({ text: "تم إرسال طلب التأمين بنجاح", type: "success" });
      }

      setTimeout(onSuccess, 1500);
    } catch (error) {
      console.error("فشل في إرسال التأمين:", error);

      let errorMessage = "حدث خطأ أثناء الإرسال";
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `خطأ في الخادم: ${error.response.status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hi-form-card">
      <div className="hi-form-header">
        <h5>{isEdit ? "Edit Insurance" : "Add New Insurance"}</h5>
      </div>
      <div className="hi-form-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="hi-form-group">
            <label className="hi-form-label">Insurance Company Name</label>
            <input
              {...register("name", { required: "هذا الحقل مطلوب" })}
              className={`hi-form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter company Name"
            />
            {errors.name && (
              <div className="hi-invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          <div className="hi-form-group">
            <label className="hi-form-label">Insurance Document Image</label>
            <ImageUploader
              onFileSelect={setImageFile}
              initialImage={insurance?.image_url}
            />
            <div className="hi-form-text">
              Please upload a clear image of the insurance document showing key
              details
            </div>
          </div>

          {message.text && (
            <div
              className={`hi-form-alert hi-alert-${
                message.type === "success" ? "success" : "danger"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="hi-form-buttons">
            <button
              type="button"
              className="hi-cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="hi-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="hi-submit-spinner"></span>
                  Submitting...
                </>
              ) : isEdit ? (
                "Update"
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsuranceForm;
