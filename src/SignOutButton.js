import React from "react";
import { Button, useTheme } from "@mui/material";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const SignOutButton = () => {
  const theme = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out.");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      onClick={handleSignOut}
      sx={{
        marginTop: 2,
        width: "100%",
        bgcolor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        "&:hover": {
          bgcolor: theme.palette.error.dark,
        },
      }}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
