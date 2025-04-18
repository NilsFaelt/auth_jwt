import { Hono } from "hono";
import Auth from "./routes/auth";
const app = new Hono();

app.route("/auth", Auth);
export default app;
