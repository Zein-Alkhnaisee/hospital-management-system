import axiosInstance from "./../../Api/axiosInstance";

const ratingService = {
  // إضافة تقييم جديد
  addRating: async (doctorId, ratingData) => {
    try {
      const response = await axiosInstance.post(
        `/ratings/${doctorId}`,
        ratingData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding rating:", error);

      if (error.response) {
        if (error.response.status === 403) {
          throw new Error(
            "غير مسموح لك بالتقييم. يجب أن تكون مريضًا لتتمكن من تقييم الأطباء."
          );
        } else if (error.response.data && error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }

      throw new Error(error.message || "حدث خطأ أثناء إضافة التقييم");
    }
  },

  // باقي الدوال بنفس النمط (إزالة الإضافة اليدوية للتوكن)
  getDoctorRatings: async (doctorId) => {
    try {
      const response = await axiosInstance.get(`/doctors/${doctorId}/ratings`);
      return response.data;
    } catch (error) {
      console.error("Error getting ratings:", error);
      throw error.response?.data || error.message;
    }
  },

  // الحصول على تقييم واحد
  getRating: async (ratingId) => {
    try {
      // إضافة التوكن يدويًا لضمان إرساله
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axiosInstance.get(`/ratings/${ratingId}`, config);
      return response.data;
    } catch (error) {
      console.error("Error getting rating:", error);
      throw error.response?.data || error.message;
    }
  },

  // تعديل تقييم
  updateRating: async (ratingId, ratingData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axiosInstance.put(
        `/ratings/${ratingId}`,
        ratingData,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error updating rating:", error);
      throw error.response?.data || error.message;
    }
  },

  // حذف تقييم
  deleteRating: async (ratingId) => {
    try {
      // إضافة التوكن يدويًا لضمان إرساله
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const response = await axiosInstance.delete(
        `/ratings/${ratingId}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting rating:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default ratingService;
