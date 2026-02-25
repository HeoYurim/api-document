import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/projects';

export const getProjects = async () => {
    const response = await axios.get(`${API_BASE_URL}/list`);
    return response.data;
};

export const createProject = async (projectData) => {
    const response = await axios.post(`${API_BASE_URL}/register`, projectData);
    return response.data;
};

export const updateProject = async (id, projectData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, projectData);
    return response.data;
};

export const deleteProject = async (id) => {
    await axios.delete(`${API_BASE_URL}/${id}`);
};

export const toggleProjectStatus = async (id) => {
    const response = await axios.patch(`${API_BASE_URL}/${id}/status`);
    return response.data;
};