import API from "../utils/api";

export const loginOfficer = async (mobile, password) => {
  const response = await API.post("/admin/officer/login", { mobile, password });
  return response.data;
};

// Grievance APIs
export const fetchAllGrievances = async () => {
  const response = await API.get("/officer/grievance/list");
  return response.data;
};

export const claimGrievance = async (id) => {
  const response = await API.patch(`/officer/grievance/claim/${id}`);
  return response.data;
};

export const resolveGrievance = async (id, remarks, status) => {
  const response = await API.patch(`/officer/grievance/resolve/${id}`, { remarks, status });
  return response.data;
};
