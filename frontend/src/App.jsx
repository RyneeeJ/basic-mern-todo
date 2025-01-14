import NewTaskForm from "./components/NewTaskForm";
import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="mx-auto h-screen max-w-5xl bg-stone-200">
      <div className="mb-4 flex h-12 items-center justify-center">
        <h1>MERN To-do App</h1>
      </div>

      <div className="flex gap-8 px-4">
        <NewTaskForm />

        <div className="flex-1">
          <TaskList />
        </div>
      </div>
    </div>
  );
}

export default App;
