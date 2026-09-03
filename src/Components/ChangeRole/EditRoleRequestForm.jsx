import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";

const EditRoleRequestForm = ({
  requestId,
  roleType,
  initialData,
  onUpdateSuccess,
  onCancel,
}) => {
  const { axios: authAxios } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [specialties, setSpecialties] = useState([]);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(false);
  const [specialtiesError, setSpecialtiesError] = useState(null);

  // Fetch medical specialties from server
  useEffect(() => {
    const fetchSpecialties = async () => {
      setSpecialtiesLoading(true);
      setSpecialtiesError(null);

      try {
        const response = await authAxios.get("/specialties");

        if (response.data.success && Array.isArray(response.data.data)) {
          setSpecialties(response.data.data);
        } else {
          setSpecialtiesError("Failed to fetch medical specialties");
        }
      } catch (err) {
        setSpecialtiesError("Error fetching medical specialties");
        console.error("Error fetching specialties:", err);
      } finally {
        setSpecialtiesLoading(false);
      }
    };

    fetchSpecialties();
  }, [authAxios]);

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key !== "created_at" && key !== "updated_at") {
          setValue(key, value);
        }
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("request_id", requestId);

      const fields =
        roleType === "doctor"
          ? doctorFields
          : roleType === "receptionist"
          ? receptionistFields
          : patientFields;

      fields.forEach((field) => {
        if (field.type === "file") {
          if (data[field.name] && data[field.name][0]) {
            formData.append(field.name, data[field.name][0]);
          } else if (initialData && initialData[field.name]) {
            formData.append(field.name, initialData[field.name]);
          }
        } else {
          if (field.name === "specialty_id") {
            const specialty = specialties.find(
              (s) => s.specialty_id == data.specialty_id
            );
            if (specialty) {
              formData.append("specialization", specialty.name);
            }
          }
          formData.append(field.name, data[field.name]);
        }
      });

      let endpoint = "";
      switch (roleType) {
        case "doctor":
          endpoint = "/doctor-role-request/update";
          break;
        case "receptionist":
          endpoint = "/receptionist-role-request/update";
          break;
        case "patient":
          endpoint = "/patient-role-request/update";
          break;
        default:
          return;
      }

      const res = await authAxios.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(" Request updated successfully");

      setMessage({
        text: res.data.message || "✅ Request updated successfully",
        type: "success",
      });

      if (onUpdateSuccess) {
        setTimeout(onUpdateSuccess, 1500);
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "❌ Failed to update request",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const doctorFields = [
    {
      name: "education_degree",
      placeholder: "Educational Degree",
      type: "select",
      required: true,
      options: [
        { value: "bachelor", label: "Bachelor" },
        { value: "master", label: "Master" },
        { value: "phd", label: "PhD" },
        { value: "diploma", label: "Diploma" },
        { value: "board_certified", label: "Board Certified" },
      ],
    },
    {
      name: "employment_type",
      placeholder: "Employment Type",
      type: "select",
      required: true,
      options: [
        { value: "full_time", label: "Full-time" },
        { value: "part_time", label: "Part-time" },
        { value: "contract", label: "Contract" },
        { value: "freelance", label: "Freelance" },
      ],
    },
    {
      name: "specialty_id",
      placeholder: "Specialty",
      type: "select",
      required: true,
      options: specialties.map((specialty) => ({
        value: specialty.specialty_id,
        label: specialty.name,
      })),
    },
    {
      name: "university_name",
      placeholder: "University Name",
      type: "text",
      required: true,
    },
    { name: "country", placeholder: "Country", type: "text", required: true },
    {
      name: "graduation_year",
      placeholder: "Graduation Year",
      type: "text",
      required: true,
      validate: (value) =>
        /^\d{4}$/.test(value) || "Graduation year must be 4 digits",
    },
    {
      name: "license_number",
      placeholder: "Medical License Number",
      type: "text",
      required: true,
    },
    {
      name: "medical_lincense_expiry",
      placeholder: "License Expiry Date",
      type: "date",
      required: true,
    },
    {
      name: "years_experience",
      placeholder: "Years of Experience",
      type: "number",
      required: true,
      min: 0,
      max: 50,
    },
    { name: "diploma_image_url", placeholder: "Diploma Image", type: "file" },
    { name: "transcript_image_url", placeholder: "Transcript", type: "file" },
    { name: "lincense_scan_url", placeholder: "License Scan", type: "file" },
    {
      name: "signature_image_url",
      placeholder: "Signature Image",
      type: "file",
    },
  ];

  const receptionistFields = [
    {
      name: "languages_spaking",
      placeholder: "Languages",
      type: "text",
      required: true,
    },
    {
      name: "computer_skills",
      placeholder: "Computer Skills",
      type: "text",
      required: true,
    },
    {
      name: "communication_skills",
      placeholder: "Communication Skills",
      type: "text",
      required: true,
    },
    {
      name: "typing_speed",
      placeholder: "Typing Speed (WPM)",
      type: "number",
      required: true,
    },
    {
      name: "cover_letter",
      placeholder: "Cover Letter",
      type: "text",
      required: true,
    },
    {
      name: "available_start_date",
      placeholder: "Available Start Date",
      type: "date",
      required: true,
    },
    {
      name: "education_level",
      placeholder: "Education Level",
      type: "text",
      required: true,
    },
    {
      name: "field_of_study",
      placeholder: "Field of Study",
      type: "text",
      required: true,
    },
    {
      name: "education_image_url",
      placeholder: "Education Certificate",
      type: "file",
    },
    {
      name: "year_of_experience",
      placeholder: "Years of Experience",
      type: "number",
      required: true,
    },
    {
      name: "preferred_shift",
      placeholder: "Preferred Shift",
      type: "select",
      required: true,
      options: [
        { value: "morning", label: "Morning" },
        { value: "full_time", label: "FullTime" },
        { value: "night", label: "Night" },
      ],
    },
  ];

  const patientFields = [
    {
      name: "medical_history",
      placeholder: "Medical History",
      type: "text",
      required: true,
    },
    {
      name: "chronic_conditions",
      placeholder: "Chronic Conditions",
      type: "text",
      required: true,
    },
    {
      name: "allergies",
      placeholder: "Allergies",
      type: "text",
      required: true,
    },
    {
      name: "family_history",
      placeholder: "Family Medical History",
      type: "text",
      required: true,
    },
    {
      name: "disability_status",
      placeholder: "Disability Status",
      type: "text",
      required: true,
    },
    {
      name: "smoking_status",
      placeholder: "Smoking Status",
      type: "select",
      required: true,
      options: [
        { value: "smoker", label: "Smoker" },
        { value: "non_smoker", label: "Non-smoker" },
        { value: "ex_smoker", label: "Ex-smoker" },
      ],
    },
    {
      name: "laboratory_analysis_image_url",
      placeholder: "Lab Analysis Report",
      type: "file",
      required: true,
    },
  ];

  const renderFields = (fields) => {
    return fields.map((field) => (
      <div key={field.name} className="mb-3">
        <label className="form-label">
          {field.placeholder}
          {field.required && <span className="text-danger"> *</span>}
        </label>

        {field.type === "file" ? (
          <div>
            <input
              {...register(field.name)}
              type="file"
              className="form-control"
              accept="image/*"
            />
            {initialData?.[field.name] && (
              <div className="mt-2">
                <small>Current Image:</small>
                <img
                  src={initialData[field.name]}
                  alt="Current file"
                  style={{ maxWidth: "100px", display: "block" }}
                  className="img-thumbnail mt-1"
                />
              </div>
            )}
          </div>
        ) : field.type === "select" ? (
          <select
            {...register(field.name, {
              required: field.required && "This field is required",
            })}
            className="form-select"
            disabled={field.name === "specialty_id" && specialtiesLoading}
          >
            <option value="">Select</option>
            {field.name === "specialty_id" && specialtiesLoading ? (
              <option value="" disabled>
                Loading departments...
              </option>
            ) : field.name === "specialty_id" && specialtiesError ? (
              <option value="" disabled>
                Error loading departments
              </option>
            ) : (
              field.options?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  selected={initialData?.specialty_id === option.value}
                >
                  {option.label}
                </option>
              ))
            )}
          </select>
        ) : (
          <input
            {...register(field.name, {
              required: field.required && "This field is required",
            })}
            type={field.type}
            className="form-control"
          />
        )}

        {errors[field.name] && (
          <div className="text-danger small">{errors[field.name].message}</div>
        )}
      </div>
    ));
  };

  const getFieldsByRole = () => {
    switch (roleType) {
      case "doctor":
        return renderFields(doctorFields);
      case "receptionist":
        return renderFields(receptionistFields);
      case "patient":
        return renderFields(patientFields);
      default:
        return null;
    }
  };

  return (
    <div className="border p-3 mt-3 bg-white rounded">
      <h4>Edit Role Change Request</h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        {getFieldsByRole()}

        <div className="d-flex justify-content-between mt-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {message.text && (
        <div
          className={`alert alert-${
            message.type === "success" ? "success" : "danger"
          } mt-3`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default EditRoleRequestForm;
