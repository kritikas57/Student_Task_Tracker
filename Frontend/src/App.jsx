
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");

  const API = "http://localhost:5000";

  // Load tasks from MongoDB
  useEffect(() => {
    async function getTasks() {
      const response = await fetch(`${API}/gettasks`);
      const data = await response.json();
      setTasks(data);
    }

    getTasks();
  }, []);

  // Add task
  async function addTask(e) {
    e.preventDefault();

    if (!title || !subject || !deadline) {
      alert("Please fill all fields");
      return;
    }

    const newTask = {
      title,
      subject,
      deadline,
      completed: false
    };

    const response = await fetch(`${API}/addtask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
    });

    const savedTask = await response.json();

    setTasks([...tasks, savedTask]);

    setTitle("");
    setSubject("");
    setDeadline("");
  }

  // Complete or undo a task
  async function toggleTask(id) {
    const task = tasks.find((task) => task._id === id);

    const response = await fetch(`${API}/updatetask/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        completed: !task.completed
      })
    });

    const updatedTask = await response.json();

    setTasks(
      tasks.map((task) =>
        task._id === id ? updatedTask : task
      )
    );
  }

  // Delete task
  async function deleteTask(id) {
    await fetch(`${API}/deletetask/${id}`, {
      method: "DELETE"
    });

    setTasks(tasks.filter((task) => task._id !== id));
  }

  return (
    <div className="app">
      <header>
        <h1>Student Task Tracker</h1>
        <p>Organize your assignments and deadlines</p>
      </header>

      <main>
        <section className="form-section">
          <h2>Add a New Task</h2>

          <form onSubmit={addTask}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <button type="submit">Add Task</button>
          </form>
        </section>

        <section className="tasks-section">
          <h2>My Tasks ({tasks.length})</h2>

          {tasks.length === 0 ? (
            <p className="empty">
              No tasks yet. Add your first task!
            </p>
          ) : (
            tasks.map((task) => (
              <div className="task-card" key={task._id}>
                <div>
                  <h3 className={task.completed ? "completed" : ""}>
                    {task.title}
                  </h3>

                  <p>Subject: {task.subject}</p>
                  <p>Deadline: {task.deadline}</p>

                  <p>
                    Status: {task.completed ? "Completed" : "Pending"}
                  </p>
                </div>

                <div className="actions">
                  <button onClick={() => toggleTask(task._id)}>
                    {task.completed ? "Undo" : "Complete"}
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
