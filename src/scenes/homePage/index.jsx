import { Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import { setFriends } from "../../state";
import { toast } from "react-toastify";

export default function HomePage() {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch user's friends when HomePage loads
  useEffect(() => {
    const fetchUserFriends = async () => {

      if (!_id || !token) return;

      try {
        const response = await fetch(`${backendUrl}/users/${_id}/friends`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const friends = await response.json();
          dispatch(setFriends({ friends: Array.isArray(friends) ? friends : [] }));
        } else {
          console.error("Failed to fetch friends:", response.status);
          toast.error("Failed to fetch friends");
          dispatch(setFriends({ friends: [] }));
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        toast.error(error.message);

        dispatch(setFriends({ friends: [] }));
      }
    };

    fetchUserFriends();
  }, [_id, token, dispatch, backendUrl]);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        {/* Left Sidebar: User Info */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>

        {/* Center: Post creation + Feed */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          {/* ✅ Fetch and render all posts */}
          <PostsWidget userId={_id} />
        </Box>

        {/* Right Sidebar: Ads and Friends */}
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0">
              <FriendListWidget userId={_id} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}