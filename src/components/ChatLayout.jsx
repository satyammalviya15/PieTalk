import { useState, useEffect, useRef } from "react";
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
  IconButton,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CallIcon from "@mui/icons-material/Call";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useTheme } from "@mui/material/styles";

const ChatLayout = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user?._id);

  const [socket, setSocket] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const sidebarBg = isDarkMode ? "#1e1e1e" : "#f5f5f5";
  const chatBg = isDarkMode ? "#121212" : "#fff";
  const inputBg = isDarkMode ? "#1e1e1e" : "#fff";
  const myMsgBg = "#1976d2";
  const friendMsgBg = isDarkMode ? "#333" : "#e0e0e0";
  const textColor = isDarkMode ? "#fff" : "#000";
  const secondaryTextColor = isDarkMode ? "#ccc" : "#555";

  // Fetch friends list
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

  // Fetch messages with a friend
  const fetchMessages = async (friendId) => {
    if (!friendId) return;
    try {
      const res = await fetch(`${backendUrl}/messages/${userId}/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages((prev) => ({
        ...prev,
        [friendId]: data.map((msg) => ({
          sender: msg.sender === userId ? "me" : "friend",
          text: msg.message,
        })),
      }));
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Setup socket connection
  useEffect(() => {
    if (!backendUrl || !userId) return;
    const newSocket = io(backendUrl, {
      query: { userId },
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("receiveMessage", ({ from, text }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        if (!updated[from]) updated[from] = [];
        updated[from].push({ sender: "friend", text });
        return updated;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [backendUrl, userId]);

  useEffect(() => {
    getFriends();
  }, [userId, token]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedFriend]);

  const handleSend = async () => {
    if (!input.trim() || !selectedFriend) return;

    const messageData = {
      sender: userId,
      receiver: selectedFriend._id,
      message: input,
    };

    // Update UI immediately
    setMessages((prev) => {
      const friendId = selectedFriend._id;
      const newMessages = { ...prev };
      if (!newMessages[friendId]) newMessages[friendId] = [];
      newMessages[friendId].push({ sender: "me", text: input });
      return newMessages;
    });

    // Store message in backend
    try {
      await fetch(`${backendUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }

    // Emit message to socket
    socket?.emit("sendMessage", { to: selectedFriend._id, text: input });
    setInput("");
  };

  const handleBack = () => setSelectedFriend(null);

  // When a friend is selected, fetch chat history
  useEffect(() => {
    if (selectedFriend) fetchMessages(selectedFriend._id);
  }, [selectedFriend]);

  // Mobile: Friends list
  if (!isNonMobileScreens && !selectedFriend) {
    return (
      <Box height="80vh" border={`1px solid ${isDarkMode ? "#333" : "#ddd"}`} borderRadius="8px" overflow="hidden">
        <Box width="100%" bgcolor={sidebarBg} overflow="auto">
          <Typography variant="h6" m={2} color={textColor}>
            Friends
          </Typography>
          <Divider sx={{ borderColor: isDarkMode ? "#333" : "#ddd" }} />
          <List>
            {friends.map((friend) => (
              <ListItem button key={friend._id} onClick={() => setSelectedFriend(friend)}>
                <ListItemAvatar>
                  <Avatar
                    src={
                      friend.picturePath
                        ? `${backendUrl}/assets/${friend.picturePath}`
                        : "/default-avatar.png"
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`${friend.firstName || ""} ${friend.lastName || ""}`}
                  primaryTypographyProps={{ color: textColor }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    );
  }

  return (
    <Box display="flex" height="80vh" border={`1px solid ${isDarkMode ? "#333" : "#ddd"}`} borderRadius="8px" overflow="hidden">
      {/* Sidebar for desktop */}
      {isNonMobileScreens && (
        <Box width="30%" bgcolor={sidebarBg} overflow="auto">
          <Typography variant="h6" m={2} color={textColor}>
            Friends
          </Typography>
          <Divider sx={{ borderColor: isDarkMode ? "#333" : "#ddd" }} />
          <List>
            {friends.map((friend) => (
              <ListItem
                button
                key={friend._id}
                onClick={() => setSelectedFriend(friend)}
                selected={selectedFriend?._id === friend._id}
              >
                <ListItemAvatar>
                  <Avatar
                    src={
                      friend.picturePath
                        ? `${backendUrl}/assets/${friend.picturePath}`
                        : "/default-avatar.png"
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`${friend.firstName || ""} ${friend.lastName || ""}`}
                  primaryTypographyProps={{ color: textColor }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Chat Panel */}
      <Box flex="1" display="flex" flexDirection="column" bgcolor={chatBg}>
        {selectedFriend ? (
          <>
            {/* Header */}
            <Box
              p={2}
              bgcolor={sidebarBg}
              borderBottom={`1px solid ${isDarkMode ? "#333" : "#ddd"}`}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap="1rem">
                {!isNonMobileScreens && (
                  <IconButton onClick={handleBack} sx={{ color: textColor }}>
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <Avatar
                  src={
                    selectedFriend.picturePath
                      ? `${backendUrl}/assets/${selectedFriend.picturePath}`
                      : "/default-avatar.png"
                  }
                />
                <Typography variant="h6" color={textColor}>
                  {`${selectedFriend.firstName || ""} ${selectedFriend.lastName || ""}`}
                </Typography>
              </Box>
              <Box>
                <IconButton sx={{ color: isDarkMode ? "#fff" : "#000" }}>
                  <VideoCallIcon />
                </IconButton>
                <IconButton sx={{ color: isDarkMode ? "#fff" : "#000" }}>
                  <CallIcon />
                </IconButton>
                <IconButton sx={{ color: isDarkMode ? "#fff" : "#000" }}>
                  <InfoOutlinedIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Messages */}
            <Box flex="1" p={2} overflow="auto">
              {(messages[selectedFriend._id] || []).map((msg, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  justifyContent={msg.sender === "me" ? "flex-end" : "flex-start"}
                  mb={1}
                >
                  <Box
                    bgcolor={msg.sender === "me" ? myMsgBg : friendMsgBg}
                    color={msg.sender === "me" ? "#fff" : textColor}
                    px={2}
                    py={1}
                    borderRadius="12px"
                  >
                    {msg.text}
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box p={2} display="flex" borderTop={`1px solid ${isDarkMode ? "#333" : "#ddd"}`}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                sx={{
                  bgcolor: inputBg,
                  input: { color: textColor },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDarkMode ? "#333" : "#ccc",
                  },
                }}
              />
              <IconButton color="primary" onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          !isNonMobileScreens && (
            <Box flex="1" display="flex" alignItems="center" justifyContent="center" color={secondaryTextColor}>
              <Typography>Please select a friend to start chatting</Typography>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default ChatLayout;
