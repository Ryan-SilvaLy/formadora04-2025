import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.1.3:3000";

// Tipagem da tarefa
export type Tarefa = {
  _id?: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  priority?: string;
  category?: string;
  image?: string; // base64 ou URL
  completed?: boolean;
};

// Buscar todas as tarefas
export async function getTarefas() {
  const res = await fetch(`${BASE_URL}/tarefas`);
  return res.json();
}

// Adicionar tarefa (com suporte a imagem)
export async function addTarefa(tarefa: Tarefa) {
  const res = await fetch(`${BASE_URL}/tarefas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarefa),
  });

  if (!res.ok) throw new Error("Erro ao adicionar tarefa");
  return res.json();
}


// Atualizar tarefa
export async function updateTarefa(id: string, updatedFields: Partial<Tarefa>) {
  const res = await fetch(`${BASE_URL}/tarefas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedFields),
  });
  return res.json();
}

// Deletar tarefa
export async function deleteTarefa(id: string) {
  const res = await fetch(`${BASE_URL}/tarefas/${id}`, { method: "DELETE" });
  return res.json();
}
