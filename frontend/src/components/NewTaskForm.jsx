import AddTaskBtn from "./AddTaskBtn";

function NewTaskForm() {
  return (
    <form className="space-y-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="title">Task title</label>
        <textarea
          id="title"
          type="text"
          name="title"
          placeholder="Enter task here..."
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
