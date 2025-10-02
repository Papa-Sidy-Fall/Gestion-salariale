import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import companyRoutes from "./routes/company";
import employeeRoutes from "./routes/employee";
import payRunRoutes from "./routes/payRun";
import paymentRoutes from "./routes/payment";
import attendanceRoutes from "./routes/attendance";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (logos)
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payruns", payRunRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attendances", attendanceRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Serveur Express + TypeScript prêt !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
