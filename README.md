This is a Task Management System.

Frontend: Vue.js

Backend: Node.js

Database: MySQL

API Lists:
| API | Details |
|---|---|
| GET /tasks | Fetch all tasks from database |
| POST /tasks | Create a task in database |
| PUT /tasks/{id} | Update task with id = {id} in database |
| DELETE /tasks/{id} | Delete task with id = {id} in database |

Database Schema:

| Column | Type |
|---|---|
| id | int (Primary Key) |
| name | varchar |
| assignee | varchar |
| dueDate | date |
| status | ENUM('Dev', 'in-progress', 'UAT-Ready', 'UAT-passed', 'PROD-Ready', 'Launched') |
