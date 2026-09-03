import { useState } from "react";
import "./ImageUploader.css";

const ImageUploader = ({ onFileSelect, initialImage }) => {
  const [previewUrl, setPreviewUrl] = useState(initialImage || "");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    // التحقق من حجم الملف (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة يجب أن يكون أقل من 5MB");
      return;
    }

    // التحقق من نوع الملف
    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!acceptedTypes.includes(file.type)) {
      setError(
        "نوع الصورة غير مدعوم. الرجاء استخدام صورة من نوع JPEG, PNG, GIF, أو WEBP"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      onFileSelect(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="hi-image-uploader">
      {error && <div className="hi-upload-error">{error}</div>}

      {previewUrl ? (
        <div className="hi-image-preview-container">
          <img src={previewUrl} alt="Preview" className="hi-image-preview" />
          <div>
            <label className="hi-change-image-btn">
              Change Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hi-upload-input"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="hi-upload-area">
          <label className="hi-upload-label">
            Upload Insurance Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hi-upload-input"
            />
          </label>
          <p className="hi-upload-hint"> or drop the image here</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
