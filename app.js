const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { specs } = require("./docs/swagger");
const app = express();


app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/quizzes", require("./routes/quiz.routes"));
app.use("/api", require("./routes/get.routes"));


module.exports = app;