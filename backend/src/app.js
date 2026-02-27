require("dotenv").config();
process.env.TZ = "America/Lima";

const express = require("express");
const cors = require("cors");

const app = express();

/**
 * ✅ CORS (Express 5 friendly + Vercel + local)
 * IMPORTANTE:
 * - En Render debes setear FRONTEND_URL = https://TU-PROYECTO.vercel.app
 * - Si tienes más de 1 frontend, puedes separarlos por coma.
 */
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : []),
].map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // requests sin origin: server-to-server, curl, postman
    if (!origin) return cb(null, true);

    // permitir si está en lista
    if (allowedOrigins.includes(origin)) return cb(null, true);

    // bloquear si no coincide
    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ preflight global (Express 5: usar regex, NO "*" ni "/*")
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// ✅ healthcheck / root
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Backend Restaurante System corriendo ✅" });
});

// Routes
const pedidosRoutes = require("./routes/pedidos");
const platosRoutes = require("./routes/platos");
const mesasRoutes = require("./routes/mesas");
const cajaRoutes = require("./routes/caja");
const authRoutes = require("./routes/auth");
const jornadaRoutes = require("./routes/jornada");
const reporteDiario = require("./routes/reporteDiario");
const reporteMensual = require("./routes/reporteMensual");
const reporteSemestral = require("./routes/reporteSemestral");

app.use("/api/reportes", reporteSemestral);
app.use("/api/reportes", reporteMensual);
app.use("/api/reportes", reporteDiario);

app.use("/api/jornada", jornadaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/caja", cajaRoutes);

app.use("/api/pedidos", pedidosRoutes);
app.use("/api/platos", platosRoutes);
app.use("/api/mesas", mesasRoutes);

/**
 * ✅ Handler de error CORS / general
 * Para que el browser no vea 500 sin explicación.
 */
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ error: "Error interno", detalle: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));