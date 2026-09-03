export const commonFields = [
    { key: "dateofbirth", label: "Date of birth" },
    { key: "gender", label: "Gender" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
    { key: "bio", label: "About you" },
    { key: "blood_type", label: "Blood type" },
    { key: "marital_status", label: "Marital status" }
  ];
  
  export const roleSpecificFields = {
    doctor: [
      { key: "specialization", label: "Specialization" },
      { key: "license_number", label: "License number" },
      { key: "years_of_experience", label: "Years of experience" }
    ],
    receptionist: [
      { key: "shift_time", label: "Shift time" },
      { key: "desk_number", label: "Desk number" }
    ],
    patient: [
      { key: "medical_history", label: "Medical history" },
      { key: "allergies", label: "Allergies" }
    ]
  };
  