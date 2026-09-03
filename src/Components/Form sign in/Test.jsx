// import { useState } from "react";
// import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "./FormSignStylee.css";

// axios.defaults.withCredentials = true;

// export default function FormSign() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [verification_code, setVerifyCode] = useState("");
//   const [token, setToken] = useState("");  // بداية فارغة
//   const [step, setStep] = useState("register");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (password.length > 10) {
//       setError("Password should not exceed 10 characters.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       await axios.get("http://localhost:8000/sanctum/csrf-cookie");
//       const response = await axios.post("http://localhost:8000/api/register", {
//         name,
//         email,
//         password,
//         password_confirmation: confirmPassword,
//       });

//       setToken(response.data.token); // خزن التوكن
//       setStep("verify");
//     } catch (err) {
//       console.error("Error response:", err.response?.data);
//       setError(err.response?.data?.message || "Registration failed. Please try again.");
//     }
//     }
//   };

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/api/verify-code",
//         { code: verification_code },  // تأكد من اسم المفتاح 'code' حسب Laravel
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSuccess("Verification successful!");
//     } catch (err) {
//       console.error(err.response?.data);
//       setError("Verification failed. Please try again.");
//     }
//   };

//   return (
//     <div className="login-container">
//       {step === "register" && (
//         <form className="login-form" onSubmit={handleRegister}>
//           <h2>Register</h2>
//           {error && <p className="text-danger">{error}</p>}
//           <div className="mb-3">
//             <label htmlFor="name">Name:</label>
//             <input
//               type="text"
//               id="name"
//               className="form-control"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               className="form-control"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="password">Password:</label>
//             <input
//               type="password"
//               id="password"
//               className="form-control"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="confirmPassword">Confirm Password:</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               className="form-control"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary">Register</button>
//         </form>
//       )}
//       {step === "verify" && (
//         <form className="login-form" onSubmit={handleVerify}>
//           <h2>Enter Verification Code</h2>
//           {error && <p className="text-danger">{error}</p>}
//           {success && <p className="text-success">{success}</p>}<div className="mb-3">
//             <label htmlFor="verification_code">Code:</label>
//             <input
//               type="text"
//               id="verification_code"
//               className="form-control"
//               value={verification_code}
//               onChange={(e) => setVerifyCode(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-success">Verify</button>
//         </form>
//       )}
//     </div>
//   );
// }