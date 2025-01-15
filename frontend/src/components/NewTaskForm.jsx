import axios from "axios";
import AddTaskBtn from "./AddTaskBtn";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addTask = async (newTask) => {
  try {
    const res = await axios.post("/api/tasks", newTask);
    return res.data.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};
function NewTaskForm() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: addTask,
    onSuccess: async (newTask) => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      alert(`New task added: ${newTask.title}`);
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const dueDate = formData.get("dueDate");
    const newTask = dueDate ? { title, dueDate } : { title };
    mutate(newTask);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label htmlFor="title">Task title</label>
        <textarea
          id="title"
          type="text"
          name="title"
          placeholder="Enter task here..."
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="dueDate">Due Date (optional)</label>
        <input id="dueDate" type="date" name="dueDate" />
      </div>

      <AddTaskBtn />
    </form>
  );
}

export default NewTaskForm;
