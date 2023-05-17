import { REGISTRY } from "../registry";
import { RemoteNpc, startThinking } from "../remoteNpc";
import { resetMessages, streamedMsgs } from "../streamdMessages";
import { GAME_STATE } from "../state";
import { ChatMessage, NpcRoomDataOptions } from "../connection/state/server-state-spec";
import { createMessageObject, sendMsgToAI } from "../utils/connectedUtils";
import { joinOrCreateRoomAsync } from "../connection/connect-flow";
import { disconnect } from "../connection/connection";
import { Room } from "colyseus.js";
import { NpcGameRoomState } from "../connection/state/client-state-spec";

const FILE_NAME: string = "LobbyScene.ts"

export class LobbyScene {
  pendingConvoWithNPC?: RemoteNpc
  pendingConvoActionWithNPC: () => void

}

export function connectNpcToLobby(host: LobbyScene, npc: RemoteNpc): void {
  host.pendingConvoWithNPC = undefined
  host.pendingConvoActionWithNPC = undefined
  REGISTRY.activeNPC = npc

  startThinking(npc, [REGISTRY.askWaitingForResponse])

  resetMessages(streamedMsgs)

  if (GAME_STATE.gameRoom && GAME_STATE.gameConnected === 'connected') {
    startConvoWithNpc(host, npc)
  }
  else {
    console.log("NPC", npc.name, "GAME_STATE.gameConnected", GAME_STATE.gameConnected, "connect first")
    host.pendingConvoWithNPC = npc
    initArena(host, false)
  }
}

function startConvoWithNpc(host: LobbyScene, npc: RemoteNpc) {
  console.log("NPC", npc.name, "GAME_STATE.gameConnected", GAME_STATE.gameConnected, "sendMsgToAI")

  //do we want this side affect?
  host.pendingConvoWithNPC = undefined

  const randomMsgs = ["Hello!", "Greetings"]
  const msgText = randomMsgs[Math.floor(Math.random() * randomMsgs.length)]
  const chatMessage: ChatMessage = createMessageObject(msgText, { resourceName: npc.config.resourceName }, GAME_STATE.gameRoom)
  sendMsgToAI(chatMessage)
}

function initArena(host: LobbyScene, force: boolean) {
  const METHOD_NAME = "initArena"
  console.log(METHOD_NAME, "ENTRY", force)

  resetBattleArena(host)

  const npcDataOptions: NpcRoomDataOptions = {
    levelId: "",
  }
  const connectOptions: any = {
    npcDataOptions: npcDataOptions,
  };

  connectOptions.playFabData = {
  };

  const roomName = "genesis_plaza"
  joinOrCreateRoomAsync(roomName, connectOptions)
}

function onConnectHost(host: LobbyScene, room: Room<NpcGameRoomState>) {
  GAME_STATE.gameRoom = room;

  if (host.pendingConvoWithNPC) {
    startConvoWithNpc(host, host.pendingConvoWithNPC)
    //do we want this side affect?
    host.pendingConvoWithNPC = undefined
  }
  if (host.pendingConvoActionWithNPC) {
    host.pendingConvoActionWithNPC()
  }
}

function disconnectHost(host: LobbyScene){
  const METHOD_NAME = "endBattle"
  console.log(METHOD_NAME,"ENTRY")
  disconnect(true)
}

function resetBattleArena(host: LobbyScene) {
  const METHOD_NAME = "resetBattleArena"
  console.log(METHOD_NAME, "ENTRY")
}