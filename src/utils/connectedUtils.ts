import { Room } from "colyseus.js";

import { GAME_STATE } from "../state";
import * as clientState from "../connection/state/client-state-spec";
import * as serverStateSpec from "../connection/state/server-state-spec";


import { REGISTRY } from "../registry";
import { RemoteNpc, endInteraction, startThinking } from "../remoteNpc";
import { closeDialog } from "dcl-npc-toolkit/dist/dialog";

/**
 * NOTE endInteraction results in player going into STANDING state, need way to resume last action
 * @param ignore 
 */
export function closeAllInteractions(opts?: { exclude?: RemoteNpc, resumeLastActivity?: boolean }) {
  for (const npc of REGISTRY.allNPCs) {
    if (opts?.exclude === undefined || npc != opts.exclude) {
      console.log("closeAllInteractions ", npc.name)
      endInteraction(npc)

      //if(REGISTRY.activeNPCSound.get())
      //p.dialog.closeDialogWindow()
    } else {
      //just close the dialog
      closeDialog(npc.entity)
    }
  }
}

export function sendMsgToAI(msg: serverStateSpec.ChatMessage) {
  if (msg === undefined || msg.text.text.trim().length === 0) {
    console.error("Missing UI Implementation");
    //TODO: (Custom UI) ui.displayAnnouncement("cannot send empty message")
    return
  }
  console.log("sendMsgToAI", msg)
  //hide input
  console.error("Missing UI Implementation");
  //TODO: (Custom UI) showInputOverlay(false)
  //mark waiting for reply
  startThinking(REGISTRY.activeNPC, [REGISTRY.askWaitingForResponse])
  //wrap it in object
  if (GAME_STATE.gameRoom) GAME_STATE.gameRoom.send("message", msg)
}

let lastCharacterId: serverStateSpec.CharacterId = undefined

export function createMessageObject(msgText: string, characterId: serverStateSpec.CharacterId, room: Room<clientState.NpcGameRoomState>) {
  const chatMessage: serverStateSpec.ChatMessage = new serverStateSpec.ChatMessage({
    date: new Date().toUTCString(),
    packetId: { interactionId: "", packetId: "", utteranceId: "" },
    type: serverStateSpec.ChatPacketType.TEXT,
    text: { text: msgText, final: true },
    routing:
    {
      source: { isCharacter: false, isPlayer: true, name: room.sessionId, xId: { resourceName: room.sessionId } }
      , target: { isCharacter: true, isPlayer: false, name: "", xId: characterId ? characterId : lastCharacterId }
    },
  })
  if (!characterId) {
    console.log("createMessageObject using lastCharacterId", lastCharacterId)
  }
  if (characterId) lastCharacterId = characterId
  return chatMessage
}


