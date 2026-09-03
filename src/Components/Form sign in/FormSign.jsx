// import "./FormSignStylee.css";
// import { useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Link, Links } from "react-router-dom";

// export default function FormSign() {
//   const [name, setName] = useState("")
//   const [step, setStep] =useState("signUp")
//   const [password, setPassword] = useState("")
//   const [email, setEmail] = useState("");
//   const [number, setNumber] = useState("");
//   const [date, setDate] = useState("");
//   const [role, setRole] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const password = e.target.password.value;
//     if(password.length >10) {
//       alert('the password should not exceed 10 letters');
//       return ;
//     }
//     setStep('verify')
//   };

//   const passwordForget = (e) =>{
//     setStep('passwordForget');
//   }

//   const verifyPassword = (e) =>{
//     setStep('verifyPassword');
//   }
  
  
//   return (
//     <div className="login-container">
//       {step === 'signUp' && (
//         <form className="login-form" onSubmit={handleSubmit}>
//         <h2>Sign Up to the hospital</h2>

//           <div className="row">

//             <div className="col-lg-6 col-sm-12 up-input">
//               <label htmlFor="name">Name :</label>
//               <input
//                 type="text"
//                 id="name"
//                 placeholder="Your Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="col-lg-6 col-sm-12 up-input">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 placeholder="example@bank.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
            

//             {/* <div className="col-lg-6 col-sm-12 up-input">
//               <label htmlFor="date">Your birthday</label>
//               <input
//                 type="date"
//                 id="date"
//                 name=""
//                 placeholder="dd/mm/yyyy"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 required
//               />
//             </div> */}

//             <div className="col-lg-6 col-sm-12 up-input">
//               <label htmlFor="password">Password :</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="Your Password"
//                 // maxLength={10}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>


//             <div className="col-lg-6 col-sm-12 up-input">
//               <label htmlFor="date">Role</label>
//               <select
//                 className="role"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//               >
//                 <option value="visitor">visitor</option>
//                 <option value="doctor">doctor</option>
//                 {/* <option value="admin">admin</option> */}
//                 <option value="patients">Patients</option>
//                 <option value="receptionists">Receptionists</option>
//               </select>
//             </div>



//             {/* {role == 'visitor' && (
//               <div>
//                 <div className="col-lg-6 col-sm-12 num up-input">
//                   <label htmlFor="number">Your Number Phone</label>
//                   <input
//                     type="number"
//                     id="number"
//                     placeholder="Phone : 0988877766"
//                     maxLength={10}
//                     value={number}
//                     onChange={(e) => setNumber(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
//             )} */}


//             {role == 'doctor' && (
//               <div >
//                 <div className="col-lg-6 col-sm-12 num up-input">
//                   <label htmlFor="spec">Your specialization :</label>
//                   <input
//                     type="text"
//                     id="spec"
//                     placeholder=" : heart"
//                     className="input-stylee"
//                   />
//                 </div>
              
//                 <div className="col-lg-6 col-sm-12 num up-input">
//                 <label htmlFor="license">License Number :</label>
//                 <input
//                   type="number"
//                   id="license"
//                   placeholder=" :7576378"
//                   className="input-stylee"
//                 />
//                 </div>
//               </div>
//             )}


//             {role == 'patients' && (
//               <div >
//                 <div className="col-lg-6 col-sm-12 num up-input">
//                   <label htmlFor="medical">Medical History :</label>
//                   <input
//                     type="text"
//                     id="medical"
//                     placeholder=" :#######"
//                     className="input-stylee"
//                   />
//                 </div>
              
//                 <div className="col-lg-6 col-sm-12 num up-input">
//                 <label htmlFor="emergency">Emergency Contect :</label>
//                 <input
//                   type="text"
//                   id="emergency"
//                   placeholder=" :########"
//                   className="input-stylee"
//                 />
//                 </div>

//                 <div className="col-lg-6 col-sm-12 num up-input">
//                 <label htmlFor="bloode">Bloode Type :</label>
//                 <input
//                   type="text"
//                   id="bloode"
//                   placeholder=" : O+ "
//                   className="input-stylee"
//                 />
//                 </div>
//               </div>
//             )}

//             {role == 'receptionists' && (
//               <div>
//                 <div className="col-lg-6 col-sm-12 num up-input">
//                   <label htmlFor="assigned">Assigned Doctor I</label>
//                   <input
//                     type="number"
//                     id="assigned"
//                     placeholder="Id : 1"
//                   />
//                 </div>
//               </div>
//             )}

//           <div className="remember-me ">
//             <input type="checkbox" id="remember"/>
//             <label htmlFor="remember" className="label-remember">Remember Me</label>
//             <Link rel="stylesheet" onClick={()=>{setStep('passwordForget')}}>Did your forget the password ?</Link>

//           </div>
//         </div>

//         <button type="submit">Sign Up</button>
//       </form>
//       )}

//       {step === 'verify' && (
//         <form className="login-form" onSubmit={handleSubmit}>
//         <h2>verify for Sign Up to the hospital</h2>

//           <div className="row">
//             <div className="col-lg-6 col-sm-12 up-input">
//               <label htmlFor="num">Code :</label>
//               <input
//                 type="number"
//                 id="num"
//                 placeholder="Code :"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//               <button type="submit">Sign Up</button>
//               <Link rel="stylesheet" onClick={()=>{setStep('passwordForget')}}>
//                 Did your forget the password ?</Link>
//             </div>
//           </div>
//         </form>
//       )}

//       { step === 'passwordForget' && (
//         <form className="login-form" onSubmit={passwordForget}>
//         <h2>Enter Your Email Again</h2>

//           <div className="row">

//             <div className="col-lg-6 col-sm-12 up-input">
//               <label htmlFor="email">Your Email :</label>
//               <input
//                 type="text"
//                 id="email"
//                 placeholder="Enter Your Email :"
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <button type="submit" onClick={()=>{setStep('verify')}}>Continue</button>
//             </div>
//           </div>
//         </form>
//       )}

//       {step === 'verifyPassword' && (
//         <form className="login-form" onSubmit={verifyPassword}>
//         <h2>verify for Sign Up to the hospital</h2>

//           <div className="row">
//             <div className="col-lg-6 col-sm-12 up-input">
//               <label htmlFor="num">Code :</label>
//               <input
//                 type="number"
//                 id="num"
//                 placeholder="Code :"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//               <button type="submit">Sign Up</button>
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }