"use client";
import { AppBar, Box, Stack, Typography, Button, Toolbar } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import backgroundImage from "@/app/lemon.jpeg"; // Adjust the path as necessary
import { lightBlue } from "@mui/material/colors"; // Import lightBlue color

export default function LandingPage() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/tracker");
  };

  return (
    // Outer Box to contain the entire page
    <Box
      sx={{
        position: "relative", // Ensures the background image is positioned relative to this container
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        overflow: "hidden", // Prevents overflow of content
      }}
    >
      {/* Background Image Box */}
      <Box
        sx={{
          position: "absolute", // Positioned absolutely within the outer Box
          top: 0,
          left: 0,
          height: "100%", // Full height of the outer Box
          width: "100%", // Full width of the outer Box
          backgroundImage: `url(${backgroundImage.src})`, // Sets the background image
          backgroundSize: "cover", // Ensures the image covers the entire Box
          backgroundPosition: "center", // Centers the background image
          opacity: 0.9, // Controls the opacity of the background image
          zIndex: -1, // Places the background image behind other content
        }}
      />
      {/* AppBar for the Navbar */}
      <AppBar position="static">
        <Toolbar
          sx={{ justifyContent: "space-between", backgroundColor: "#1a237e" }}
        >
          {" "}
          {/* Space out the children elements */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            @pantryTracker
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            sx={{
              "&:hover": {
                backgroundColor: lightBlue[500], // Set the hover background color to light blue
              },
            }}
          >
            Login/Sign Up
          </Button>
        </Toolbar>
      </AppBar>
      {/* Content Box to center the main content */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh" // Full viewport height to center content vertically
      >
        <Stack spacing={2} alignItems="center">
          {" "}
          {/* Stack to space out the elements */}
          <Typography variant="h2" align="center">
            Welcome to the Pantry Tracker
          </Typography>
          <Typography variant="h6" align="center">
            A simple app to track your pantry items
          </Typography>
          <Button
            variant="contained"
            // color="#1a237e"
            onClick={handleButtonClick}
            sx={{ backgroundColor: "#1a237e" }}
          >
            Get Started
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
