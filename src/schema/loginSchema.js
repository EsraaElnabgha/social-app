import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email("Invalid email address"),
  password: z.string().nonempty({ message: "Password is required" }),
});
