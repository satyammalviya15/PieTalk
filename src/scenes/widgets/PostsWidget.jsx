import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts) || [];
  const token = useSelector((state) => state.token);

  // ✅ Fetch all posts
  const getPosts = async () => {
    try {
      const response = await fetch(`${backendUrl}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);
      const data = await response.json();

      const postsArray = Array.isArray(data) ? data : data.posts;
      dispatch(setPosts({ posts: postsArray || [] }));
    } catch (err) {
      console.error("Error fetching posts:", err);
      dispatch(setPosts({ posts: [] }));
    }
  };

  // ✅ Fetch posts for a specific user
  const getUserPosts = async () => {
    try {
      const response = await fetch(`${backendUrl}/posts/${userId}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok)
        throw new Error(`Failed to fetch user posts: ${response.status}`);
      const data = await response.json();

      const postsArray = Array.isArray(data) ? data : data.posts;
      dispatch(setPosts({ posts: postsArray || [] }));
    } catch (err) {
      console.error("Error fetching user posts:", err);
      dispatch(setPosts({ posts: [] }));
    }
  };

  useEffect(() => {
    if (!token) return; // ✅ Prevent fetch if token is missing
    if (isProfile && userId) {
      getUserPosts();
    } else {
      getPosts();
    }
    // ✅ backendUrl is constant from env, no need to include in deps
  }, [isProfile, userId, token]); 

  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <>
      {posts.map(
        ({
          _id,
          userId: postUserId,
          firstName,
          lastName,
          description,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            userId={postUserId}
            name={`${firstName} ${lastName}`}
            description={description}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
