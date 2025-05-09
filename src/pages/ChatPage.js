import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Typography, List, ListItem, TextField, Button, Box } from "@mui/material";
import { getChatHistory } from "../api";

const ChatPage = () => {
  const { id } = useParams(); // ID собеседника
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null); // Информация о собеседнике
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Подключаемся к WebSocket
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const wsUrl = `ws://localhost:8080/ws?token=${token}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // Обработчик успешного подключения
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    // Обработчик получения новых сообщений
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.sender_id == id || message.receiver_id == id) {
            setMessages((prevMessages) => [...prevMessages, message]);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    // Обработчик ошибок
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Обработчик закрытия соединения
    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Загружаем историю сообщений и информацию о пользователе
    const fetchMessages = async () => {
      try {
        const data = await getChatHistory(id);
        setMessages(Array.isArray(data.messages) ? data.messages : []);
        setUser(data.user); // Сохраняем информацию о собеседнике
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      socket.close();
    };
  }, [id]);

  useEffect(() => {
    // Прокручиваем список сообщений вниз при обновлении
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    try {
      const message = {
        sender_id: JSON.parse(localStorage.getItem("user")).id,
        receiver_id: parseInt(id),
        msg: newMessage,
      };

      setMessages((prevMessages) => [...prevMessages, message]);

      // Отправляем сообщение через WebSocket
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.error("WebSocket is not open");
      }

      // Очищаем поле ввода
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) {
    return <div>Loading chat...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Box sx={{ padding: "20px", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Typography variant="h4" gutterBottom>
        Chat with {user.username}
      </Typography>


      {/* Список сообщений */}
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {messages.map((msg) => (
          <ListItem key={msg.id}>
            <Typography
              sx={{
                alignSelf: msg.sender_id === JSON.parse(localStorage.getItem("user")).id ? "flex-end" : "flex-start",
                backgroundColor: msg.sender_id === JSON.parse(localStorage.getItem("user")).id ? "#DCF8C6" : "#ECECEC",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "70%",
              }}
            >
              {msg.msg}
            </Typography>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>

      {/* Форма для отправки сообщений */}
      <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Предотвращаем перенос строки
              handleSendMessage();
            }
          }}
          placeholder="Type a message"
          variant="outlined"
          size="small"
        />
        <Button variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPage;
