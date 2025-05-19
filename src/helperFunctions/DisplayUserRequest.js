import axios from "axios";

export async function diplayUserRequests2() {
  const url = "http://localhost:5000/api/client/display-user-request";
  try {
    const response = await axios.post(url, [], { withCredentials: true });

    if (response.status === 200) {
      return response.data;
    } else {
      return "error";
    }
  } catch (err) {
    console.error(err);
  }
}
export async function deleteRequest(id) {
  const url = "http://localhost:5000/api/client/delete-request";
  try {
    const response = await axios.post(
      url,
      { requestID: id },
      { withCredentials: true }
    );
    if (response.status === 200) return 200;
    return 400;
  } catch (err) {
    console.log(err);
  }
}
