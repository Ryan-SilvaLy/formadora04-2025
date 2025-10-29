import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import EditTaskScreen from "./screens/EditTaskScreen"; // ✅ nova tela

export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  EditTask: { taskId: string }; // ✅ passa o ID da tarefa
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Tarefas" }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: "Nova Tarefa" }} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: "Editar Tarefa" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
