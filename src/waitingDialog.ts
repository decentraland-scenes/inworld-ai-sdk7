import { Dialog } from "dcl-npc-toolkit";
import { REGISTRY } from "./registry";

const askWaitingForResponse: Dialog = {
  name: "waiting-for-response",
  text: "...",
  //offsetX: 60,
  isQuestion: false,
  skipable: false,
  isEndOfDialog: true
}

export function initDialogs() {
  REGISTRY.askWaitingForResponse = askWaitingForResponse
}