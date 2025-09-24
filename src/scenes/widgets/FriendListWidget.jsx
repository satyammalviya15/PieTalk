import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  TextField,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FriendListWidget = ({ userId }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ✅ Use MUI theme for dark/light mode detection
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Dynamic colors for dark and light mode
  const textColor = isDarkMode ? "#fff" : "#000";
  const sidebarBg = isDarkMode ? "#1e1e1e" : "#f5f5f5";
  const dividerColor = isDarkMode ? "#333" : "#ddd";
  const inputBg = isDarkMode ? "#121212" : "#fff";

  const getFriends = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${backendUrl}/users/${userId}/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch friends");
      const data = await res.json();
      setFriends(data || []);
    } catch (err) {
      console.error("Error fetching friends:", err);
      setFriends([]);
    }
  };

  useEffect(() => {
    getFriends();
    // ✅ Re-fetch when userId or global friend count changes
  }, [userId, token, loggedInUser?.friends?.length]);

  const filteredFriends = friends.filter((friend) =>
    `${friend.firstName} ${friend.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleNavigate = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

  return (
    <Box
      bgcolor={sidebarBg}
      p={2}
      borderRadius="8px"
      sx={{
        transition: "background-color 0.3s ease",
      }}
    >
      <Typography variant="h6" mb={1} color={textColor}>
        Friends
      </Typography>

      {/* Search box */}
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Search friends..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            color: textColor,
            "& fieldset": { borderColor: dividerColor },
            "&:hover fieldset": { borderColor: isDarkMode ? "#666" : "#999" },
          },
          input: { color: textColor },
          bgcolor: inputBg,
        }}
      />

      <Divider sx={{ borderColor: dividerColor, mb: 1 }} />

      {/* Friends List */}
      <List>
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <ListItem
              key={friend._id}
              button
              onClick={() => handleNavigate(friend._id)}
              sx={{
                "&:hover": {
                  backgroundColor: isDarkMode ? "#2a2a2a" : "#eee",
                  transition: "background-color 0.2s ease",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={
                    friend.picturePath
                      ? `${backendUrl}/assets/${friend.picturePath}`
                      : "/default-avatar.png"
                  }
                  alt={`${friend.firstName} ${friend.lastName}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${friend.firstName} ${friend.lastName}`}
                primaryTypographyProps={{ color: textColor }}
              />
            </ListItem>
          ))
        ) : (
          <Typography color={textColor} align="center" mt={2}>
            No friends found
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default FriendListWidget;
