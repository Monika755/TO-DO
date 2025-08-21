import { useState, useEffect } from "react";
import './App.css'; 
import trashIcon from './assets/trash.svg';

export default function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleChange(e) {
    setInput(e.target.value);
  }

  function handleClick() {
    if (input.trim() === "") return;
    setTodos(prev => [...prev, { text: input.trim(), completed: false }]);
    setInput("");
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

  function handleEdit(indexToEdit, newText) {
    setTodos(prev =>
      prev.map((todo, index) =>
        index === indexToEdit ? { ...todo, text: newText } : todo
      )
    );
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleClick();
    }
  }

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  function startEditing(index) {
    setEditingIndex(index);
    setEditingText(todos[index].text);
  }

  function saveEdit(index) {
    if (editingText.trim() === "") return;
    handleEdit(index, editingText.trim());
    setEditingIndex(null);
    setEditingText("");
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
          <button onClick={handleClick} className="button" aria-label="Add todo">Add</button> 
        </div>

        <ul className="listContainer">
          {todos.length === 0 && <p className="emptyMessage">No todos yet! Add some 😊</p>}
          {todos.map((todo, index) => (
            <li key={index} className="todoItem">
              {editingIndex === index ? (
                <div style={{ display: "flex", flex: 1, gap: "10px" }}>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="inputBox"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(index)}
                    className="button"
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
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => startEditing(index)}
                      className="button"
                      aria-label={`Edit todo: ${todo.text}`}
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