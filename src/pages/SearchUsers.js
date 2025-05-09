import React, { useState, useEffect } from "react";
import { searchUsers } from "../api"; // Импортируем функцию searchUsers
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
      const data = await searchUsers(filters, page, limit); // Выполняем запрос для указанной страницы
      setUsers(data.users);
      setTotal(data.total);
      setCurrentPage(page); // Устанавливаем текущую страницу
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
          onChange={(e) => setFilters({ ...filters, games: e.target.value })}
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
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
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