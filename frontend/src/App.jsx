import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";

import NewTaskForm from "./components/NewTaskForm";
import TaskList from "./components/TaskList";
import ErrorPage from "./components/ErrorPage";
import { Suspense } from "react";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <div className="mx-auto h-screen max-w-5xl bg-stone-200">
          <div className="mb-4 flex h-12 items-center justify-center">
            <h1>MERN To-do App</h1>
          </div>

          <div className="flex gap-8 px-4">
            <NewTaskForm />

            <div className="flex-1">
              <Suspense fallback={<p>LOADING TASKS...</p>}>
                <TaskList />
              </Suspense>
            </div>
          </div>
        </div>

        <ReactQueryDevtools initialIsOpen={false} />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
