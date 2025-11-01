import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),

    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ChangePasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name cannot be empty" })
    .max(50, { message: "Name must be under 50 characters" }),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }),
});

export {
  SignupSchema,
  LoginSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  ForgotPasswordSchema,
};
