import fs from "fs";
import path from "path";
import express from "express";
import session from "express-session";
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

  if (req.session.firstNameMissmath) {
    delete req.session.firstNameMissmath;
    html = html.replace(`{firstNameMissmath}`, `<div class="row invalid">Имя слишком короткое или длинное, или содержит недопустимые символы</div>`);
  }
  else if (req.session.lastNameMissmath) {
    delete req.session.lastNameMissmath;
    html = html.replace(`{lastNameMissmath}`, `<div class="row invalid">Имя слишком короткое или длинное, или содержит недопустимые символы</div>`);
  }
  else if (req.session.emailMissmath) {
    delete req.session.emailMissmath;
    html = html.replace(`{emailMissmath}`, `<div class="row invalid">Неверно указан email</div>`);
  }
  else if (req.session.passwordMissmath) {
    delete req.session.passwordMissmath;
    html = html.replace(`{passwordMissmath}`, `<div class="row invalid">Минимальная длина пароля 8 символов. Пароль должен содержать минимум одну цифру, по одной заглавной и строчную буквы и один символ, например, !@#$%^&*-_</div>`);
  }
  else if (req.session.passwordsMissmath) {
    delete req.session.passwordsMissmath;
    html = html.replace(`{passwordMissmath}`, `<div class="row invalid">Пароли не совпадают</div>`);
  }
  else if (req.session.birthDateMissmath) {
    delete req.session.birthDateMissmath;
    html = html.replace(`{birthDateMissmath}`, `<div class="row invalid">Вам нет ещё 18 лет</div>`);
  }
  // else {
  //   html = html.replace(/\{[a-zA-Z]*\}/g, ``);
  // }
  html = html.replace(/\{[a-zA-Z]*\}/g, ``);
  res.setHeader("Content-Type", "text/html");
  res.end(html);
});

app.post("/", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const passwordRepeat = req.body.passwordRepeat;
  const birthDate = req.body.birthDate.split("-");
  const birthDay = birthDate[2];
  const birthMonth = birthDate[1] - 1;
  const birthYear = birthDate[0];
  const age = 18;

  let mydate = new Date();
  mydate.setFullYear(birthYear, birthMonth, birthDay);
  let nowDate = new Date();
  let setDate = new Date();
  setDate.setFullYear(mydate.getFullYear() + age, birthMonth, birthDay);

  const firstNameRegExp = /^(?=.{2,255}$)[A-Za-zА-Яа-яЁё]/;
  const lastNameRegExp = /^(?=.{1,255}$)[A-Za-zА-Яа-яЁё]/;
  const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegExp = /(?=.*[0-9])(?=.*[!@#$%^&*-_])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g;

  if (!firstNameRegExp.test(firstName)) {
    req.session.firstNameMissmath = true;
    res.redirect('/');
    return;
  }
  else if (!lastNameRegExp.test(lastName)) {
    req.session.lastNameMissmath = true;
    res.redirect('/');
    return;
  }
  else if (!emailRegExp.test(email)) {
    req.session.emailMissmath = true;
    res.redirect('/');
    return;
  }
  else if (!passwordRegExp.test(password)) {
    req.session.passwordMissmath = true;
    res.redirect('/');
    return;
  }
  else if (password != passwordRepeat) {
    req.session.passwordsMissmath = true;
    res.redirect('/');
    return;
  }
  else if ((nowDate - setDate) < 0) {
    req.session.birthDateMissmath = true;
    res.redirect('/');
    return;
  }
  else {
    res.redirect("/");
  }

});

// app.use("/", express.static(path.join(__dirname, "")));

app.listen(PORT, () => (console.log("http://localhost:3000/")));
