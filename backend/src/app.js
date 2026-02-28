require("dotenv").config();
process.env.TZ = "America/Lima";

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// ✅ Permite varios origins (separados por coma)
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(",") : []),
].map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman / server-to-server
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(null, false); // 👈 NO error (evita 500)
  },
  credentials: true,
};

// ✅ CORS + Preflight para Express 5 (regex, no "*" ni "/*")
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Ruta raíz
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

// ✅ Handler si CORS bloquea (opcional pero útil)
app.use((err, req, res, next) => {
  if (err && String(err).toLowerCase().includes("cors")) {
    return res.status(403).json({ error: "CORS blocked" });
  }
  next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));