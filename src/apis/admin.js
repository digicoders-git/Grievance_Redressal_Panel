import API from "../utils/api";

export const loginAdmin = async (email, password) => {
  const response = await API.post("/admin/login", { email, password });
  return response.data;
};

export const updateAdminProfile = async (id, formData) => {
  const response = await API.put(`/admin/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
