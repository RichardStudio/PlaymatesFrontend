import React, { useState, useEffect } from "react";
import { searchUsers } from "../api"; // Импортируем функцию поиска пользователей
import { TextField, Select, MenuItem, Button, List, ListItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const SearchUsers = () => {
  const [filters, setFilters] = useState({
    minAge: "",
    maxAge: "",
    games: "",
    gender: "",
  });
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20); // Количество записей на странице

  // Функция для выполнения поиска
  const handleSearch = async (page = 1) => {
    try {
      const data = await searchUsers(filters, page, limit); // Запрос на поиск пользователей
      setUsers(data.users);
      setTotal(data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    handleSearch(1); // Загружаем всех пользователей без фильтров
  }, []);

  const totalPages = Math.ceil(total / limit);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handleSearch(currentPage + 1); // Переключаемся на следующую страницу
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handleSearch(currentPage - 1); // Переключаемся на предыдущую страницу
    }
  };

  // Функция обработки ввода игр
  const handleGamesChange = (e) => {
    let value = e.target.value;

    // Убираем лишние пробелы, нормализуем формат
    value = value
      .split(",") // Разбиваем строку по запятой
      .map(game => game.trim()) // Убираем лишние пробелы вокруг каждого элемента
      .filter(game => game.length > 0) // Исключаем пустые значения
      .join(","); // Склеиваем обратно с правильным разделителем ", "

    setFilters({ ...filters, games: value });
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Форма для поиска */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <TextField
          type="number"
          label="Min Age"
          value={filters.minAge}
          onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
          variant="outlined"
          size="small"
        />
        <TextField
          type="number"
          label="Max Age"
          value={filters.maxAge}
          onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
          variant="outlined"
          size="small"
        />
        <TextField
          type="text"
          label="Games (comma-separated)"
          value={filters.games}
          onChange={(e) => setFilters({ ...filters, games: e.target.value })} // Теперь можно вводить запятую
          onBlur={handleGamesChange} // Форматирование запускается только после потери фокуса
          variant="outlined"
          size="small"
        />
        <Select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          variant="outlined"
          size="small"
          style={{ minWidth: "150px" }}
          displayEmpty
        >
          <MenuItem value="">Any Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={() => handleSearch(1)}>
          Search
        </Button>
      </div>

      {/* Результаты поиска */}
      <div>
        <Typography variant="h6">Found {total} users</Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user.id}>
              <Link to={`/profile/${user.id}`} style={{ textDecoration: "none" }}>
                <Typography>
                  <strong>{user.username}</strong> ({user.email}) - Age: {user.age}, Gender:{" "}
                  {user.gender}, Games: {Array.isArray(user.games) ? user.games.join(", ") : "No games"}
                </Typography>
              </Link>
            </ListItem>
          ))}
        </List>
      </div>

      {/* Пагинация */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <Button
          variant="outlined"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous Page
        </Button>
        <Typography>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default SearchUsers;
