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

//docs say will fire after 1 minute
/*
onIdleStateChangedObservable.add(({ isIdle }) => {
  log("Idle State change: ", isIdle)
  if (isIdle) {
    //prevent too many connnections for AFKers, it will auto reconnect if u interact with something again
    REGISTRY.lobbyScene.endBattle()
  }
})
*/

setupUI()