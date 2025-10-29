import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Tarefa } from "../api/tarefas";

type Props = {
  tarefa: Tarefa;
  onToggleCompleted: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ tarefa, onToggleCompleted, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => tarefa._id && onToggleCompleted(tarefa._id, !!tarefa.completed)}>
        <Text style={[styles.title, tarefa.completed && styles.completed]}>{tarefa.title}</Text>
        {tarefa.description ? <Text style={styles.description}>{tarefa.description}</Text> : null}
        {tarefa.date || tarefa.time ? (
          <Text style={styles.datetime}>
            {tarefa.date ? new Date(tarefa.date).toLocaleDateString() : ""} {tarefa.time || ""}
          </Text>
        ) : null}
        {tarefa.priority ? <Text style={styles.priority}>Prioridade: {tarefa.priority}</Text> : null}
        {tarefa.category ? <Text style={styles.category}>Categoria: {tarefa.category}</Text> : null}
        {tarefa.image ? <Image source={{ uri: tarefa.image }} style={styles.image} /> : null}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => tarefa._id && onDelete(tarefa._id)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "bold" },
  description: { fontSize: 14, color: "#555" },
  datetime: { fontSize: 12, color: "#888" },
  priority: { fontSize: 12, color: "#d32f2f" },
  category: { fontSize: 12, color: "#1976d2" },
  image: { width: "100%", height: 150, marginTop: 4, borderRadius: 8 },
  completed: { textDecorationLine: "line-through", color: "#999" },
  delete: { fontSize: 18, color: "red" },
});
