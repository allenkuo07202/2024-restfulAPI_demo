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

// 獲得所有學生的資料(網頁版)
app.get("/students", async (req, res) => {
  try {
    let studentData = await Student.find({}).exec();
    // return res.send(studentData);
    return res.render("students", { studentData });
  } catch (e) {
    return res.status(500).send("尋找資料時發生錯誤...");
  }
});

// 獲得特定的學生資料(網頁版)
app.get("/students/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({ _id }).exec();
    if (foundStudent != null) {
      return res.render("student-page", { foundStudent });
    } else {
      return res.status(400).render("student-not-found");
    }
    // return res.send(foundStudent);
  } catch (e) {
    // return res.status(500).send("尋找資料時發生錯誤...");
    return res.status(400).render("student-not-found");
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
    return res.status(400).send(e.message);
  }
});

// patch要用！
// 由於req.body的資料格式，不適合存進資料庫，所以必須轉換成適合更新進資料庫的格式
class NewData {
  constructor() {}
  setProperty(key, value) {
    if (key !== "merit" && key !== "other") {
      this[key] = value;
    } else {
      this[`scholarship.${key}`] = value;
    }
  }
}

// patch更新(修改)學生資料
app.patch("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let newObject = new NewData();
    for (let property in req.body) {
      newObject.setProperty(property, req.body[property]);
    }
    // console.log(req.body);
    // console.log(newObject);
    let newData = await Student.findOneAndUpdate({ _id }, newObject, {
      new: true,
      runValidators: true,
      // 不能寫overwrite: true，否則原本資料會全部被取代成新的資料(不管新舊各自的項目為何)
    });
    res.send({ msg: "成功更新學生資料！", updatedData: newData });
  } catch (e) {
    // console.log(e);
    return res.status(400).send(e.message);
  }
});

app.delete("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let deleteResult = await Student.deleteOne({ _id });
    // console.log(deleteResult);
    return res.send(deleteResult);
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法刪除學生資料");
  }
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
