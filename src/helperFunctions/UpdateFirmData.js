import axios from "axios";
export async function displayCurrentData() {
  try {
    const response = await fetch(
      "http://localhost:5000/api/account_firm/getAccountFirmUser",
      {
        //from here u can choose the url u wnat in back-end

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json(); // Parse response
    if (response.ok) {
      return data;
    }
  } catch (error) {
    return "404";
  }
}

export async function updateFirmData(
  name,
  image,
  description,
  email,
  currentPassword,
  newPassword
) {
  const uploadData = new FormData();
  uploadData.append("image", image);
  uploadData.append("name", name);
  uploadData.append("description", description);
  uploadData.append("newEmail", email);
  uploadData.append("currentPassword", currentPassword);
  uploadData.append("newPassword", newPassword);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/account_firm/update-account-firm",
      uploadData,
      { headers: { imageType: "profile" }, withCredentials: true }
    );
    console.log("Upload success:", response.data);
    return response.data;
  } catch (error) {
    return error;
  }
}
