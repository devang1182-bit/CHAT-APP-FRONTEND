import z from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(8, "Password should be of 8 characters"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;