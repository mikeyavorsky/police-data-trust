"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/NPDC_Logo_FINAL blue2 1.svg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import styles from "./login.module.css";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  type UserData = {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    password: string;
    password2: string;
  };

  type FormErrorMessages = {
    email: string;
    name: string;
    password: string;
  };

  const formErrorMessages: FormErrorMessages = {
    email: "Invalid Email",
    name: "Required",
    password: "Invalid Password or Do Not Match",
  };

  const [userData, setUserData] = useState<UserData>({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [formError, setFormError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const handleFormError = (data: UserData) => {
    if (data.email === "" || !data.email.includes("@")) {
      setFormError(true);
      return;
    }

    if (data.password === "") {
      setFormError(true);
    } else {
      setFormError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", userData);
    handleFormError(userData);

    if (formError) {
      console.error("Form validation failed.");
      return;
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api/v1";
    const apiUrl = `${apiBaseUrl}/auth/login`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        localStorage.setItem("access_token", data.access_token);
        alert("Login successful!");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        alert("Login failed: " + errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "84vh",
          flexDirection: "column",
        }}
      >
        <Image src={logo} alt="NPDC Logo" width={100} height={100} />
        <h1 className={styles.h1}>Login</h1>
        <form
          className={styles.form}
          noValidate
          autoComplete="on"
          onSubmit={handleSubmit}
        >
          <TextField
            required
            id="email"
            autoComplete="email"
            value={userData.email}
            label="Email"
            variant="outlined"
            sx={{ width: "100%", py: "5px" }}
            margin="dense"
            onChange={handleChange}
            error={formError}
            helperText={formError ? formErrorMessages.email : ""}
          />
          <FormControl sx={{ marginY: "5px", width: "100%" }} variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              autoComplete="new-password"
              value={userData.password}
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              error={formError}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "hide the password" : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            sx={{ width: "100%", marginY: "20px", height: "50px" }}
          >
            Login
          </Button>

          <Box sx={{  width: "100%", display: 'flex', gap: 1, flexDirection: 'column' }}>
            <Link
              href="/forgot-password"
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                display: "block",
                marginBottom: "12px",
                fontSize: "0.9rem",
              }}
            >
              Forgot password?
            </Link>

            <Box sx={{ fontWeight: "bold", fontSize: "0.95rem", marginBottom: "4px" }}>
              New to the National Police Data Coalition?
            </Box>

            <Link
              href="/register"
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontSize: "0.9rem",
              }}
            >
              Create account
            </Link>
          </Box>
        </form>
      </Box>
    </div>
  );
}
