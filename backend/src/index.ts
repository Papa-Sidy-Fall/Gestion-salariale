import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import companyRoutes from "./routes/company";
import employeeRoutes from "./routes/employee";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/employees", employeeRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Serveur Express + TypeScript prêt !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
