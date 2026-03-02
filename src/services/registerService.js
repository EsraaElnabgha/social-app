import axios from "axios";
import { BaseUrl } from "../env/env.environment";

export async function sendRegisterData(dataForm) {
    const { data } = await axios.post(
      "https://route-posts.routemisr.com/users/signup",
      dataForm,
    );
    return data;
}