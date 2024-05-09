const express = require("express");
const app = express();
const mongoose = require("mongoose");

const methodOverride = require("method-override");

const studentRoutes = require("./routes/student-routes");
const facultyRoutes = require("./routes/faculty-routes");

mongoose
  .connect("mongodb://localhost:27017/exampleDB")
  .then(() => {
    console.log("成功連結mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
// post要用！
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// put網頁版要用！
app.use(methodOverride("_method"));

app.use("/students", studentRoutes);
app.use("/faculty", facultyRoutes);

app.use((err, req, res, next) => {
  console.log("正在使用這個midleware...");
  // return res.status(400).send(err); // 直接回傳錯誤訊息給使用者
  return res.status(400).render("error"); // 渲染網頁給使用者
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
