# TaskFlow API

TaskFlow API is a simple RESTful backend service built with Node.js and Express for managing tasks.

This project demonstrates:

- Basic REST API design
- CRUD operations
- File-based JSON persistence
- Backend routing structure

---

## Features

- Create a task
- View all tasks
- Update task completion status
- Delete a task
- Persistent storage using JSON file

---

## Tech Stack

- Node.js
- Express.js
- File System (fs module)

---

## API Endpoints

GET `/tasks`  
→ Returns all tasks

POST `/tasks`  
→ Create a new task  
Body:
```json
{
  "title": "Learn APIs"
}
```

PUT `/tasks/:id`  
→ Update task completion  
Body:
```json
{
  "completed": true
}
```

DELETE `/tasks/:id`  
→ Delete a task

---

## Run Locally

```
npm install
npm start
```

Server runs at:

```
http://localhost:3000
```

---

## Author

Aashita Srivastava