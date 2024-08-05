"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  AppBar,
  Toolbar,
  Snackbar,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import React from "react";
import backgroundImage from "@/app/lemon.jpeg"; // Adjust the path as necessary
import { useRouter } from "next/navigation";
import CameraComponent from "./camera";
import { lightBlue } from "@mui/material/colors";
import imageProcess from "./services/imageProcess";
import { fetchOpenAIResponse } from "./services/openAIHandler";

export default function Home() {
  // State for storing pantry items
  const [pantry, setPantry] = useState([]);

  // State for controlling the modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // State for controlling the camera modal
  const [cameraOpen, setCameraOpen] = useState(false);
  const handleCameraOpen = () => setCameraOpen(true);
  const handleCameraClose = () => setCameraOpen(false);

  // State for new item name
  const [itemName, setItemName] = useState("");

  // State for search term
  const [searchItem, setSearchItem] = useState("");

  // state to store captured image
  const [capturedImage, setCapturedImage] = useState(null);

  // State for snackbar
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  // function to handle feature not available
  const handleFeatureNotAvailable = () => {
    setIsSnackbarOpen(true);
  };
  // function to close snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  // function to handle camera capture
  const handleImageCapture = async (image) => {
    setCapturedImage(image);
    console.log("captured image:", image); // IMAGE IS A BASE64 STRING
    // const description = await fetchOpenAIResponse(image); // I WANT TO USE THIS FUNCTION TO GET DESCRIPTION BACK BUT HOW CAN I MAKE IT SERVER SIDE
    // console.log("here is result:", description);
  };

  // Function to fetch and update pantry items
  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  // Fetch pantry items on component mount
  useEffect(() => {
    updatePantry();
  }, []);

  // Function to handle pantry item search
  const searchPantry = async (item) => {
    const snapshot = await getDocs(collection(firestore, "pantry"));
    const pantryList = [];
    snapshot.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });

    // Filter items that contain the search term
    const filteredPantry = pantryList.filter((pantryItem) =>
      pantryItem.name.toLowerCase().includes(item.toLowerCase())
    );

    setPantry(filteredPantry);
  };

  // Function to add a new item or increase its count
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  // Function to remove an item or decrease its count
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count > 1) {
        await setDoc(docRef, { count: count - 1 });
      } else {
        await deleteDoc(docRef);
      }
    }
    await updatePantry();
  };

  // Function to handle quantity change
  const handleQuantityChange = async (name, newCount) => {
    const docRef = doc(collection(firestore, "pantry"), name);
    await setDoc(docRef, { count: newCount });
    await updatePantry();
  };

  const router = useRouter();

  const handleHomeButton = () => {
    router.push("/");
  };

  // Styles for the modal
  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  };

  // Define a dark color for the navbar and header
  const darkColor = "#1a237e"; // You can adjust this color as needed

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Background image container */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundImage: `url(${backgroundImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
          zIndex: 0,
          pointerEvents: "none", // Prevents the background from blocking interactions
        }}
      />

      {/* AppBar for the Navbar */}
      <AppBar position="static" sx={{ backgroundColor: darkColor }}>
        <Toolbar
          sx={{ justifyContent: "space-between", backgroundColor: darkColor }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            @pantryTracker
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleHomeButton}
              sx={{
                borderColor: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Go Home
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              sx={{
                borderColor: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Profile
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content container */}
      <Box
        sx={{
          width: "100vw",
          height: "calc(100vh - 64px)", // Adjust for AppBar height
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
          zIndex: 1,
          padding: 3,
        }}
      >
        {/* Pantry Items container */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            // backgroundColor: "rgba(0, 0, 0)",
            backgroundColor: "rgba(255, 255, 255, 0.5)", // Increased transparency
            backdropFilter: "blur(10px)", // Add blur effect
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.7)",
          }}
        >
          {/* Pantry Items header */}
          <Box
            sx={{
              bgcolor: darkColor,
              padding: 2,
            }}
          >
            <Typography
              variant="h4"
              textAlign="center"
              color="#fff"
              fontWeight="bold"
            >
              Pantry Items
            </Typography>
          </Box>

          {/* Search bar container */}
          <Box
            sx={{
              // bgcolor: "#f5f5f5",
              bgcolor: "rgba(245, 245, 245, 0.7)", // Semi-transparent background
              padding: 2,
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              id="filled-search"
              label="Search items"
              type="search"
              variant="outlined"
              value={searchItem}
              onChange={(e) => {
                if (e.target.value === "") {
                  updatePantry();
                }
                setSearchItem(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchPantry(searchItem);
                }
              }}
              fullWidth
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)", // Make TextField more visible
              }}
            />
            <Button
              variant="contained"
              onClick={() => searchPantry(searchItem)}
              sx={{
                bgcolor: darkColor,
                "&:hover": {
                  bgcolor: "#303f9f", // Slightly lighter shade for hover
                },
              }}
            >
              Search
            </Button>
          </Box>

          {/* Pantry items list */}
          <Stack
            sx={{
              height: 400,
              overflow: "auto",
              padding: 2,
            }}
            spacing={2}
          >
            {pantry.map(({ name, count }) => (
              <Box
                key={name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  // bgcolor: "white",
                  bgcolor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
                  padding: 2,
                  borderRadius: 1,
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h6" color="#333">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    type="number"
                    value={count}
                    variant="outlined"
                    onChange={(e) =>
                      handleQuantityChange(name, parseInt(e.target.value))
                    }
                    inputProps={{ min: 0 }}
                    sx={{ width: "80px" }}
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeItem(name)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Modal for adding new items */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Insert Pantry Item
            </Typography>
            <Stack width={"100%"} spacing={2} direction={"row"}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addItem(itemName);
                    setItemName("");
                    handleClose();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  handleClose();
                  setItemName("");
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: lightBlue[50],
                  },
                }}
              >
                Add
              </Button>
            </Stack>
            <Button
              variant="outlined"
              onClick={handleFeatureNotAvailable}
              sx={{
                "&:hover": {
                  backgroundColor: lightBlue[50],
                },
              }}
            >
              Attach Image for Item
            </Button>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              open={isSnackbarOpen}
              autoHideDuration={2000}
              onClose={handleSnackbarClose}
              message="Feature to be released soon!"
              ContentProps={{
                sx: {
                  backgroundColor: "lightcoral", // Light red color
                },
              }}
            />
          </Box>
        </Modal>

        {/* Modal for camera */}
        <Modal
          open={cameraOpen}
          onClose={handleCameraClose}
          aria-labelledby="camera-modal-title"
          aria-describedby="camera-modal-description"
        >
          <Box sx={{ textAlign: "center" }}>
            <CameraComponent onImageCapture={handleImageCapture} />

            <Button
              variant="contained"
              onClick={handleFeatureNotAvailable}
              sx={{
                marginTop: 1,
                display: "block", // ensures the button is displayed as a block element
                marginLeft: "auto", // aligns the button to the center horizontally
                marginRight: "auto", // aligns the button to the center horizontally
              }}
            >
              Insert Pantry Item
            </Button>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              open={isSnackbarOpen}
              autoHideDuration={2000}
              onClose={handleSnackbarClose}
              message="Feature to be released soon!"
              ContentProps={{
                sx: {
                  backgroundColor: "lightcoral", // Light red color
                },
              }}
            />
          </Box>
        </Modal>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Button to open the "Add New Item" modal */}
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              marginTop: 2,
              bgcolor: darkColor,
              "&:hover": {
                bgcolor: "#303f9f", // Slightly lighter shade for hover
              },
            }}
          >
            Add New Item
          </Button>
          <Button
            variant="contained"
            onClick={handleCameraOpen}
            sx={{
              marginTop: 2,
              bgcolor: darkColor,
              "&:hover": {
                bgcolor: "#303f9f", // Slightly lighter shade for hover
              },
            }}
          >
            Upload with Image
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
