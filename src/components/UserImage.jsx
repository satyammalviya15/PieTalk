import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // If `image` is already a full URL (Cloudinary), use it directly
  const imageUrl = image?.startsWith("http") ? image : `${backendUrl}/assets/${image}`;

  return (
    <Box width={size} height={size}>
      <img
        src={imageUrl}
        alt="user"
        style={{ width: size, height: size, objectFit: "cover", borderRadius: "50%" }}
      />
    </Box>
  );
};

export default UserImage;
