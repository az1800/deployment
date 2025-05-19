import axios from "axios";
export default async function sendReq(serviceID, des, budget, date) {
  const reqData = {
    servicesId: serviceID,
    description: des,
    budget: budget,
    deadline: date,
  };
  try {
    const response = axios.post(
      "http://localhost:5000/api/client/post-request",
      reqData,
      { withCredentials: true }
    );
    return response;
  } catch (err) {
    console.log(err);
  }
}
