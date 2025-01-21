import React, { useState, useEffect } from "react";
import InputForm from "./InputForm";
import DisplayEntries from "./DisplayEntries";
import Login from "./Login";
import { Box, Grid, Typography, Switch, FormControlLabel } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import SignOutButton from "./SignOutButton";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? lightTheme : darkTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: user ? "flex-start" : "center",
          alignItems: user ? "stretch" : "center",
          height: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          textAlign: user ? "left" : "center",
        }}
      >
        {!user ? (
          <Login />
        ) : (
          <Grid container sx={{ height: "100%" }}>
            <Grid
              item
              xs={3}
              sx={{
                backgroundColor: "background.paper",
                borderRight: "1px solid",
                borderColor: "divider",
                overflowY: "auto",
                height: "100vh",
              }}
            >
              <Box sx={{ padding: 2 }}>
                <Typography variant="h2" gutterBottom sx={{ textAlign: "center" , marginTop: 2}}>
                  Music Sheets
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                      fontSize: "1.25rem",
                      marginLeft: 2,
                    }}
                  >
                    Welcome, {user?.displayName || "Guest"}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDarkMode}
                        onChange={handleThemeToggle}
                        name="themeSwitch"
                        color="primary"
                      />
                    }
                    label={isDarkMode ? "Light" : "Dark"}
                  />
                </Box>
                <InputForm />
                <SignOutButton />
                <Typography variant="subtitle1" gutterBottom sx={{ textAlign: "center", marginTop : 2}}>
                  Tim Cao Sheets
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={9}
              sx={{
                overflowY: "auto", 
                height: "100vh",
              }}
            >
              <DisplayEntries />
            </Grid>
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
