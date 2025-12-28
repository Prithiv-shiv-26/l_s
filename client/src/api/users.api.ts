import api from "./axios";

export const getUsers = () => api.get("/users");

export const createUser = (data: { name: string; email: string }) =>
  api.post("/users", data);

export const deleteUser = (id: number) => api.delete(`/users/${id}`);

export const updateUser = (id: number, data: {
  name?: string;
  email?: string;
}) => api.patch(`/users/${id}`, data);