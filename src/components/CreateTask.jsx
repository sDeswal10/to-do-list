import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

const CreateTask = ({ tasks, setTasks }) => {
  const [task,setTask] = useState({
    id: "",
    name: "",
    status: "todo"
  });
  const handleSubmit = (e)=>{
    e.preventDefault();
    if(task.name.length < 3) return toast.error("A task must have more than 3 characters");
    if(task.name.length > 50) return toast.error("A task not be more than 50 characters");
    setTasks((prev)=>{
      const list = [...prev, task];
      localStorage.setItem("tasks", JSON.stringify(list));
      return list;
    })
    toast.success("Task Created")
    setTask({
      id: "",
      name: "",
      status: "todo"
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="border-2 border-slate-400 bg-slate-100 rounded-md mr-4 h-12 w-64 px-1"
        placeholder="Enter your task"
        value={task.name}
        onChange={(e)=>setTask({...task, id: uuidv4(), name: e.target.value})}
      />
      <button type="submit" className="bg-cyan-500 rounded-md px-4 h-12 text-white">
        Create
      </button>
    </form>
  );
};

export default CreateTask;
