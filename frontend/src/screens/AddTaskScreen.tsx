import React, { useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { addTarefa, Tarefa } from "../api/tarefas";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function AddTaskScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [priority, setPriority] = useState<"Baixa" | "Média" | "Alta">("Média");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Escolher imagem
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
      setImage(`data:image/jpeg;base64,${manipResult.base64}`);
    }
  };

  // Adicionar tarefa
  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert("Erro", "Digite um título para a tarefa");
      return;
    }

    if (!date) {
      Alert.alert("Erro", "Selecione uma data para a tarefa");
      return;
    }

    // Validação: não aceitar datas passadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert("Erro", "Não é permitido escolher datas passadas");
      return;
    }

    const newTask: Tarefa = {
      title,
      description,
      date: date.toISOString(),
      time: time ? time.toLocaleTimeString() : undefined,
      priority,
      category,
      image: image ?? undefined,
    };

    try {
      await addTarefa(newTask);
      Alert.alert("Sucesso", "Tarefa adicionada com sucesso!");
      setTitle("");
      setDescription("");
      setDate(null);
      setTime(null);
      setPriority("Média");
      setCategory("");
      setImage(null);
    } catch (err) {
      console.log("Erro ao adicionar tarefa:", err);
      Alert.alert("Erro", "Não foi possível adicionar a tarefa");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Tarefa</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />

      {/* 🗓️ Campo de Data */}
      {Platform.OS === "web" ? (
        <input
          type="date"
          value={date ? date.toISOString().split("T")[0] : ""}
          min={new Date().toISOString().split("T")[0]} // bloqueia datas passadas
          onChange={(e) => setDate(new Date(e.target.value))}
          style={styles.htmlInput}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.buttonText}>
              {date ? date.toLocaleDateString() : "Selecionar Data"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()} // bloqueia datas passadas
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      {/* ⏰ Campo de Hora */}
      {Platform.OS === "web" ? (
        <input
          type="time"
          value={
            time
              ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : ""
          }
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(":").map(Number);
            const newTime = new Date();
            newTime.setHours(hours, minutes);
            setTime(newTime);
          }}
          style={styles.htmlInput}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.buttonText}>
              {time ? time.toLocaleTimeString() : "Selecionar Hora"}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(Platform.OS === "ios");
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}
        </>
      )}

      <Text style={styles.label}>Prioridade:</Text>
      <Picker
        selectedValue={priority}
        style={styles.picker}
        onValueChange={(itemValue) => setPriority(itemValue as any)}
      >
        <Picker.Item label="Baixa" value="Baixa" />
        <Picker.Item label="Média" value="Média" />
        <Picker.Item label="Alta" value="Alta" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Escolher Imagem</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Adicionar Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  imagePreview: { width: "100%", height: 200, marginBottom: 16, borderRadius: 8 },
  label: { fontSize: 16, marginBottom: 4 },
  picker: { borderWidth: 1, borderColor: "#ccc", marginBottom: 16 },
  htmlInput: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
});
