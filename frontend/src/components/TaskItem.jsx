import { useEffect, useState } from "react";
import DeleteTaskBtn from "./DeleteTaskBtn";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const editCompleteStatus = async ({ id, isCompleted }) => {
  try {
    await axios.patch(`/api/tasks/${id}`, {
      completed: isCompleted,
    });

    return null;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};
function TaskItem({ task }) {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  const { mutate } = useMutation({
    mutationFn: editCompleteStatus,
    onError: (err) => {
      alert(`There was a problem with this action ${err.message}`);
    },
  });

  useEffect(() => {
    mutate({ id: task._id, isCompleted });
  }, [mutate, task._id, isCompleted]);
  return (
    <li className="flex items-center justify-between gap-12">
      <div className="flex flex-1 justify-between">
        <div className="flex space-x-2">
          <input
            checked={isCompleted}
            onChange={() => setIsCompleted((status) => !status)}
            type="checkbox"
            name="completed"
          />
          <div className="space-x-3">
            <span className={`${isCompleted && "line-through"}`}>
              {task.title}
            </span>
            {isCompleted && <span>✅</span>}
          </div>
        </div>
        {task.dueDate && (
          <div>Due by: {new Date(task.dueDate).toDateString()} </div>
        )}
      </div>

      <DeleteTaskBtn />
    </li>
  );
}

export default TaskItem;
