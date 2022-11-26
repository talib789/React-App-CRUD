import { useState } from "react";
import "./index.css";

export default function App() {
  const [error, setError] = useState(false);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todosPerPage, setTodosPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [todo, setTodo] = useState("");
  const [editTodo, setEditTodo] = useState("");

  //fectching  data from api
  const fetchData = async () => {
    try {
      let response = await fetch("https://jsonplaceholder.typicode.com/todos");
      if (response.status === 200) {
        let data = await response.json();
        setLoading(false);
        setTodos(data);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //loading the data to UI
  useState(() => {
    fetchData();
  }, []);

  //Pagination
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const visibleTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPage = Math.ceil(todos.length / todosPerPage);
  const pages = [...Array(totalPage + 1).keys()].splice(1);
  const handlePrev = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage !== totalPage) setCurrentPage(currentPage + 1);
  };

  //CRUD - Add
  const handleAdd = (e) => {
    e.preventDefault();

    const newTodo = {
      id: todos.length + 1,
      title: todo,
      completed: false
    };
    setTodos([...todos].concat(newTodo));
    setTodo("");
  };

  //CRUD - toggle
  const toggleComplete = (id) => {
    const updatedTodo = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setTodos(updatedTodo);
  };

  //CRUD - edit
  const handleEdit = (id) => {
    const updatedTodo = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.title = editTodo;
      }
      return todo;
    });
    setEditTodo("");
    setTodos(updatedTodo);
  };

  //CRUD - delete
  const handleDelete = (id) => {
    const updatedTodo = [...todos].filter((todo) => todo.id !== id);
    setTodos(updatedTodo);
  };

  //UI PART
  return (
    <div className="App">
      <h1>TODO APP</h1>
      {error ? (
        <h1>Error</h1>
      ) : loading ? (
        <h1>loading</h1>
      ) : (
        <div>
          <select onChange={(e) => setTodosPerPage(e.target.value)}>
            <option value="50">50</option>
            <option value="30">30</option>
            <option value="10">10</option>
          </select>
          <form>
            <input
              type="text"
              placeholder="type your todo"
              onChange={(e) => setTodo(e.target.value)}
              value={todo} />
            <button onClick={handleAdd}>ADD</button>
          </form>
          <table>
            <thead>
              <tr>
                <td>Id</td>
                <td>Title</td>
                <td>Complete</td>
                <td>DELETE</td>
                <td>EDIT</td>
              </tr>
            </thead>
            <tbody>
              {visibleTodos.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.title}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                    />
                    {String(todo.completed)}
                  </td>
                  <td>
                    <button
                      disabled={!todo.completed}
                      onClick={() => handleDelete(todo.id)}
                    >
                      DELETE
                    </button>
                  </td>
                  <td>
                    <input
                      type="text"
                      onChange={(e) => setEditTodo(e.target.value)}
                    />
                    <button onClick={() => handleEdit(todo.id)}>EDIT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            style={{ cursor: "pointer" }}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            PREV
          </button>
          {pages.map((page) => (
            <span
              key={page}
              style={{ cursor: "pointer" }}
              onClick={() => setCurrentPage(page)}
            >{` ${page} | `}</span>
          ))}
          <button
            style={{ cursor: "pointer" }}
            onClick={handleNext}
            disabled={currentPage === totalPage}
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
}
