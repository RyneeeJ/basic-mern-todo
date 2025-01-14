import TaskItem from "./TaskItem";

const tempTasks = [
  {
    id: 1,
    title: "Learn MERN development",
    completed: false,
    dueDate: "2025-01-30T16:00:00.000Z",
  },
  {
    id: 2,
    title: "Hit the gym",
    completed: true,
  },
];
function TaskList() {
  return (
    <ul className="space-y-3">
      {tempTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default TaskList;
