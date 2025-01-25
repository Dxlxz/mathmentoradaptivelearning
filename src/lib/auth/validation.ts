import { AuthFormState, AuthFormErrors } from "./types";

export const validateAuthForm = (data: Partial<AuthFormState>): AuthFormErrors => {
  const errors: AuthFormErrors = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/[0-9]/.test(data.password)) {
    errors.password = "Password must contain at least one number";
  }

  if (data.name !== undefined && !data.name) {
    errors.name = "Name is required";
  } else if (data.name && data.name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (data.role === "student" && !data.grade) {
    errors.grade = "Grade is required for students";
  }

  if (data.role === "mentor" && !data.institution) {
    errors.institution = "Institution is required for mentors";
  }

  return errors;
};