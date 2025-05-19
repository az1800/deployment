import axios from "axios";

export async function listFirmChat(){
const url = "http://localhost:5000/api/direct_chat/FIRM/List-Conversation";

try{
const response = await axios.post(url,[],{withCredentials:true});
if(response.status===200)
return response.data.data;
return "400";
}catch(err){console.log("Xxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log("error",err);
    return "400";
}

}