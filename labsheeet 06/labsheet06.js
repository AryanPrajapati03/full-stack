const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY || "my-secret-key";

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url}`
    );
    next();
});

// Authentication middleware
const authCheck = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (apiKey !== API_KEY) {
        return res.status(401).json({
            success: false,
            error: {
                status: 401,
                message: "Unauthorized: Invalid or missing API key"
            }
        });
    }

    next();
};

// ===============================
// IN-MEMORY DATABASE
// ===============================

let tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: false
    },
    {
        id: 2,
        title: "Learn Express.js",
        completed: false
    },
    {
        id: 3,
        title: "Build REST API",
        completed: true
    },
    {
        id: 4,
        title: "Learn React",
        completed: false
    },
    {
        id: 5,
        title: "Build Full Stack Project",
        completed: false
    }
];

// ===============================
// GET ALL TASKS
// ===============================

app.get("/api/tasks", (req, res) => {
    res.json({
        success: true,
        data: tasks
    });
});

// ===============================
// GET ONE TASK
// ===============================

app.get("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            success: false,
            error: {
                status: 404,
                message: "Task not found"
            }
        });
    }

    res.json({
        success: true,
        data: task
    });
});

// ===============================
// CREATE TASK
// ===============================

app.post("/api/tasks", authCheck, (req, res, next) => {
    try {
        const { title, completed = false } = req.body;

        if (!title || title.trim() === "") {
            const error = new Error("Task title is required");
            error.status = 400;
            throw error;
        }

        const newTask = {
            id: tasks.length
                ? Math.max(...tasks.map(task => task.id)) + 1
                : 1,
            title: title.trim(),
            completed: Boolean(completed)
        };

        tasks.push(newTask);

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: newTask
        });

    } catch (error) {
        next(error);
    }
});

// ===============================
// UPDATE TASK
// ===============================

app.put("/api/tasks/:id", authCheck, (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            success: false,
            error: {
                status: 404,
                message: "Task not found"
            }
        });
    }

    if (req.body.title !== undefined) {
        task.title = req.body.title;
    }

    if (req.body.completed !== undefined) {
        task.completed = Boolean(req.body.completed);
    }

    res.json({
        success: true,
        message: "Task updated successfully",
        data: task
    });
});

// ===============================
// DELETE TASK
// ===============================

app.delete("/api/tasks/:id", authCheck, (req, res) => {
    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: {
                status: 404,
                message: "Task not found"
            }
        });
    }

    const deletedTask = tasks.splice(index, 1)[0];

    res.json({
        success: true,
        message: "Task deleted successfully",
        data: deletedTask
    });
});

// ===============================
// FRONTEND
// ===============================

app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>

<html>
<head>

    <title>Task Manager Mini App</title>

    <style>

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f2f2f2;
        }

        .container {
            width: 700px;
            max-width: 90%;
            margin: 50px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        h1 {
            text-align: center;
        }

        form {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
        }

        input {
            flex: 1;
            padding: 12px;
            font-size: 16px;
        }

        button {
            padding: 10px 15px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }

        .add-btn {
            background: #222;
            color: white;
        }

        .delete-btn {
            background: #d33;
            color: white;
        }

        ul {
            padding: 0;
        }

        li {
            list-style: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f1f1f1;
            padding: 12px;
            margin: 10px 0;
            border-radius: 5px;
        }

        .loading {
            text-align: center;
        }

        .error {
            background: #ffe0e0;
            color: #b00000;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }

        .success {
            background: #e0ffe0;
            color: #087008;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }

        .completed {
            text-decoration: line-through;
            color: gray;
        }

        .api-info {
            margin-top: 30px;
            background: #eee;
            padding: 15px;
            border-radius: 5px;
        }

        code {
            background: #ddd;
            padding: 3px;
        }

    </style>

</head>

<body>

<div class="container">

    <h1>Task Manager Mini App</h1>

    <div id="message"></div>

    <form id="taskForm">

        <input
            id="taskInput"
            type="text"
            placeholder="Enter new task"
            required
        >

        <button class="add-btn" type="submit">
            Add Task
        </button>

    </form>

    <div id="loading" class="loading">
        Loading...
    </div>

    <ul id="taskList"></ul>

    <div class="api-info">

        <h3>REST API Endpoints</h3>

        <p>GET /api/tasks</p>
        <p>GET /api/tasks/:id</p>
        <p>POST /api/tasks</p>
        <p>PUT /api/tasks/:id</p>
        <p>DELETE /api/tasks/:id</p>

        <p>
            API Key:
            <code>my-secret-key</code>
        </p>

    </div>

</div>


<script>

const API_URL = "/api/tasks";

const API_KEY = "my-secret-key";

const taskList =
    document.getElementById("taskList");

const loading =
    document.getElementById("loading");

const message =
    document.getElementById("message");

const form =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");


// ====================================
// SHOW MESSAGE
// ====================================

function showMessage(text, type = "error") {

    message.innerHTML =
        '<div class="' + type + '">' +
        text +
        '</div>';

    setTimeout(() => {
        message.innerHTML = "";
    }, 3000);
}


// ====================================
// LOAD TASKS
// ====================================

async function loadTasks() {

    loading.style.display = "block";

    taskList.innerHTML = "";

    try {

        const response =
            await fetch(API_URL);

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.error?.message ||
                "Failed to load tasks"
            );

        }

        result.data.forEach(task => {

            displayTask(task);

        });

    } catch (error) {

        showMessage(
            "Error: " + error.message
        );

    } finally {

        loading.style.display = "none";

    }

}


// ====================================
// DISPLAY TASK
// ====================================

function displayTask(task) {

    const li =
        document.createElement("li");

    li.innerHTML = `

        <span class="${
            task.completed ? "completed" : ""
        }">

            ${task.id}. ${task.title}

            ${
                task.completed
                    ? " ✓"
                    : ""
            }

        </span>

        <button
            class="delete-btn"
            onclick="deleteTask(${task.id})"
        >
            Delete
        </button>

    `;

    taskList.appendChild(li);

}


// ====================================
// ADD TASK
// ====================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const title =
            taskInput.value.trim();

        if (!title) {

            showMessage(
                "Please enter a task title."
            );

            return;

        }

        try {

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "x-api-key":
                            API_KEY
                    },

                    body: JSON.stringify({
                        title: title,
                        completed: false
                    })

                });

            const result =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    result.error?.message ||
                    "Failed to create task"
                );

            }

            displayTask(result.data);

            taskInput.value = "";

            showMessage(
                "Task created successfully!",
                "success"
            );

        } catch (error) {

            showMessage(
                "Error: " + error.message
            );

        }

    }
);


// ====================================
// DELETE TASK
// ====================================

async function deleteTask(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE",

                    headers: {
                        "x-api-key":
                            API_KEY
                    }

                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.error?.message ||
                "Failed to delete task"
            );

        }

        showMessage(
            "Task deleted successfully!",
            "success"
        );

        loadTasks();

    } catch (error) {

        showMessage(
            "Delete failed: " +
            error.message
        );

    }

}


// ====================================
// INITIAL LOAD
// ====================================

loadTasks();

</script>

</body>

</html>
    `);
});


// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        error: {
            status: 404,
            message:
                `Route ${req.method} ${req.originalUrl} not found`
        }
    });

});


// ===============================
// CENTRAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(err.status || 500).json({

        success: false,

        error: {
            status: err.status || 500,
            message:
                err.message ||
                "Internal Server Error"
        }

    });

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

    console.log(
        `API available at http://localhost:${PORT}/api/tasks`
    );

});