import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgressTodos, setInProgressTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  useEffect(() => {
    const filteredTodos = tasks.filter((task) => task.status === "todo");
    const filteredInProgressTodos = tasks.filter((task) => task.status === "inprogress");
    const filteredCompletedTodos = tasks.filter((task) => task.status === "completed");

    setTodos(filteredTodos);
    setInProgressTodos(filteredInProgressTodos);
    setCompletedTodos(filteredCompletedTodos);
  }, [tasks]);

  const allStatus = ["todo", "inprogress", "completed"];
  return (
    <div className="flex gap-12">
      {allStatus?.map((status, index) => (
        <ShowTasks
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgressTodos={inProgressTodos}
          completedTodos={completedTodos}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const ShowTasks = ({
  status,
  tasks,
  setTasks,
  todos,
  inProgressTodos,
  completedTodos,
}) => {

  const [{isOver}, drop] = useDrop(()=>({        
    accept: "task",
    drop: (item)=>addItemToList(item.id),
    collect: (monitor)=>({
        isOver: !!monitor.isOver(),
    })        
}));

  let text = "todo";
  let bg = "bg-slate-500";
  let tasksToMap = todos;

  
  if (status === "inprogress") {
    text = "in progress";
    bg = "bg-purple-500";
    tasksToMap = inProgressTodos;
  }
  if (status === "completed") {
    text = "completed";
    bg = "bg-green-500";
    tasksToMap = completedTodos;
  }

    const addItemToList = (id)=>{
        setTasks((prev)=>{
            const modifiedTasks = prev.map((t)=>{
                if(t.id === id){
                    return {...t, status: status};
                }
                return t;
            })
            localStorage.setItem("tasks", JSON.stringify(modifiedTasks));
            toast('Task Status Changed', {
                icon: '👏',
              });

            return modifiedTasks;
        })
    }

  return (
    <div ref={drop} className={`w-64 ${isOver ? "bg-slate-200" : ""}`}>
      <Header text={text} bg={bg} length={tasksToMap.length} />
      {tasksToMap.length > 0 &&
        tasksToMap.map(task => (
          <Task task={task} key={task.id} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  );
};

const Header = ({ text, bg, length }) => {
  return (
    <>
      <div
        className={`${bg} flex items-center text-white uppercase text-sm h-12 pl-4 rounded-md`}
      >
        {text}
        <span className="ml-2 bg-white text-black rounded-full flex items-center justify-center w-5 h-5">
          {" "}
          {length}
        </span>
      </div>
    </>
  );
};

const Task = ({ task, tasks, setTasks }) => {

    const [{isDragging}, drag] = useDrag(()=>({        
            type: "task",
            item: {id: task.id},
            collect: (monitor)=>({
                isDragging: !!monitor.isDragging()
            })        
    }));

    const handleRemoveTask = (id)=>{
        const fTasks = tasks.filter((t)=>t.id !== id);
        localStorage.setItem("tasks", JSON.stringify(fTasks));
        setTasks(fTasks);
        toast('Task Removed', {
            icon: '👏',
          });
    }
  return (
    <div ref={drag} className={`relative p-4 mt-8 shadow-md rounded-md cursor-grab ${isDragging ? "opacity-25" : "opacity-100"}`}>
      <p>{task.name}</p>
      <button className="absolute bottom-1 right-1 text-slate-400" onClick={()=>handleRemoveTask(task.id)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};
