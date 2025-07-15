<script setup>
import { ref, reactive, onMounted } from "vue";

const API_URL = "http://localhost:3001/tasks";

const statusCodes = [
  "Dev",
  "in-progress",
  "UAT-Ready",
  "UAT-passed",
  "PROD-Ready",
  "Launched"
];

const tasks = ref([]);

const form = reactive({
  id: null,
  name: "",
  assignee: "",
  dueDate: "",
  status: statusCodes[0]
});

const editMode = ref(false);

function resetForm() {
  form.id = null;
  form.name = "";
  form.assignee = "";
  form.dueDate = "";
  form.status = statusCodes[0];
  editMode.value = false;
}

async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.error.message || "Unknown error";
      alert("Error: " + errorMessage);
      throw new Error("HTTP response code = " + response.status + ", message = " + errorMessage);
    }
    tasks.value = data;
  } catch (error) {
    console.error("Error fetching tasks: " + error);
  }
}

async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      const errorMessage = data.error.message || "Unknown error";
      alert("Error: " + errorMessage);
      throw new Error("HTTP response code = " + response.status + ", message = " + errorMessage);
    }
    await fetchTasks();
  } catch (error) {
    console.error("Error deleting tasks:" + error);
  }
}

async function submitTask() {
  let fetchUrl;
  let fetchMethod;
  if (editMode.value) {
    // Update
    fetchUrl = `${API_URL}/${form.id}`;
    fetchMethod = "PUT";
  } else {
    // Create
    fetchUrl = API_URL;
    fetchMethod = "POST";
  }
  try {
    const response = await fetch(fetchUrl, {
      method: fetchMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        assignee: form.assignee,
        dueDate: form.dueDate,
        status: form.status
      })
    });
    if (!response.ok) {
      const data = await response.json();
      const errorMessage = data.error.message || "Unknown error";
      alert("Error: " + errorMessage);
      throw new Error("HTTP response code = " + response.status + ", message = " + errorMessage);
    }
    await fetchTasks();
    resetForm();
  } catch (error) {
    console.error("Error submitting task: " + error);
  }
}

function startEdit(task) {
  form.id = task.id;
  form.name = task.name;
  form.assignee = task.assignee;
  form.dueDate = task.dueDate;
  form.status = task.status;
  editMode.value = true;
}

onMounted(fetchTasks);
</script>

<template>
  <div>
    <form @submit.prevent="submitTask">
      <h2>{{ editMode ? "Edit Task" : "Create Task" }}</h2>
      <div>
        <label>Name:</label>
        <input v-model="form.name" required />
      </div>
      <div>
        <label>Assignee:</label>
        <input v-model="form.assignee" required />
      </div>
      <div>
        <label>Due Date:</label>
        <input type="date" v-model="form.dueDate" required />
      </div>
      <div>
        <label>Status:</label>
        <select v-model="form.status" required>
          <option v-for="statusCode in statusCodes">{{ statusCode }}</option>
        </select>
      </div>
      <button type="submit">{{ editMode ? "Update" : "Create" }}</button>
      <button v-if="editMode" type="button" @click="resetForm">Cancel</button>
    </form>

    <h2>All Tasks</h2>
    <table border="1" cellpadding="8" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Assignee</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.name }}</td>
          <td>{{ task.assignee }}</td>
          <td>{{ task.dueDate }}</td>
          <td>{{ task.status }}</td>
          <td>
            <button @click="startEdit(task)">Edit</button>
            <button @click="deleteTask(task.id)">Delete</button>
          </td>
        </tr>
        <tr v-if="tasks.length === 0">
          <td colspan="6" style="text-align:center;">No tasks found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
