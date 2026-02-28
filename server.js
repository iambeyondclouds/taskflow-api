const express = require("express");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount task routes
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});