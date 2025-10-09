import { useState, useEffect } from "react";
import './App.css'; 
import trashIcon from './assets/trash.svg';

export default function App() {
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingDate, setEditingDate] = useState("");

  function handleChange(e) {
    setInput(e.target.value);
  }

  function handleDateChange(e) {
    setDate(e.target.value);
  }

  function handleClick() {
    if (input.trim() === "") return;
    setTodos(prev => [...prev, { text: input.trim(), completed: false, dueDate: date }]);
    setInput("");
    setDate("");
  }

  function handleDelete(indexToDelete) {
    setTodos(prev => prev.filter((_, index) => index !== indexToDelete));
  }

  function toggleCompleted(indexToToggle) {
    setTodos(prev =>
      prev.map((todo, index) =>
        index === indexToToggle ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function handleEdit(index, newText, newDate) {
    setTodos(prev =>
      prev.map((todo, idx) =>
        idx === index ? { ...todo, text: newText, dueDate: newDate } : todo
      )
    );
    setEditingIndex(null);
    setEditingText("");
    setEditingDate("");
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (editingIndex !== null) {
        handleEdit(editingIndex, editingText, editingDate);
      } else {
        handleClick();
      }
    }
  }

  return (
    <div className="container">
      <div className="todoApp">
        <h1>Todo List</h1>
        <div className="inputContainer">
          <input
            type="text"
            value={input}
            className="inputBox"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Add todo"
            autoFocus
          />
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="inputBox"
          />
          <button onClick={handleClick} className="button" aria-label="Add todo">
            Add
          </button>
        </div>

        <ul className="listContainer">
          {todos.length === 0 && <p className="emptyMessage">No todos yet! Add some 😊</p>}
          {todos.map((todo, index) => (
            <li key={index} className="todoItem">
              {editingIndex === index ? (
                <div style={{ display: "flex", gap: "10px", flex: 1 }}>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="inputBox"
                    autoFocus
                  />
                  <input
                    type="date"
                    value={editingDate}
                    onChange={(e) => setEditingDate(e.target.value)}
                    className="inputBox"
                  />
                  <button
                    className="button"
                    onClick={() => handleEdit(index, editingText, editingDate)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <label className="todoLabel">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleCompleted(index)}
                      className="checkbox"
                      aria-label={`Mark todo "${todo.text}" as completed`}
                    />
                    <span className={todo.completed ? "todoText completed" : "todoText"}>
                      {todo.text}
                    </span>
                  </label>
                  {todo.dueDate && (
                    <span className="dueDate">📅 {todo.dueDate}</span>
                  )}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="button"
                      onClick={() => {
                        setEditingIndex(index);
                        setEditingText(todo.text);
                        setEditingDate(todo.dueDate || "");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="deleteBtn"
                      aria-label={`Delete todo: ${todo.text}`}
                    >
                      <img src={trashIcon} alt="Delete icon" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
