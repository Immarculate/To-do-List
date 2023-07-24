/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faSquare,
  faCheckSquare,
  faPencilAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function api() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [updateInputValue, setUpdateInputValue] = useState('');
  const [updateTodoId, setUpdateTodoId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        const data = await response.json();
        console.log(data);
        setTodos(data);
        setIsLoading(false);

      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const createTodo = () => {
    async function createTodoFromApi() {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify({
            title: inputValue,
            completed: false,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        const data = await response.json();
        setTodos([...todos, data]);
        setInputValue('');
      } catch (error) {
        console.error(error);
      }
    }

    createTodoFromApi();
  };

  const updateTodo = (todoId, updateItems) => {
    async function updateTodoFromApi() {
      try {
        const response = await fetch(
          `${apiUrl}/${todoId}`,
          {
            method: 'PATCH',
            body: JSON.stringify(updateItems),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          }
        );
        const data = await response.json();
        let todosCopy = [...todos];
        const updatedTodoIndex = todosCopy.findIndex(
          (element) => element.id === data.id
        );
        todosCopy[updatedTodoIndex] = data;
        setTodos(todosCopy);
        setInputValue('');
      } catch (error) {
        console.error(error);
      }
    }

    updateTodoFromApi();
  };

  const deleteTodo = (todoId) => {
    async function deleteTodoFromApi() {
      try {
        await fetch(`${apiUrl}/${todoId}`, {
          method: 'DELETE',
        });
        let todosCopy = [...todos];
        const deletedTodoIndex = todosCopy.findIndex(
          (element) => element.id === todoId
        );
        console.log({ deletedTodoIndex });
        todosCopy.splice(deletedTodoIndex, 1);
        setTodos(todosCopy);
        setInputValue('');
      } catch (error) {
        console.error(error);
      }
    }

    deleteTodoFromApi();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const prepareUpdateInput = (e, todo) => {
    setUpdateTodoId(todo.id);
    setUpdateInputValue(todo.title);
  };

  const updateTodoAndCloseInput = (todoId, updateItems) => {
    updateTodo(todoId, updateItems);
    setUpdateTodoId(null);
  };

  const displayTodoSkeletonLoader = () => (
    <Skeleton count={10} height={100} />
  )

  const displayTodoList = () => {
    return todos.map((todo) => (
      <div
        key={todo.id}
        className="row px-3 align-items-center todo-item rounded"
      >
        <div className="col-auto m-1 p-0 d-flex align-items-center">
          <h2 className="m-0 p-0">
            {todo.completed ? (
              <FontAwesomeIcon
                icon={faCheckSquare}
                className="fa-check-square-o text-primary btn m-0 p-0"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Mark as todo"
                onClick={() => updateTodo(todo.id, {completed: false})}
              />
            ) : (
              <FontAwesomeIcon
                icon={faSquare}
                className="fa-square-o text-primary btn m-0 p-0"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Mark as complete"
                onClick={() => updateTodo(todo.id, {completed: true})}
              />
            )}
          </h2>
        </div>
        <div className="col px-1 m-1 d-flex align-items-center">
          <input
            type="text"
            className={`form-control form-control-lg border-0 edit-todo-input bg-transparent rounded px-3 ${
              updateTodoId !== todo.id ? '' : 'd-none'
            }`}
            readOnly
            value={todo.title}
            title={todo.title}
          />

          <input
            type="text"
            className={`form-control form-control-lg border-0 edit-todo-input rounded px-3 ${
              updateTodoId === todo.id ? '' : 'd-none'
            }`}
            value={updateInputValue}
            onChange={(e) => setUpdateInputValue(e.target.value)}
          />
        </div>
        <div className="col-auto m-1 p-0 px-3 d-none"></div>
        <div className="col-auto m-1 p-0 todo-actions">
          {updateTodoId === todo.id ? (
            <div className="col-auto px-0 mx-0 mr-2">
              <button
                onClick={() => updateTodoAndCloseInput(todo.id, {title: updateInputValue})}
                type="button"
                className="btn btn-primary"
              >
                Update
              </button>
            </div>
          ) : (
            <div className="row d-flex align-items-center justify-content-end">
              <h5
                onClick={(e) => prepareUpdateInput(e, todo)}
                className="m-0 p-0 px-2"
              >
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="fa fa-pencil text-info btn m-0 p-0"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Edit todo"
                />
              </h5>
              <h5 onClick={() => deleteTodo(todo.id)} className="m-0 p-0 px-2">
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="fa fa-trash-o text-danger btn m-0 p-0"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Delete todo"
                />
              </h5>
            </div>
          )}
        </div>
      </div>
    ));
  };
  return (
    <div className="container m-5 p-2 rounded mx-auto bg-light shadow">
      <div className="row m-1 p-4">
        <div className="col">
          <div className="p-1 h1 text-primary text-center mx-auto display-inline-block">
            <FontAwesomeIcon
              icon={faCheck}
              className="bg-primary text-white rounded p-2"
            />
            <u>My Todo-s</u>
          </div>
        </div>
      </div>
      <div className="row m-1 p-3">
        <div className="col col-11 mx-auto">
          <div className="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center">
            <div className="col">
              <input
                value={inputValue}
                onChange={handleInputChange}
                className="form-control form-control-lg border-0 add-todo-input bg-transparent rounded"
                type="text"
                placeholder="Add new task.."
              />
            </div>
            <div className="col-auto m-0 px-2 d-flex align-items-center">
              <label className="text-secondary my-2 p-0 px-1 view-opt-label due-date-label d-none">
                Due date not set
              </label>
            </div>
            <div className="col-auto px-0 mx-0 mr-2">
              <button
                onClick={createTodo}
                type="button"
                className="btn btn-primary"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 mx-4 border-black-25 border-bottom"></div>
      {
        isLoading ? displayTodoSkeletonLoader() : displayTodoList()
      }
    </div>
  );
}

export default api;
// git@github.com:Immarculate/To-do-List.git