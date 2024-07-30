"use client";
import { Box, Stack, Typography, Button, Modal } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  // using useState to store the pantry items
  const [pantry, setPantry] = useState([]);

  // async code does not work inside useEffect
  // so we are using a function inside useEffect
  // we are using useEffect to get pantry items from firestore
  useEffect(() => {
    const updatePantry = async () => {
      const snapshot = query(collection(firestore, "pantry"));
      const docs = await getDocs(snapshot);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push(doc.id);
      });
      setPantry(pantryList);
    };
    updatePantry();
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      gap={2}
    >
      <Box border={"2px solid #333"}>
        <Box
          width="800px"
          height="100px"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} textAlign={"center"} color={"#333"}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="500px" spacing={2} overflow={"auto"}>
          {/* map every time in the pantry array */}
          {pantry.map((i) => (
            <Box
              key={i}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              bgcolor={"lightgray"}
              color={"white"}
              fontSize={"2rem"}
            >
              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                {
                  // Captilize the first letter of the item
                  i.charAt(0).toUpperCase() + i.slice(1)
                }
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
      <Button variant="outlined" onClick={handleOpen}>
        Add New Item
      </Button>
    </Box>
  );
}
