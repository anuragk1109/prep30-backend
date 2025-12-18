const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { specs } = require("./docs/swagger");
const cors = require("cors");
const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',  // Next.js dev server
    'https://prep30-frontend.vercel.app/' // Production frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/quizzes", require("./routes/quiz.routes"));
app.use("/api", require("./routes/get.routes"));


module.exports = app;