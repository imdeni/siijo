import axios from "./axios";

export async function loginAction(data: { email: string; password: string, device_id: string }) {
  return await axios
    .post("/auth/login-participant", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return null;
    });
}
