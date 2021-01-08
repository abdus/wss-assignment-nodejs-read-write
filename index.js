import mongoose from "mongoose";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));

// db
mongoose.connect(
  `mongodb://wss:6fae51259ca57ba9d62c52fff5b6163f@168.119.165.57:14275/wss`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log("Mongoose Error: ".err.message);
    }

    console.log("Database Connected");
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

app.get("/api/users/", async (req, res) => {
  const searchQuery = req.query.q;

  try {
    const users = await User.find({});
    if (!searchQuery) return res.json({ data: users });

    const filteredUsers = [];

    for (let i = 0; i < users.length; i++) {
      if (
        users[i].email.includes(searchQuery) ||
        users[i].name.includes(searchQuery)
      ) {
        filteredUsers.push(users[i]);
      }
    }

    return res.json({ data: filteredUsers });
  } catch (err) {
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
});

app.post("/api/users/add", async (req, res) => {
  const { email, name, phone } = req.body;

  console.log(req.body);

  try {
    const doc = new User({
      name,
      email,
      phone,
    });

    await doc.save();
    res.json({ message: "done" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error" });
  }
});

app.listen(port, () => console.log(`Listening on ${port}`));
