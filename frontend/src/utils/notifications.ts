// // src/utils/notifications.ts
// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";

// // Configura o handler das notificações (somente para mobile)
// if (Platform.OS !== "web") {
//   Notifications.setNotificationHandler({
//     handleNotification: async () => {
//       return {
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//       };
//     },
//   });
// }

// // Solicita permissão para notificações
// export async function requestPermissions(): Promise<void> {
//   if (Platform.OS !== "web") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     if (status !== "granted") {
//       alert("Precisamos da permissão para enviar notificações!");
//     }
//   }
// }

// // Agenda notificação para data/hora específica
// export async function scheduleNotification(
//   title: string,
//   body: string,
//   date: Date
// ): Promise<void> {
//   if (Platform.OS !== "web") {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title,
//         body,
//         sound: true,
//       },
//       trigger: date,
//     });
//   }
// }
// // src/utils/notifications.ts
// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";

// // Configura o handler das notificações (somente para mobile)
// if (Platform.OS !== "web") {
//   Notifications.setNotificationHandler({
//     handleNotification: async (): Promise<Notifications.NotificationBehavior> => {
//       return {
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//       };
//     },
//   });
// }

// // Solicita permissão para notificações
// export async function requestPermissions(): Promise<void> {
//   if (Platform.OS !== "web") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     if (status !== "granted") {
//       alert("Precisamos da permissão para enviar notificações!");
//     }
//   }
// }

// // Agenda notificação para data/hora específica
// export async function scheduleNotification(
//   title: string,
//   body: string,
//   date: Date
// ): Promise<void> {
//   if (Platform.OS !== "web") {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title,
//         body,
//         sound: true,
//       },
//       trigger: { date }, // Agora está correto para o Expo moderno
//     });
//   }
// }
