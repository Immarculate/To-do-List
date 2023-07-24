import React from 'react'
import { useState } from 'react';

function Todo() {
    const [list, setList] = useState([]);
    const [input, setInput] = useState('');
    const [updateInput, setUpdateInput] = useState("");
    const [updateItemIndex, setUpdateItemIndex] = useState(null);



     const handleSubmit = (e) => {
         e.preventDefault();
         setList([...list, input]);
         setInput("");
     };

     const inputChange = (e) => {
         e.preventDefault();
         setInput(e.target.value);
     };

     const deleteList = (index) => {
         const newList = [...list];
         newList.splice(index, 1);
         setList(newList);
     };

     const updateList = (index) => {
        const newList = [...list];
        newList[index] = updateInput;
        setList(newList);
        setUpdateItemIndex(null);
     };
    
    const updateInputChange = (e) => {
        e.preventDefault();
        setUpdateInput(e.target.value);
    };

    const prepareUpdateInput = (index, listItem) => {
        setUpdateItemIndex(index);
        setUpdateInput(listItem);
    };


    const shoppingList = () => {

        return list.map((listItem, index) => {
            return updateItemIndex === index ? (
                <>
                    <input value={updateInput} onChange={updateInputChange}/><button onClick={() => updateList(index)}>+</button>
                </>
            ) : (
            <li key={index}> 
                {listItem} 
                <button onClick={() => deleteList(index)}>-</button> 
                <button onClick={() => prepareUpdateInput(index, listItem)}>+</button>
            </li>
        )
        });
    };


  return (
    <div className="shopping">
        <div>
            <h1>Shopping List</h1>
            <form>
                <input onChange={inputChange} value={input} placeholder='shopping item'/>
                <button onClick={handleSubmit}>Add</button>
            </form>
            <div>
                {shoppingList()}
            </div>
        </div>
    </div>
  )
}

export default Todo