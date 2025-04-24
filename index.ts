import { Hono } from "hono";
import Auth from "./routes/auth";
import Secret from "./routes/secret/index";
const app = new Hono();

app.route("/auth", Auth);
app.route("/secret", Secret);
export default app;
