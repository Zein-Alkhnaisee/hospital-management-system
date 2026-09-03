import "./FormSignStylee.css";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FormSign() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Number:", number);
    console.log("Date:", date);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign Up to the hospital</h2>

          <div className="inp-items row">
          
            <div className="col-lg-6 col-sm-12">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="example@bank.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="col-lg-6 col-sm-12">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            

            <div className="col-lg-6 col-sm-12 ">
              <label htmlFor="date">Your birthday</label>
              <input
                type="date"
                id="date"
                name=""
                placeholder="dd/mm/yyyy"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="col-lg-6 col-sm-12 ">
              <label htmlFor="date">Role</label>
              <select
                className="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">--select--</option>
                <option value="visitor">visitor</option>
                <option value="doctor">doctor</option>
                <option value="admin">admin</option>
              </select>
            </div>
            {role == 'visitor' && (
              <div className="col-lg-6 col-sm-12 num">
              <label htmlFor="number">Your Number Phone</label>
              <input
                type="number"
                id="number"
                placeholder="Phone : 0988877766"
                maxLength={10}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            )}

            {role == 'doctor' && (
              <div className="col-lg-6 col-sm-12 num">
              <label htmlFor="number">Your special</label>
              <input
                type="text"
                placeholder=" : heart"
                className="input-stylee"
              />
            </div>
            )}


          <div className="remember-me ">
            <input type="checkbox" id="remember"/>
            <label htmlFor="remember" className="label-remember">Remember Me</label>
          </div>
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}