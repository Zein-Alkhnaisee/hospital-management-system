import React from "react";
import {
  doctorFields,
  receptionistFields,
  patientFields
} from "./roleFields";

const RoleSpecificFields = ({ role, register }) => {
  let roleFields = [];

  if (role === "doctor") {
    roleFields = doctorFields;
  } else if (role === "receptionist") {
    roleFields = receptionistFields;
  } else if (role === "patient") {
    roleFields = patientFields;
  }

  return (
    <>
      {roleFields.map((field) => (
        <div key={field.name}>
          <label>{field.label}</label>
          <input
            type={field.type}
            placeholder={field.placeholder || ""}
            {...register(field.name, { required: field.required })}
          />
        </div>
      ))}
    </>
  );
};

export default RoleSpecificFields;
