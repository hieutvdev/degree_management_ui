import "dotenv/config";

export const API_HOST = process.env.DEGREE_SERVICE_HOST;
export const API_PORT = process.env.DEGREE_SERVICE_PORT;
export const API_URL = `${API_HOST}:${API_PORT}`;
