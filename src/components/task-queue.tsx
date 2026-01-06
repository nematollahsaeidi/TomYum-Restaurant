const moveTaskUp = async (id: string) => {
  try {
    const updatedTasks = taskService.moveTaskUp(tasks, id);
    // Convert the service tasks back to our component interface
    const convertedTasks = updatedTasks.map(task => ({
      ...task,
      priority: task.operator_override > 30 ? "high" :
                task.effective_priority > 80 ? "high" :
                task.effective_priority > 60 ? "medium" : "low",
      table: task.waypoints[0] || "Unknown",
      time: "5 min"
    }));
    setTasks(convertedTasks);
    toast.success("Task moved up in queue");
  } catch (error) {
    toast.error("Failed to move task");
  }
};

const moveTaskDown = async (id: string) => {
  try {
    const updatedTasks = taskService.moveTaskDown(tasks, id);
    // Convert the service tasks back to our component interface
    const convertedTasks = updatedTasks.map(task => ({
      ...task,
      priority: task.operator_override > 30 ? "high" :
                task.effective_priority > 80 ? "high" :
                task.effective_priority > 60 ? "medium" : "low",
      table: task.waypoints[0] || "Unknown",
      time: "5 min"
    }));
    setTasks(convertedTasks);
    toast.success("Task moved down in queue");
  } catch (error) {
    toast.error("Failed to move task");
  }
};