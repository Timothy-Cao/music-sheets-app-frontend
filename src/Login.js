import React from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signInAnonymously, signOut } from "firebase/auth";

const Login = ({ user }) => {
  const theme = useTheme();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      console.log("User signed in anonymously:", user);
    } catch (error) {
      console.error("Error during anonymous sign-in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out.");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        textAlign: "center",
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Sign in to access Music Sheets Reservoir
      </Typography>

      {!user ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoogleSignIn}
            sx={{ margin: 1, width: "220px", fontSize: "1rem" }}
          >
            Sign in with Google
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleAnonymousSignIn}
            sx={{
              margin: 1,
              width: "220px",
              fontSize: "1rem",
              borderWidth: "2px",
            }}
          >
            Sign in Anonymously
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          color="error"
          onClick={handleSignOut}
          sx={{ margin: 1, width: "220px", fontSize: "1rem" }}
        >
          Sign Out
        </Button>
      )}
    </Box>
  );
};

export default Login;
