import axios from "axios";
export async function passwordReset(email){
const userData = {email : email} ;
try {
    const response = await fetch("http://localhost:5000/api/resetPassword/validateEmail", {
      //from here u can choose the url u wnat in back-end
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    if (response.ok) {
      return "200";
    } else if (response.status === 404) {
      return "404";
    }
  } catch (error) {
    console.error("Network error:", error);
  }}
  export async function validateOTP(OTP,email){
    const otpS = OTP+"";
    const url = "http://localhost:5000/api/resetPassword/validateOTP";
    const userData = {otp : otpS,email : email} ;
    try {
        const response = await fetch(url, {
          //from here u can choose the url u wnat in back-end
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include",
        });
    
        if (response.ok) {
          return "200";
        } else if (response.status === 404) {
          return "404";
        }
        else if(response.status === 400){
            return "400";
        }
      } catch (error) {
        console.error("Network error:", error);
      }}

      export async function sendNewPass(email,Password,Cpassword){
        const url = "http://localhost:5000/api/resetPassword/storePassword";
        const userData = {newPassword : Password,email : email,confirmPassword:Cpassword} ;
        try {
            const response = await fetch(url, {
              //from here u can choose the url u wnat in back-end
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
              credentials: "include",
            });
        
            if (response.ok) {
              return "200";
            } else if (response.status === 404) {
              return "404";
            }
            else if(response.status === 400){
                return "400";
            }
          } catch (error) {
            console.error("Network error:", error);
          }}