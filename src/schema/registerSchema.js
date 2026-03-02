import { path } from "framer-motion/client";
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required" })
    .min(3, { message: "Name should be at least 3 characters long" })
    .max(30, { message: "Name should be at most 30 characters long" }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email("Invalid email address"),
  password: z.string().nonempty({ message: "Password is required" }).regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  ),
  rePassword: z.string().nonempty({ message: "Confirm Password is required" }),
  gender: z.enum(["male", "female"], "Gender is required"),
  dateOfBirth: z.string().nonempty({ message: "Date of Birth is required" }),
}).refine((data) => data.password === data.rePassword, { message: "Passwords do not match" },
  path [ "rePassword" ]
);
