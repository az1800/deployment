import axios from "axios";
export default async function LogOut() {
  try {
    const response = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include", // Equivalent to Axios' `withCredentials: true`
    });
    const data = await response.json();
    console.log("Logout successful:", data);
  } catch (err) {
    console.error("Logout error:", err);
  }
}
