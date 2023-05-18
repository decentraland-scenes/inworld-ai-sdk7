import { Entity } from "@dcl/sdk/ecs"
import { RemoteNpc } from "./remoteNpc"
import { Dialog } from "dcl-npc-toolkit"
import { Room } from "colyseus.js"
import { LobbyScene } from "./lobby-scene/lobbyScene"

export type NpcAnimationNameDef = {
  name: string
  duration: number
  autoStart?: boolean
}
export type NpcAnimationNameType = {
  IDLE: NpcAnimationNameDef
  WALK?: NpcAnimationNameDef
  RUN?: NpcAnimationNameDef
  THINKING?: NpcAnimationNameDef
  TALK?: NpcAnimationNameDef
  WAVE?: NpcAnimationNameDef
  HEART_WITH_HANDS?: NpcAnimationNameDef
  COME_ON?: NpcAnimationNameDef
}

class Registry {
	myNPC!: RemoteNpc
	activeNPC!: RemoteNpc
	allNPCs: RemoteNpc[] = []
  activeNPCSound: Map<string,Entity>=new Map()
  askWaitingForResponse!: Dialog
  lobbyScene!: LobbyScene
  serverTime: number = -1
  getServerTime(){
    if(this.serverTime > 0){
      return this.serverTime
    }
    else{
      return Date.now()
    }
  }
  onConnectActions?: (room: Room<any>, eventName: string) => void
}

export const REGISTRY = new Registry()

export function initRegistery() {

}