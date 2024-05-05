const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student");

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

// 獲得所有學生的資料
app.get("/students", async (req, res) => {
  try {
    let studentData = await Student.find({}).exec();
    return res.send(studentData);
  } catch (e) {
    return res.status(500).send("尋找資料時發生錯誤...");
  }
});

// 獲得特定的學生資料(修改，使程式碼簡潔一點)
app.get("/students/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id }).exec();
    return res.send(foundStudent);
  } catch (e) {
    return res.status(500).send("尋找資料時發生錯誤...");
  }
});

// 創建一個新的學生
app.post("/students", async (req, res) => {
  try {
    let { name, age, major, merit, other } = req.body;
    //   console.log(name, age, major, merit, other);
    let newStudent = new Student({
      name,
      age,
      major,
      scholarship: {
        merit,
        other,
      },
    });
    let savedStudent = await newStudent.save();
    return res.send({
      msg: "資料儲存成功",
      savedObject: savedStudent,
    });
  } catch (e) {
    // return res.status(500).send("儲存資料時發生錯誤...");
    return res.status(400).send(e.message);
  }
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
