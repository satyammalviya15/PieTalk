import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import UserWidget from "../widgets/UserWidget";
import PostsWidget from "../widgets/PostsWidget";
import { setFriends } from "../../state";

export default function ProfilePage() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [profileUser, setProfileUser] = useState(null);
  const { userId } = useParams(); // profile being viewed
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const dispatch = useDispatch();

  const isOwnProfile = loggedInUser?._id === userId;

  useEffect(() => {
    const fetchProfileAndFriends = async () => {
      if (!token || !userId || !loggedInUser?._id) return;

      try {
        // Fetch profile user info
        const profileResp = await fetch(`${backendUrl}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileResp.ok) {
          const data = await profileResp.json();
          setProfileUser(data);
        } else {
          setProfileUser(null);
        }

        // Fetch logged-in user's friends to sync Friend button
        const friendsResp = await fetch(`${backendUrl}/users/${loggedInUser._id}/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (friendsResp.ok) {
          const friends = await friendsResp.json();
          dispatch(setFriends({ friends: Array.isArray(friends) ? friends : [] }));
        } else {
          dispatch(setFriends({ friends: [] }));
        }
      } catch (err) {
        console.error("Error fetching profile or friends:", err);
        setProfileUser(null);
        dispatch(setFriends({ friends: [] }));
      }
    };

    fetchProfileAndFriends();
  }, [userId, token, loggedInUser?._id, dispatch, backendUrl]);

  if (!profileUser || !loggedInUser) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        {/* Left Sidebar: Profile Info */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            userId={userId}
            picturePath={profileUser.picturePath}
            hideFriendButton={isOwnProfile} // hide Add Friend if own profile
          />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>

        {/* Center: Posts */}
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={loggedInUser.picturePath} />
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
}
