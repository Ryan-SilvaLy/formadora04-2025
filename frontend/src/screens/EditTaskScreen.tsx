import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { getTarefas, updateTarefa, Tarefa } from "../api/tarefas";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function EditTaskScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { taskId } = route.params as { taskId: string };

  const [task, setTask] = useState<Tarefa | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    async function load() {
      const all = await getTarefas();
      const found = all.find((t: Tarefa) => t._id === taskId);
      if (found) setTask(found);
    }
    load();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      setTask({ ...task!, image: `data:image/jpeg;base64,${manipResult.base64}` });
    }
  };

  const handleSave = async () => {
    if (!task?._id) return;
    try {
      await updateTarefa(task._id, task);
      Alert.alert("Sucesso", "Tarefa atualizada!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar a tarefa");
    }
  };

  if (!task) return <Text>Carregando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Tarefa</Text>

      <TextInput
        style={styles.input}
        value={task.title}
        onChangeText={(t) => setTask({ ...task, title: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={task.description}
        onChangeText={(t) => setTask({ ...task, description: t })}
      />

      {/* Campo de data */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.buttonText}>
          {task.date ? new Date(task.date).toLocaleDateString() : "Selecionar Data"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={task.date ? new Date(task.date) : new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowDatePicker(Platform.OS === "ios");
            if (d) setTask({ ...task, date: d.toISOString() });
          }}
        />
      )}

      {/* Campo de hora */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.buttonText}>
          {task.time || "Selecionar Hora"}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={(e, t) => {
            setShowTimePicker(Platform.OS === "ios");
            if (t) setTask({ ...task, time: t.toLocaleTimeString() });
          }}
        />
      )}

      <Text style={styles.label}>Prioridade:</Text>
      <Picker
        selectedValue={task.priority}
        style={styles.picker}
        onValueChange={(v) => setTask({ ...task, priority: v as any })}
      >
        <Picker.Item label="Baixa" value="Baixa" />
        <Picker.Item label="Média" value="Média" />
        <Picker.Item label="Alta" value="Alta" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={task.category}
        onChangeText={(t) => setTask({ ...task, category: t })}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Alterar Imagem</Text>
      </TouchableOpacity>
      {task.image && <Image source={{ uri: task.image }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 16 },
  button: { backgroundColor: "#2196F3", padding: 16, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  imagePreview: { width: "100%", height: 200, marginBottom: 16, borderRadius: 8 },
  label: { fontSize: 16, marginBottom: 4 },
  picker: { borderWidth: 1, borderColor: "#ccc", marginBottom: 16 },
});
