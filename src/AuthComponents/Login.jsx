import React, { useContext } from "react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { sendLoginData } from "../services/loginService.js";
import { useNavigate, Link } from "react-router-dom";
import { tokenContext } from "../Context/TokenContext.jsx";

export default function Login() {
  let { setToken } = useContext(tokenContext);
  let [ isError, setError ] = useState(false);
  let [ isLoading, setLoading ] = useState(false);
  let navigate = useNavigate();
  async function onSubmitForm(data) {
    setError(false);
    setLoading(false);
    try {
      let response = await sendLoginData(data);
      setLoading(true);
      setToken(response.data.token);
      navigate("/");

    } catch (error) {
      setError(error);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "blur",
  });
  return (
    <>
      <section>
        <div className="m-12 max-w-100 md:max-w-1/3 lg:max-w-1/2 mx-auto ">
          <h1 className="text-center font-bold text-4xl text-purple-800">
            Login Now
          </h1>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            action=""
            className="bg-white shadow-2xl p-12 rounded-sm flex flex-col gap-4 "
          >
            <Input
              label="Email*"
              variant="bordered"
              // placeholder="Enter your email"
              type="email"
              {...register("email")}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <Input
              label="Password*"
              variant="bordered"
              // placeholder="Enter your password"
              type="password"
              {...register("password")}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <Button
              color="secondary"
              className="mt-6 text-center w-1/2 mx-auto"
              type="submit"
            >
              Log In
            </Button>
          </form>
          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-purple-700 font-semibold hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </section>{" "}
    </>
  );
}
