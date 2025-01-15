import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const deleteTask = async (id) => {
  try {
    await axios.delete(`/api/tasks/${id}`);
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

function DeleteTaskBtn({ id }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  return (
    <button
      onClick={() => mutate(id)}
      className="rounded-md bg-red-600 px-3 py-1 text-stone-100"
    >
      Delete
    </button>
  );
}

export default DeleteTaskBtn;
