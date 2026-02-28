require("dotenv").config();
process.env.TZ = "America/Lima";

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// ✅ lee origins desde Render
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(",") : []),
].map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // requests sin origin (postman / curl)
    if (!origin) return cb(null, true);

    if (allowedOrigins.includes(origin)) return cb(null, true);

    // 👇 IMPORTANTE: no tires error (así no da 500)
    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // ✅ Express 5 safe

app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Backend Restaurante System corriendo ✅" });
});

// Routes
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
app.listen(PORT, () => console.log("Server on port " + PORT));