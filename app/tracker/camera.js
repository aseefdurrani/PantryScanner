"use client"; // indicates that the component uses client-side rendering only in Next.js.

import React, { useRef, useState, useCallback } from "react";
import { Camera } from "react-camera-pro"; // Importing Camera component from react-camera-pro package
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  Snackbar, // Importing various UI components from MUI
} from "@mui/material";
import { styled } from "@mui/system"; // Import for styling components using MUI system
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Camera icon for the button
import SwitchCameraIcon from "@mui/icons-material/SwitchCamera"; // Icon for switching the camera

// Styling for the Camera component that ensures it takes full width and appropriate height
const StyledCamera = styled(Camera)(({ theme }) => ({
  width: "100%",
  height: "auto",
  [theme.breakpoints.up("sm")]: {
    height: "500px",
  },
}));

// Styling for the image displayed after capture
const CapturedImage = styled("img")({
  width: "100%",
  height: "auto",
  objectFit: "contain",
});

const CameraComponent = ({ onImageCapture }) => {
  const camera = useRef(0); // Reference to the camera component
  const [image, setImage] = useState(null); // State for storing the captured image
  const [numberOfCameras, setNumberOfCameras] = useState(0); // State to keep track of available camera devices
  const [facingMode, setFacingMode] = useState("environment"); // State to toggle camera facing mode
  const [errorMessage, setErrorMessage] = useState(""); // State to store any camera-related error messages

  // Function to capture a photo
  const handleTakePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo); // Set the captured photo to state
    onImageCapture(photo); // Call the callback function with the captured photo
  };

  // Function to switch between front and rear camera
  const handleCameraSwitch = () => {
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  // Callback to update the number of available cameras
  const handleCamerasChange = useCallback((cameras) => {
    setNumberOfCameras(cameras);
  }, []);

  // Function to clear error messages
  const handleCloseError = () => {
    setErrorMessage("");
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", p: 2 }}>
      {" "}
      {/* // Styling for the container */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        {" "}
        {/* // Container for the camera UI */}
        <StyledCamera
          ref={camera} // Connect the ref
          aspectRatio={16 / 9} // Set camera aspect ratio
          facingMode={facingMode} // Set the current camera mode (front/back)
          numberOfCamerasCallback={handleCamerasChange} // Monitor changes in available cameras
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Permission denied. Please refresh and give camera permission.",
            switchCamera:
              "It is not possible to switch camera to different one because there is only one video device accessible.",
            canvas: "Canvas is not supported.",
          }}
          onError={(error) => {
            setErrorMessage(error); // Handle error by setting state
            console.log(error); // Log error for debugging
          }}
        />
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CameraAltIcon />}
              onClick={handleTakePhoto} // Attach function to capture button
            >
              Capture
            </Button>
          </Grid>
          {numberOfCameras > 1 && ( // Display switch camera icon only if multiple cameras are available
            <Grid item>
              <IconButton
                color="primary"
                onClick={handleCameraSwitch}
                aria-label="switch camera"
              >
                <SwitchCameraIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Paper>
      {image && ( // Conditional rendering for the captured image display
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Captured Photo:
          </Typography>
          <CapturedImage src={image} alt="Captured" />
        </Paper>
      )}
      <Snackbar // UI component for displaying error messages
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={errorMessage}
      />
    </Box>
  );
};

export default CameraComponent; // Export the component
