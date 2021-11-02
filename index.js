import fs from "fs";
import path from "path";
import express from "express";
import session from "express-session";
import { constants } from "buffer";
const __dirname = path.resolve();

const PORT = process.env.PORT || '3000';

const app = express();

app.use(
  session({
    secret: "ijoinio34nsndfkn4",
    saveUninitialized: true,
    resave: false,
  })
);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, "index.html")).toString();
  if (req.session.passwordMissmath) {
    delete req.session.passwordMissmath;
    html = html.replace(`{{message}}`, `<div class="row invalid">Пароли не совпадают</div>`)
  }
  else {
    html = html.replace(`{{message}}`, ``);
  }
  res.setHeader("Content-Type", "text/html");
  res.end(html);
});

app.post("/", async (req, res) => {
  // const firstName = req.body.firstName
  // const lastName = req.body.lastName
  const password = req.body.password
  const passwordRepeat = req.body.passwordRepeat

  if (password != passwordRepeat) {
    req.session.passwordMissmath = true;
    res.redirect('/');
    return;
  }
  else {
    res.redirect("/");
  }
});

// app.use("/", express.static(path.join(__dirname, "")));

app.listen(PORT, () => (console.log("http://localhost:3000/")));
