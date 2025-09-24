import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook
import Form from "./Form";

export default function LoginPage() {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header */}
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: theme.palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              p: 0,
              m: 0,
              fontSize: 50,
              mr: 0.5,
              color: "primary.main",
              fontFamily: "serif",
              lineHeight: 1, // Reduce extra vertical spacing
            }}
          >
            &pi;
          </Box>
          Talk
        </Typography>
      </Box>

      {/* Login Form Section */}
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to PieTalk, The Social Talk Media for Sociopaths!
        </Typography>

        <Form /> {/* ✅ Correct usage of Form */}
      </Box>
    </Box>
  );
}
