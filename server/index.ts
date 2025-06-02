import express from "express";
import router from "./router/index.route";
import cors from 'cors';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import { connectDatabase } from "./config/database.config";

const app = express();
const port = 8000;
dotenv.config();

/* ----------Cấu hình CORS---------- */
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Cho phép gửi cookie qua lại giữa BE và FE
}));
/* ----------End Cấu hình CORS---------- */



/* ----------Kết nối DB---------- */
connectDatabase();
/* ----------End Kết nối DB---------- */

app.use(express.json());
app.use(bodyParser.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
})