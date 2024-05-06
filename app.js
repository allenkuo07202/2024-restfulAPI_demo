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

// put更新(修改)學生資料
app.put("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let { name, age, major, merit, other } = req.body;
    let newData = await Student.findOneAndUpdate(
      { _id },
      { name, age, major, scholarship: { merit, other } },
      { new: true, runValidators: true, overwrite: true }
      // 因為HTTP put request要求客戶端提供所有數據
      // 所以我們需要根據客戶端提供的數據，來更新資料庫內的資料
    );
    res.send({ msg: "成功更新學生資料！", updatedData: newData });
  } catch (e) {
    // console.log(e);
    res.status(400).send(e);
  }
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
