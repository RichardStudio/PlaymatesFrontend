import React, { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { getMessages } from "../api";

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getMessages();
        setChats(Array.isArray(data.chats) ? data.chats : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return <div>Loading chats...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Your Chats
      </Typography>

      <List>
        {chats.map((chat) => (
          <ListItem key={chat.other_user_id} button component={Link} to={`/chat/${chat.other_user_id}`}>
            <ListItemText
              primary={chat.other_username}
              secondary={
                <>
                  <strong>Last Message:</strong> {chat.last_message} ({new Date(chat.last_message_time).toLocaleString()})
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default MessagesPage;