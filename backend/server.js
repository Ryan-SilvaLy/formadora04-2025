require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());

// Aumenta limite para aceitar imagens em base64 grandes
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.log("Erro ao conectar MongoDB:", err));

// Modelo de Tarefa
const TarefaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  time: { type: String },
  priority: { type: String, enum: ["Baixa", "Média", "Alta"], default: "Média" },
  category: { type: String },
  image: { type: String }, // base64 ou URL
  completed: { type: Boolean, default: false },
});

const Tarefa = mongoose.model("Tarefa", TarefaSchema);

// Rotas CRUD
app.get("/tarefas", async (req, res) => {
  const tarefas = await Tarefa.find();
  res.json(tarefas);
});

app.post("/tarefas", async (req, res) => {
  try {
    const tarefa = new Tarefa(req.body);
    await tarefa.save();
    res.json(tarefa);
  } catch (err) {
    console.log("Erro ao adicionar tarefa:", err);
    res.status(400).json({ error: "Não foi possível adicionar a tarefa" });
  }
});

app.put("/tarefas/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tarefa);
  } catch (err) {
    console.log("Erro ao atualizar tarefa:", err);
    res.status(400).json({ error: "Não foi possível atualizar a tarefa" });
  }
});

app.delete("/tarefas/:id", async (req, res) => {
  try {
    await Tarefa.findByIdAndDelete(req.params.id);
    res.json({ message: "Tarefa removida" });
  } catch (err) {
    console.log("Erro ao deletar tarefa:", err);
    res.status(400).json({ error: "Não foi possível deletar a tarefa" });
  }
});

// Teste de rota
app.get("/", (req, res) => {
  res.send("API To-Do List rodando!");
});

// Rodar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
