import z from "zod";

export const RegisterUserSchema = z
  .object({
    displayName: z.string().min(4, "Username should be of minimum 4 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => !val.includes(" "), {
        message: "Password must not contain spaces",
      }),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password not matches the above password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm Password and Password doesn't match",
  });

export type RegisterFormData = z.infer<typeof RegisterUserSchema>;