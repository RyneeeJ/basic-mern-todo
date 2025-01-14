import DeleteTaskBtn from "./DeleteTaskBtn";

function TaskItem({ task }) {
  return (
    <li className="flex items-center justify-between gap-12">
      <div className="flex flex-1 justify-between">
        <div className="space-x-2">
          <input type="checkbox" name="completed" />
          <span>{task.title}</span>
        </div>
        {task.dueDate && (
          <div>Due by: {new Date(task.dueDate).toDateString()}</div>
        )}
      </div>

      <DeleteTaskBtn />
    </li>
  );
}

export default TaskItem;
