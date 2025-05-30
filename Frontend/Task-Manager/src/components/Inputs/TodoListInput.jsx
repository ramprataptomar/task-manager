import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
    const [option, setOption] = useState("");

    // Add a task
    const handleAddOption = () => {
        if (option.trim()) {
            setTodoList([...todoList, option.trim()]);
            setOption("");
        }
    };

    // Delete a task
    const handleDeleteOption = (index) => {
        const updatedArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatedArr);
    };

    return (
        <div className="space-y-4">
            {todoList.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between border-gray-100 bg-gray-50 px-3 py-2 rounded-md mb-3 mt-2"
                >
                    <p className='text-xs text-black'>
                        <span className="text-xs mr-2 font-semibold text-gray-400">
                            {index < 9 ? `0${index + 1}` : index + 1}.
                        </span>
                        {item}
                    </p>

                    <button 
                        className="cursor-pointer"
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className="text-lg text-red-500"/>
                    </button>
                </div>
            ))}

            <div className="flex items-center gap-5 mt-4">
                <input
                    type="text"
                    placeholder="Enter Task"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
                />
                <button
                    className="card-btn text-nowrap"
                    onClick={handleAddOption}
                >
                    <HiMiniPlus className='text-lg'/> Add
                </button>
            </div>
        </div>
    );
};

export default TodoListInput;
