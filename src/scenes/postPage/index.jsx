import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PostWidget from "../widgets/PostWidget";
import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import { setFriends, setPosts } from "../../state";

const PostPage = () => {
  const { postId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);
  const post = posts.find((p) => p._id === postId); // ✅ Get post from Redux
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Fetch the post if not in Redux
  useEffect(() => {
    const fetchPost = async () => {
      if (!token || post) return; // Already in Redux
      try {
        const response = await fetch(`${backendUrl}/posts/${postId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Failed: ${response.status}`);
        const data = await response.json();
        dispatch(setPosts({ posts: [data] })); // add to Redux
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchPost();
  }, [postId, token, post, dispatch, backendUrl]);

  // Fetch user's friends to sync Friend button
  useEffect(() => {
    const fetchUserFriends = async () => {
      if (!_id || !token) return;
      try {
        const response = await fetch(`${backendUrl}/users/${_id}/friends`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const friends = response.ok ? await response.json() : [];
        dispatch(setFriends({ friends: Array.isArray(friends) ? friends : [] }));
      } catch (error) {
        console.error("Error fetching friends:", error);
        dispatch(setFriends({ friends: [] }));
      }
    };
    fetchUserFriends();
  }, [_id, token, dispatch, backendUrl]);

  if (!post) return <p>Loading post...</p>;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <PostWidget
            postId={post._id}
            userId={post.userId}
            name={`${post.firstName} ${post.lastName}`}
            description={post.description}
            picturePath={post.picturePath}
            userPicturePath={post.userPicturePath}
            likes={post.likes}
            comments={post.comments}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PostPage;
