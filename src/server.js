import { getChatIds } from "./chatId/getChatIds.js";
import { startTelegramBot } from "./telegram/telegram.js";

export const serverStartup = async () => {
  console.log("App started");
  // let chatIds = await getChatIds(); 
  // console.log("🚀 ~ file: server.js ~ line 7 ~ serverStartup ~ chatIds", chatIds)
  startTelegramBot();
};
