"use client";

import React, { useRef, useState, useCallback } from "react";
import { Camera } from "react-camera-pro";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SwitchCameraIcon from "@mui/icons-material/SwitchCamera";

const StyledCamera = styled(Camera)(({ theme }) => ({
  width: "100%",
  height: "auto",
  [theme.breakpoints.up("sm")]: {
    height: "500px",
  },
}));

const CapturedImage = styled("img")({
  width: "100%",
  height: "auto",
  objectFit: "contain",
});

const CameraComponent = () => {
  const camera = useRef(0);
  const [image, setImage] = useState(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [facingMode, setFacingMode] = useState("environment");
  const [errorMessage, setErrorMessage] = useState("");

  const handleTakePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo);
  };

  const handleCameraSwitch = () => {
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  const handleCamerasChange = useCallback((cameras) => {
    setNumberOfCameras(cameras);
  }, []);

  const handleCloseError = () => {
    setErrorMessage("");
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <StyledCamera
          ref={camera}
          aspectRatio={16 / 9}
          facingMode={facingMode}
          numberOfCamerasCallback={handleCamerasChange}
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
            setErrorMessage(error);
            console.log(error);
          }}
        />
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CameraAltIcon />}
              onClick={handleTakePhoto}
            >
              Capture
            </Button>
          </Grid>
          {numberOfCameras > 1 && (
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

      {image && (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Captured Photo:
          </Typography>
          <CapturedImage src={image} alt="Captured" />
        </Paper>
      )}

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={errorMessage}
      />
    </Box>
  );
};

export default CameraComponent;
