import { engine, MeshRenderer, MeshCollider, Transform, GltfContainer } from '@dcl/sdk/ecs'
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
import { movePlayerTo } from '~system/RestrictedActions'
import { skyboxPZ, skyboxRoot } from './skybox/skybox'
import { height, sceneSizeX, sceneSizeZ } from './skybox/resources'


//#region skybox
export function main() {
  Transform.getMutable(skyboxPZ)
}

let testPlatform = engine.addEntity()
Transform.create(testPlatform, {
  position: Vector3.create(sceneSizeX/2,height/2,sceneSizeZ/2),
  scale: Vector3.create(16,1,16)
})
MeshCollider.setBox(testPlatform)
 
let ring = engine.addEntity()
GltfContainer.create(ring, {
  src: "models/platform/ring.glb"
})
Transform.create(ring, {
  position: Vector3.create(sceneSizeX/2,height/2,sceneSizeZ/2),
  scale: Vector3.create(1,1,1)
})



movePlayerTo({newRelativePosition: Vector3.create(sceneSizeX/2,height/2 + 5,sceneSizeZ/2)})


//#endregion


// export all the functions required to make the scene work
export * from '@dcl/sdk'

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