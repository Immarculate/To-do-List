import { useState } from 'react';
import './App.css';

const App = () => {
  const [counter, setCounter] = useState(0);
  const [todos, setTodos] = useState([]);
  const [curentInput, setCurrentInput] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setTodos([...todos, curentInput]);
    setCurrentInput("")
  }

  const onInputChange = (e) => {
    e.preventDefault();
   setCurrentInput(e.target.value)
  }

  const onDelete = (i) => {
    const todosCopy = [...todos]
    todosCopy.splice(i, 1);
    setTodos(todosCopy);
  }

  const listTodos = () => {
    return todos.map((todo, i) => (
      <li key = {todo}> {todo} <button onClick={() => onDelete(i)} >-</button></li>
    ))
  }

  return (

    <div className="App">
      <header className='top'>
      <button onClick={() => setCounter((preCount) => preCount + 1)}>+</button>
      <h1>{counter}</h1>
      <button onClick={() => setCounter((preCount) => preCount - 1)}>-</button>
      </header>

      <div className='todo'>
        <div>
          <form>
            <h1>Todo List</h1>
            <input onChange={onInputChange} value={curentInput}  placeholder="Add todo" />
            <button onClick={onSubmit}>Submit</button>
          </form>
        </div>
        <div>{listTodos()}</div>
      </div>
    </div>
  );
}

export default App;
