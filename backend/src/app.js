require("dotenv").config();
process.env.TZ = "America/Lima";

const express = require("express");
const cors = require("cors");

const app = express();

// ✅ lista de orígenes permitidos (local + prod)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // ej: https://restaurante-system.vercel.app
].filter(Boolean);

// ✅ función cors segura
const corsOptions = {
  origin: (origin, cb) => {
    // requests sin origin (curl/postman)
    if (!origin) return cb(null, true);

    // permitir si coincide exacto
    if (allowedOrigins.includes(origin)) return cb(null, true);

    // bloquear si no
    return cb(null, false);
  },
  credentials: true,
};

// ✅ IMPORTANTE: CORS primero
app.use(cors(corsOptions));

// ✅ IMPORTANTE: preflight para TODOS
app.options("*", cors(corsOptions));

app.use(express.json());

// ✅ health
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Backend corriendo ✅" });
});

// routes
app.use("/api/reportes", require("./routes/reporteSemestral"));
app.use("/api/reportes", require("./routes/reporteMensual"));
app.use("/api/reportes", require("./routes/reporteDiario"));
app.use("/api/jornada", require("./routes/jornada"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/caja", require("./routes/caja"));
app.use("/api/pedidos", require("./routes/pedidos"));
app.use("/api/platos", require("./routes/platos"));
app.use("/api/mesas", require("./routes/mesas"));

// ✅ 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on", PORT));