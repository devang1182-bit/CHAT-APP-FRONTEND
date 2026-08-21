/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styles from "./style.module.css";
import {
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegisterFormData, RegisterUserSchema } from "./sign-up.schema";
import { useAppDispatch } from "@/hooks/dispatch";
import { CustomSignUpAction } from "@/features/users/user-custom-sign-up/user-custom-sign-up.action";
import { GoogleSignInAction } from "@/features/users/user-google-sign-in/user-google-sign-in.action";

export default function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  const showSnackbar = (message: string) => {
    setSnackbar({
      open: true,
      message,
    });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
    mode: "onChange",
  });

  const handleRegister = async (data: RegisterFormData) => {
    try {
      dispatch(CustomSignUpAction(data));
      reset();
      showSnackbar("Registration successful");
      setTimeout(() => router.push("/"), 500);
    } catch (error) {
      showSnackbar("User Already Signed In");
      setTimeout(() => router.push("/auth/sign-in"), 500);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      dispatch(GoogleSignInAction());
      showSnackbar("Registration successful");
      router.push("/");
    } catch (error) {
      showSnackbar("Not able to sign in with google");
    }
  };

  return (
    <>
      <div className={styles.design}>
        <Typography
          sx={{ color: "black", fontFamily: '"Dancing Script", cursive' }}
          variant="h3"
        >
          Sign Up
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleGoogleLogin}
        >
          Sign up with Google
        </Button>

        <form onSubmit={handleSubmit(handleRegister)}>
          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Name"
            {...register("displayName")}
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
          />

          <TextField
            sx={{ mb: 2 }}
            fullWidth
            label="Email Address"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <FormControl fullWidth error={!!errors.password}>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              sx={{ mb: 2 }}
              type={showPassword ? "text" : "password"}
              {...register("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.confirmPassword}>
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              sx={{ mb: 2 }}
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
            />
            <FormHelperText>{errors.confirmPassword?.message}</FormHelperText>
          </FormControl>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Sign Up
          </Button>

          <Typography align="center" sx={{ mt: 2, color: "black" }}>
            Already have an account? <Link href="/auth/sign-up">Login</Link>
          </Typography>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
      />
    </>
  );
}
