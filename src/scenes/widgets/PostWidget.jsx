// PostWidget.jsx
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  ContentCopyOutlined,
  WhatsApp,
  Facebook,
  Twitter,
  Email,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  InputBase,
  useTheme,
  Popover,
  Tooltip,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { setPost } from "../../state";

const PostWidget = ({
  postId,
  userId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes = {},
  comments: initialComments = [],
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const postImageUrl = picturePath?.startsWith("http")
  ? picturePath
  : `${backendUrl}/assets/${picturePath}`;
  const [isComments, setIsComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments); // ✅ Local state to reflect updates

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);

  const isLiked = loggedInUserId ? Boolean(likes[loggedInUserId]) : false;
  const likedCount = likes ? Object.keys(likes).length : 0;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const postLink = `${window.location.origin}/posts/${postId}`;

  // Like post
  const patchLike = async () => {
    try {
      const response = await fetch(`${backendUrl}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await fetch(`${backendUrl}/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          comment: newComment,
        }),
      });
      const updatedPost = await response.json();

      // ✅ Update local comments state
      setComments(updatedPost.comments);

      // Optional: update redux store as well
      dispatch(setPost({ post: updatedPost }));

      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Share popover
  const handleShareClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postLink).then(() => setCopied(true));
    setTimeout(() => setCopied(false), 2000);
    handleClose();
  };
  const open = Boolean(anchorEl);
  const shareUrls = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(postLink)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postLink)}`,
    email: `mailto:?subject=Check this post&body=${encodeURIComponent(postLink)}`,
  };

  return (
    <WidgetWrapper m="2rem 0">
      {/* Friend Info */}
      <Friend
        friendId={userId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />

      {/* Description */}
      {description && (
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
      )}

      {/* Post Image */}
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="Post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={postImageUrl}
          loading="lazy"
        />
      )}

      {/* Actions */}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          {/* Like */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likedCount}</Typography>
          </FlexBetween>

          {/* Comments toggle */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {/* Share */}
        <Box>
          <IconButton onClick={handleShareClick}>
            <ShareOutlined />
          </IconButton>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Box p={2} display="flex" flexDirection="column" gap="1rem">
              <Typography variant="subtitle2">Share this post</Typography>
              <FlexBetween gap="0.5rem">
                <Tooltip title="WhatsApp">
                  <IconButton component="a" href={shareUrls.whatsapp} target="_blank">
                    <WhatsApp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Facebook">
                  <IconButton component="a" href={shareUrls.facebook} target="_blank">
                    <Facebook />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Twitter">
                  <IconButton component="a" href={shareUrls.twitter} target="_blank">
                    <Twitter />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Email">
                  <IconButton component="a" href={shareUrls.email} target="_blank">
                    <Email />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy Link">
                  <IconButton onClick={handleCopyLink}>
                    <ContentCopyOutlined />
                  </IconButton>
                </Tooltip>
              </FlexBetween>
              {copied && (
                <Typography color="primary" variant="caption">
                  Link copied to clipboard!
                </Typography>
              )}
            </Box>
          </Popover>
        </Box>
      </FlexBetween>

      {/* Comments Section */}
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${postId}-comment-${i}`} mb="0.5rem">
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                <strong>{comment.userName || "User"}:</strong> {comment.text}
              </Typography>
            </Box>
          ))}
          <Divider />
          {/* Add Comment */}
          <Box display="flex" alignItems="center" gap="0.5rem" mt="0.5rem">
            <InputBase
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                flex: 1,
                backgroundColor: palette.neutral.light,
                borderRadius: "1rem",
                padding: "0.5rem 1rem",
              }}
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              Post
            </Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
