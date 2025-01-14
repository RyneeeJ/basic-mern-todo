import { useSuspenseQuery } from "@tanstack/react-query";
import TaskItem from "./TaskItem";
import axios from "axios";

const getTasks = async () => {
  const res = await axios.get("/api/tasks");
  console.log(res);
  return res.data.data;
};
function TaskList() {
  const { data: tasks } = useSuspenseQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    retry: false,
    throwOnError: true,
  });

  return (
    <ul className="space-y-3">
      {tasks.length === 0 && (
        <p>No tasks yet. Add a new one and be productive! 😊</p>
      )}
      {tasks.length > 0 &&
        tasks?.map((task) => <TaskItem key={task._id} task={task} />)}
    </ul>
  );
}

export default TaskList;
