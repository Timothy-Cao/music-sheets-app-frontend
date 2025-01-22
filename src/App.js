import React, { useState, useEffect } from "react";
import InputForm from "./InputForm";
import DisplayEntries from "./DisplayEntries";
import Login from "./Login";
import { Box, Grid, Typography, Switch, FormControlLabel, IconButton, useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import SignOutButton from "./SignOutButton";
import MenuIcon from "@mui/icons-material/Menu";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1200px)");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
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
              xs={12}
              md={3}
              sx={{
                backgroundColor: "background.paper",
                borderRight: "1px solid",
                borderColor: "divider",
                overflowY: "auto",
                height: "100vh",
                display: isSmallScreen ? (isSidebarOpen ? "block" : "none") : "block",
                position: isSmallScreen ? "absolute" : "relative",
                zIndex: 2,
                width: isSmallScreen ? "300px" : "auto",
              }}
            >
              <Box sx={{ padding: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontSize: "1rem", marginBottom: 0 }}>
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
                    sx={{
                      "& .MuiFormControlLabel-label": { fontSize: "1rem", marginLeft: 0 },
                      margin: 0,
                      padding: 0,
                      alignItems: "center",
                    }}
                  />
                </Box>
                <br />
                <InputForm />
                <SignOutButton />
                <Typography variant="subtitle1" gutterBottom sx={{ textAlign: "center", marginTop: 2 }}>
                  Tim Cao Sheets
                </Typography>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={9}
              sx={{
                overflowY: "auto",
                height: "100vh",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 2,
                  position: "sticky",
                  top: 0,
                  backgroundColor: "background.default",
                  zIndex: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  Music Sheets
                </Typography>

                {isSmallScreen && (
                  <IconButton onClick={toggleSidebar}>
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ padding: 2 }}>
                <DisplayEntries isSmallScreen={isSmallScreen} />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;