import API from "./axios";

// ======================================================
// REGISTER GUEST
// ======================================================

export const registerGuest = async (formData) => {

  const response = await API.post(
    "/guest/register",
    formData
  );

  return response.data;
};


// ======================================================
// LOGIN GUEST
// ======================================================

export const loginGuest = async (formData) => {

  const response = await API.post(
    "/guest/login",
    formData
  );

  return response.data;
};


// ======================================================
// LOGOUT
// ======================================================

export const logoutGuest = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

};