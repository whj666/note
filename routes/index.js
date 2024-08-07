var express = require("express");
var router = express.Router();
const url = require("url");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(path.resolve(__dirname, "../data/db.json"));
const db = low(adapter);

// 列表
router.get("/", function (req, res, next) {
  res.render("list", { title: "列表", data: db.get("note").value() });
});

// 新增 编辑
router.get("/create", function (req, res, next) {
  const {
    query: { id },
  } = url.parse(req.url, true);

  res.render("create", {
    title: id ? "编辑" : "创建",
    data: id ? db.get("note").find({ id }).value() : {},
  });
});

// 新增 编辑 提交
router.post("/api/create", (req, res) => {
  const {
    query: { id },
  } = url.parse(req.url, true);

  if (id) {
    db.get("note").find({ id }).assign(req.body).write();
  } else {
    db.get("note")
      .push({ id: String(Math.random()), ...req.body })
      .write();
  }

  res.render("success", { title: "操作成功" });
});

// 删除
router.get("/delete/:id", function (req, res, next) {
  db.get("note").remove({ id: req.params.id }).write();

  res.render("success", { title: "删除成功" });
});

module.exports = router;
