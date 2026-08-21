/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import styles from "./style.module.css";
import Snackbar from "@mui/material/Snackbar";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/dispatch";
import { LoginFormData, LoginSchema } from "./sign-in-schema";
import { CustomSignInAction } from "@/features/users/user-custom-sign-in/user-custom-sign-in.action";
import { GoogleSignInAction } from "@/features/users/user-google-sign-in/user-google-sign-in.action";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

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

  const handleLogin = async (data: LoginFormData) => {
    try {
      await dispatch(CustomSignInAction(data));
      showSnackbar("User Logged In Successfully");
      setTimeout(() => router.push("/chat"), 500);
    } catch (error) {
      showSnackbar("Invalid Username Or Password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await dispatch(GoogleSignInAction());
      showSnackbar("User Logged In Successfully");
      setTimeout(() => router.push("/"), 500);
    } catch (error) {
      showSnackbar("Google sign in failed");
    }
  };

  return (
    <>
      <div className={styles.design}>
        <Typography
          sx={{ fontFamily: '"Dancing Script", cursive' }}
          variant="h3"
        >
          Sign In
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>

        <form onSubmit={handleSubmit(handleLogin)}>
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

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Sign In
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account? <Link href="/auth/sign-up">Sign Up</Link>
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
