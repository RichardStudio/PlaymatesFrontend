import React from "react";
import { createRoot } from "react-dom/client"; // Импортируем createRoot
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container); // Создаем корневой элемент
root.render(<App />); // Рендерим приложение