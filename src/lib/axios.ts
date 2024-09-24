import Axios from "axios";
import { getSession, signOut } from "next-auth/react";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
});

axios.interceptors.request.use(
  async (request: any) => {
    const session = await getSession();
    if (session?.access_token) {
      request.headers["Authorization"] = `${session?.access_token?.token_type} ${session?.access_token?.token}`;
    }
    return request;
  },
  (error: any) => {
    // console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: any) => {
    // console.log(response);
    return response.data;
  },
  (error: any) => {
    // console.log(error)
    if (error?.response?.status == 401) {
      signOut({ callbackUrl: "/login" })
    }
    return Promise.reject(error);
  }
);

export default axios;
