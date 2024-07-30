import { Box, Stack } from "@mui/material";

const items = ['food stuff', 'tomato', 'cucumber', 'onion', 'snacks']

export default function Home() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
    <Stack width="800px" height="600px"></Stack>
    </Box>
  );
}
