require("dotenv").config();
process.env.TZ = "America/Lima";

const express = require("express");
const cors = require("cors");

const app = express();

// 👇 FORZAMOS origin permitido manualmente
app.use((req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_URL;

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// health
app.get("/", (req, res) => {
  res.json({ ok: true });
});

// rutas
app.use("/api/jornada", require("./routes/jornada"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/caja", require("./routes/caja"));
app.use("/api/pedidos", require("./routes/pedidos"));
app.use("/api/platos", require("./routes/platos"));
app.use("/api/mesas", require("./routes/mesas"));
app.use("/api/reportes", require("./routes/reporteSemestral"));
app.use("/api/reportes", require("./routes/reporteMensual"));
app.use("/api/reportes", require("./routes/reporteDiario"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on", PORT));