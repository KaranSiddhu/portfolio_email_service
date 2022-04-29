const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

const mailjet = require("node-mailjet").connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("The email server is running!!🚀"));

app.post("/email", async (req, res) => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM,
            Name: process.env.EMAIL_NAME
          },
          To: [
            {
              Email: process.env.EMAIL_FROM,
              Name: process.env.EMAIL_NAME
            }
          ],
          Subject: `Email from ${req.body.name}`,
          HTMLPart: `<h3>${req.body.message}</h3>`
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: "Email Sent successfully"
    });

  } catch (err) {
    res.status(404).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = app;
