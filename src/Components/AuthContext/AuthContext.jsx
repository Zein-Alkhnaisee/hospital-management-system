import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const axiosInstance = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const resetToken = localStorage.getItem("reset_temp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (resetToken) {
    config.headers["temp-token"] = resetToken;
    config.headers["token-purpose"] = "password_reset";
  }

  if (!config.url.startsWith("/api") && !config.url.startsWith("http")) {
    config.url = `/api${config.url}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // أي استجابة ناجعة يتم تمريرها كما هي
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("خطأ في الاستجابة:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("email_verified");
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Internal server error -可能需要检查后端服务");
      }
    } else if (error.request) {
      console.error("لم يتم استلام رد من الخادم:", error.request);
    } else {
      console.error("خطأ في إعداد الطلب:", error.message);
    }

    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [userRoles, setUserRoles] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        return parsedUser.roles || (parsedUser.role ? [parsedUser.role] : []);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedVerified = localStorage.getItem("email_verified") === "true";

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        // إضافة حقول افتراضية إذا كانت مفقودة
        if (!parsedUser.hasOwnProperty("is_patient_registered")) {
          parsedUser.is_patient_registered = false;
        }
        if (!parsedUser.hasOwnProperty("wallet_balance")) {
          parsedUser.wallet_balance = 0;
        }
        if (parsedUser.role === "doctor" && !parsedUser.specialty_id) {
          parsedUser.specialty_id = parsedUser.specialty?.specialty_id || null;
        }

        setToken(savedToken);
        setUser(parsedUser);
        setIsVerified(savedVerified);

        if (parsedUser.id === 6) {
          const mockRoles = ["patient", "doctor", "receptionist"];
          setUserRoles(mockRoles);

          // تحديث بيانات المستخدم بالأدوار المزيفة للاختبار
          const updatedUser = { ...parsedUser, roles: mockRoles };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else if (parsedUser.role && !parsedUser.roles) {
          setUserRoles([parsedUser.role]);
        }
      } catch (e) {
        console.error("Failed to parse saved user data", e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const fetchUserRoles = async () => {
    if (!token) {
      console.warn("No token available, skipping roles fetch");
      return;
    }

    setRolesLoading(true);
    try {
      const response = await axiosInstance.get("/me/roles");
      if (response.data && response.data.roles) {
        setUserRoles(response.data.roles);

        // تحديث بيانات المستخدم بالأدوار الجديدة
        if (user) {
          const updatedUser = { ...user, roles: response.data.roles };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Failed to fetch user roles:", error);
      // في حالة الخطأ، نستخدم الأدوار المحلية إن وجدت
      if (user && user.role) {
        setUserRoles([user.role]);
      }
    } finally {
      setRolesLoading(false);
    }
  };

  const hasRole = (roleName) => {
    // إذا كانت userRoles تحتوي على بيانات، نستخدمها
    if (userRoles && userRoles.length > 0) {
      return userRoles.includes(roleName);
    }

    // إذا لم تكن userRoles متوفرة، نستخدم user.role القديم
    if (user && user.role) {
      return user.role === roleName;
    }

    return false;
  };

  const login = (newToken, userData, verified = false) => {
    // إضافة حقول افتراضية إذا كانت مفقودة
    if (!userData.hasOwnProperty("is_patient_registered")) {
      userData.is_patient_registered = false;
    }
    if (!userData.hasOwnProperty("wallet_balance")) {
      userData.wallet_balance = 0;
    }
    if (!userData) {
      console.error("User data is missing in login");
      return;
    }

    setToken(newToken);
    setUser(userData);
    setIsVerified(verified);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("email_verified", verified ? "true" : "false");
    fetchUserRoles();
  };

  const verify = () => {
    setIsVerified(true);
    localStorage.setItem("email_verified", "true");

    if (user) {
      const updatedUser = { ...user, email_verified: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsVerified(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email_verified");
  };

  const updateUser = (userData) => {
    // إضافة حقول افتراضية إذا كانت مفقودة
    if (!userData.hasOwnProperty("is_patient_registered")) {
      userData.is_patient_registered = false;
    }
    if (!userData.hasOwnProperty("wallet_balance")) {
      userData.wallet_balance = 0;
    }

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // تحديث حالة تسجيل المريض
  const setPatientRegistered = (isRegistered) => {
    if (user) {
      const updatedUser = {
        ...user,
        is_patient_registered: isRegistered,
        role: isRegistered ? "patient" : user.role,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // تحديث رصيد المحفظة
  const updateWalletBalance = (newBalance) => {
    if (user) {
      const updatedUser = { ...user, wallet_balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await axiosInstance.get("/user");
      if (response.data && response.data.user) {
        updateUser(response.data.user);
      }

      // أيضا نجلب الأدوار المحدثة
      await fetchUserRoles();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const isAuthenticated = !!token && isVerified;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        userRoles,
        hasRole,
        rolesLoading,
        login,
        logout,
        verify,
        updateUser,
        refreshUser,
        fetchUserRoles,
        updateWalletBalance,
        setPatientRegistered,
        isAuthenticated,
        isVerified,
        loading,
        axios: axiosInstance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { axiosInstance };
