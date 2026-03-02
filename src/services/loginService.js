import axios from "axios";

export async function sendLoginData(dataForm) {
  const { data } = await axios.post(
    "https://route-posts.routemisr.com/users/signin",
    dataForm,
  );
  return data;
}
