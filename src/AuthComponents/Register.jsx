import React from "react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { RadioGroup, Radio } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { sendRegisterData } from "../services/registerService.js";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "../schema/registerSchema.js";

export default function Register() {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  let navigate = useNavigate();
  async function onSubmitForm(data) {
    setError(false);
    setLoading(false);
    try {
      let respone = await sendRegisterData(data);
      setLoading(true);
      navigate("/auth/login");
    } catch (error) {
      setError(error);
    }
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      gender: "",
      dateOfBirth: "",
    },
    mode: "blur",
  });
  return (
    <>
      <section>
        <div className="m-12 max-w-100 md:max-w-1/3 lg:max-w-1/2 mx-auto ">
          <h1 className="text-center font-bold text-4xl text-purple-800">
            Register Now
          </h1>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            action=""
            className="bg-white shadow-2xl p-12 rounded-sm flex flex-col gap-4 "
          >
            <Input
              label="Name*"
              variant="bordered"
              // placeholder="Enter your Name"
              type="text"
              {...register("name")}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
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
              label="Date Of Birth*"
              variant="bordered"
              // placeholder="Enter your phone"
              type="date"
              {...register("dateOfBirth")}
              required
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm">
                {errors.dateOfBirth.message}
              </p>
            )}
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} label="gender">
                  <Radio value="male">male</Radio>
                  <Radio value="female">female</Radio>
                </RadioGroup>
              )}
            />

            {errors.gender && (
              <p className="text-red-500">{errors.gender.message}</p>
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
            <Input
              label="Confirm Password*"
              variant="bordered"
              // placeholder="Enter your password"
              type="password"
              {...register("rePassword")}
              required
            />
            {errors.rePassword && (
              <p className="text-red-500 text-sm">
                {errors.rePassword.message}
              </p>
            )}

            <Button
              color="secondary"
              className="mt-6 text-center w-1/2 mx-auto"
              type="submit"
              isLoading={isSubmitting}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
