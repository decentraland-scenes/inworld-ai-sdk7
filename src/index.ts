import { engine, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { initRegistery, REGISTRY } from './registry'
import { initDialogs } from './waitingDialog'
import { setupNPC } from './npcSetup'
import { LobbyScene } from './lobby-scene/lobbyScene'
import { Room } from 'colyseus.js'
import { onNpcRoomConnect } from './connection/onConnect'
import "./polyfill/delcares";
import { initConfig } from './config'
import { setUpUI as setupUI } from './ui'
import { initIdleStateChangedObservable, onIdleStateChangedObservableAdd } from './back-ports/onIdleStateChangedObservables'

// export all the functions required to make the scene work
export * from '@dcl/sdk'

const floor = engine.addEntity()
MeshRenderer.setBox(floor)
Transform.create(floor, {
  position: Vector3.create(16 / 2, .1, 16 / 2),
  scale: Vector3.create(16, .1, 16)
})

initRegistery()
initConfig()
initDialogs()

REGISTRY.lobbyScene = new LobbyScene()

setupNPC()


REGISTRY.onConnectActions = (room: Room<any>, eventName: string) => {
  //npcConn.onNpcRoomConnect(room)
  onNpcRoomConnect(room)
}
initIdleStateChangedObservable() 
onIdleStateChangedObservableAdd((isIdle:boolean)=>{
  if(isIdle){ 
    console.log("index.ts","onIdleStateChangedObservableAdd","player is idle")
  }else{
    console.log("index.ts","onIdleStateChangedObservableAdd","player is active")
  }
})

setupUI()