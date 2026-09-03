import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../AuthContext/AuthContext";

const RoleChangeForm = ({ userId, onRequestSubmit }) => {
  const { user, setPatientRegistered, axios: authAxios } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
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

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("target_role", data.target_role);
      formData.append("user_id", userId);

      // Add additional fields for selected role
      const fields =
        selectedRole === "doctor"
          ? doctorFields
          : selectedRole === "receptionist"
          ? receptionistFields
          : patientFields;

      fields.forEach((field) => {
        if (field.type === "file") {
          if (data[field.name] && data[field.name][0]) {
            formData.append(field.name, data[field.name][0]);
          }
        } else {
          // Add default values for required fields if empty
          let value = data[field.name];
          if (field.name === "specialty_id") {
            const specialty = specialties.find(
              (s) => s.specialty_id == data.specialty_id
            );
            if (specialty) {
              formData.append("specialization", specialty.name);
            }
          }
          if (field.required && !value) {
            value = "Not provided"; // Default value for required fields
          }
          formData.append(field.name, value || "");
        }
      });

      // Add required patient fields with default values
      if (selectedRole === "patient") {
        const requiredFields = [
          "medical_history",
          "chronic_conditions",
          "allergies",
          "family_history",
          "disability_status",
          "smoking_status",
          "laboratory_analysis_image_url",
        ];

        requiredFields.forEach((field) => {
          if (!formData.has(field)) {
            formData.append(field, "Not provided"); // Default value
          }
        });
      }

      // Add is_registered field
      formData.append("is_registered", "true");

      const res = await authAxios.post(
        `/role-requests/${data.target_role}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage({
        text: res.data.message || "✅ Request submitted successfully",
        type: "success",
      });

      // Update user status if registered as patient
      if (data.target_role === "patient" && user) {
        setPatientRegistered(true);
      }

      if (onRequestSubmit) {
        onRequestSubmit(res.data);
      }

      reset();
    } catch (err) {
      console.error("Full error details:", err);

      let errorMessage = "❌ Failed to submit request";

      if (err.response) {
        if (err.response.data && err.response.data.errors) {
          errorMessage = Object.values(err.response.data.errors)
            .flatMap((error) => error)
            .join("; ");
        } else {
          errorMessage =
            err.response.data?.message ||
            err.response.data?.error ||
            JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setMessage({
        text: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
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
    {
      name: "diploma_image_url",
      placeholder: "Diploma Image",
      type: "file",
      required: true,
    },
    {
      name: "transcript_image_url",
      placeholder: "Transcript",
      type: "file",
      required: true,
    },
    {
      name: "lincense_scan_url",
      placeholder: "License Scan",
      type: "file",
      required: true,
    },
    {
      name: "signature_image_url",
      placeholder: "Signature Image",
      type: "file",
      required: true,
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
      required: true,
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
    {
      name: "is_registered",
      type: "hidden",
      value: "true",
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
          <input
            {...register(field.name, {
              required: field.required && "This field is required",
              validate: {
                fileSize: (file) =>
                  !file[0] || file[0].size <= 5 * 1024 * 1024 || "Max size 5MB",
                fileType: (file) =>
                  !file[0] ||
                  /image\/(jpeg|png|gif)/.test(file[0].type) ||
                  "Image must be JPEG, PNG or GIF",
              },
            })}
            type="file"
            className="form-control"
            accept="image/*"
          />
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
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            )}
          </select>
        ) : field.type === "hidden" ? (
          <input {...register(field.name)} type="hidden" />
        ) : (
          <input
            {...register(field.name, {
              required: field.required && "This field is required",
            })}
            type={field.type}
            className="form-control"
            placeholder={`Enter ${field.placeholder}`}
          />
        )}

        {errors[field.name] && (
          <div className="text-danger small">{errors[field.name].message}</div>
        )}

        {field.name === "specialty_id" && specialtiesError && (
          <div className="text-danger small">
            {specialtiesError} - Request will be sent with empty value
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="p-4 border rounded bg-light shadow "
      >
        <div className="mb-3 ">
          <label className="form-label">Select New Role:</label>
          <select
            {...register("target_role", {
              required: "Role selection is required",
            })}
            className={`form-select ${errors.target_role ? "is-invalid" : ""}`}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="patient">Patient</option>
          </select>
          {errors.target_role && (
            <div className="invalid-feedback">{errors.target_role.message}</div>
          )}
        </div>

        {selectedRole === "doctor" && (
          <>
            <div className="alert alert-info mb-3">
              <strong>Note:</strong> The doctor will be added to the department
              you select in the Specialty field
            </div>
            {renderFields(doctorFields)}
          </>
        )}
        {selectedRole === "receptionist" && renderFields(receptionistFields)}
        {selectedRole === "patient" && renderFields(patientFields)}

        <button
          type="submit"
          className="btn btn-primary w-100 mt-3"
          disabled={
            isLoading || (selectedRole === "doctor" && specialtiesLoading)
          }
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </button>

        {message.text && (
          <div
            className={`alert alert-${
              message.type === "success" ? "success" : "danger"
            } mt-3`}
          >
            {message.text}
            {message.type === "error" && (
              <div className="mt-2 small">
                <details>
                  <summary>Technical Details</summary>
                  <div className="mt-2 p-2 bg-white text-dark">
                    {message.text}
                  </div>
                </details>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default RoleChangeForm;
