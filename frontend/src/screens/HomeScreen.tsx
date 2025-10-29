import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getTarefas, deleteTarefa, Tarefa } from "../api/tarefas";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  const carregar = async () => {
    const data = await getTarefas();
    setTarefas(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", carregar);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteTarefa(id);
    carregar();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item._id || ""}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.title}>{item.title}</Text>
            {item.description && <Text style={styles.desc}>{item.description}</Text>}
            {item.date && <Text>📅 {new Date(item.date).toLocaleDateString()}</Text>}
            {item.time && <Text>⏰ {item.time}</Text>}
            <Text>⚡ Prioridade: {item.priority}</Text>
            <Text>📁 Categoria: {item.category}</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#4CAF50" }]}
                onPress={() => navigation.navigate("EditTask", { taskId: item._id! })}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#F44336" }]}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text style={styles.addButtonText}>+ Nova Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  desc: { marginVertical: 4 },
  image: { width: "100%", height: 150, borderRadius: 8, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  button: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
