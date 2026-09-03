// إنشاء هوك مخصص للتحقق من صحة المريض
export const useValidatePatient = () => {
  const { user } = useAuth(); // استخدام الهوك هنا مسموح

  const validate = () => {
    if (!user || user.role !== "patient") {
      throw new Error("غير مصرح: يجب أن تكون مريضًا");
    }
    if (!user.is_patient_registered) {
      throw new Error("غير مصرح: يجب أن تكون مسجلًا في جدول المرضى");
    }
  };

  return validate; // إرجاع دالة التحقق
};
