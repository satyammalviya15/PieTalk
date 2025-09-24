import { useState, useEffect } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { _id, friends: userFriends } = useSelector((state) => state.user) || {};
  const token = useSelector((state) => state.token);

  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // This should be in your login action or app initialization
const getUserFriends = async (userId, token) => {
  try {
    const response = await fetch(`${backendUrl}/users/${userId}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.ok) {
      const friends = await response.json();
      dispatch(setFriends({ friends }));
    }
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
};

  // Sync friend status
  useEffect(() => {
    if (Array.isArray(userFriends)) {
      setIsFriend(userFriends.some((f) => f._id === friendId || f.id === friendId));
    }
  }, [userFriends, friendId]);

  const patchFriend = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to update friends");

      const updatedFriends = await response.json();
      dispatch(setFriends({ friends: Array.isArray(updatedFriends) ? updatedFriends : [] }));
      setIsFriend((prev) => !prev); // Toggle icon immediately
    } catch (err) {
      console.error("Error updating friend:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexBetween>
      {/* Always show user info */}
      <FlexBetween
        gap="1rem"
        onClick={() => navigate(`/profile/${friendId}`)}
        sx={{ cursor: "pointer" }}
      >
        <UserImage image={userPicturePath || "/default-avatar.png"} size="55px" />
        <Box>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{ "&:hover": { color: palette.primary.light } }}
          >
            {name || "Unknown User"}
          </Typography>
          {subtitle && <Typography color={medium}>{subtitle}</Typography>}
        </Box>
      </FlexBetween>

      {/* Hide button only for self */}
      {_id !== friendId && (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            patchFriend();
          }}
          disabled={loading}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
