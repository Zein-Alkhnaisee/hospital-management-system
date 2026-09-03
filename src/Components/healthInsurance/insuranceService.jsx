import axios from "../../Api/axiosInstance";

export const validatePatient = (user) => {
  if (!user) throw new Error("المستخدم غير معروف");
  if (user.role !== "patient") throw new Error("هذه الخدمة متاحة فقط للمرضى");
  if (!user.is_patient_registered)
    throw new Error("يجب إكمال تسجيل البيانات كـ مريض أولاً");
};

export const submitInsurance = async (user, formData) => {
  validatePatient(user);

  const response = await axios.post("/health-insurance", formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateInsurance = async (user, id, formData) => {
  validatePatient(user);

  const response = await axios.post(`/health-insurance/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteInsurance = async (user, id) => {
  validatePatient(user);
  const response = await axios.delete(`/health-insurance/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const getAllInsurances = async (user) => {
  validatePatient(user);
  const response = await axios.get("/health-insurance", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const getActiveInsurance = async (user) => {
  validatePatient(user);
  try {
    const all = await getAllInsurances(user);
    return (
      all.find(
        (insurance) =>
          insurance.status === "approved" &&
          new Date(insurance.valid_to) > new Date()
      ) || null
    );
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};
