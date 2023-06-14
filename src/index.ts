import { engine, MeshRenderer, MeshCollider, Transform, GltfContainer, pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
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
/*
let testPlatform = engine.addEntity()
Transform.create(testPlatform, {
  position: Vector3.create(sceneSizeX/2,height/2,sceneSizeZ/2),
  scale: Vector3.create(16,1,16)
})
MeshCollider.setBox(testPlatform)*/
 

let ring = engine.addEntity()
GltfContainer.create(ring, { 
  src: "models/platform/ring.glb"
}) 
Transform.create(ring, {
  position: Vector3.create(sceneSizeX/2 + 6,height/2 - 0.5,sceneSizeZ/2),
  scale: Vector3.create(1,1,1),
  rotation: Quaternion.create(0, 1, 0)
})

let ring2 = engine.addEntity()
GltfContainer.create(ring2, { 
  src: "models/platform/ring.glb"
}) 
Transform.create(ring2, {
  position: Vector3.create(sceneSizeX/2 -5 ,height/2 - 0.5,sceneSizeZ/2),
  scale: Vector3.create(1,1,1),
  rotation: Quaternion.create(0, 1, 0)
})

let ring3 = engine.addEntity()
GltfContainer.create(ring3, { 
  src: "models/platform/ring.glb"
}) 
Transform.create(ring3, {
  position: Vector3.create(sceneSizeX/2 - 9,height/2 - 0.5,sceneSizeZ/2),
  scale: Vector3.create(.71,.71,.71),
  rotation: Quaternion.create(0, 1, 0)
})

let circle = engine.addEntity()
GltfContainer.create(circle, {
  src: "models/platform/circle.glb"
})
Transform.create(circle, {
  position: Vector3.create(sceneSizeX/2,height/2,sceneSizeZ/2),
  scale: Vector3.create(1.5,1.5,2),
  rotation: Quaternion.create(0, 1, 0)
})

let base = engine.addEntity()
GltfContainer.create(base, {
  src: "models/platform/base.glb"
})
Transform.create(base, {
  position: Vector3.create(sceneSizeX/2,height/2,sceneSizeZ/2),
  scale: Vector3.create(1.6,1.6,1.95),
  rotation: Quaternion.create(0, 1, 0)
})

//TELEPORT
const clickableEntity = engine.addEntity()
MeshRenderer.setBox(clickableEntity)
MeshCollider.setBox(clickableEntity)
Transform.create(clickableEntity, {position: Vector3.create(sceneSizeX/2, 1, sceneSizeZ/2)})

pointerEventsSystem.onPointerDown(
  clickableEntity,
  function () {
    movePlayerTo({newRelativePosition: Vector3.create(sceneSizeX/2,height/2 + 2,sceneSizeZ/2)})
  },
  {
    button: InputAction.IA_POINTER,
    hoverText: 'Click'
  }
)





//#endregion








function SimpleRotate() {
	let transform = Transform.getMutable(ring)
	transform.rotation = Quaternion.multiply(transform.rotation, Quaternion.fromAngleAxis(0.05, Vector3.Forward()))

  let transform2 = Transform.getMutable(ring2)
	transform2.rotation = Quaternion.multiply(transform2.rotation, Quaternion.fromAngleAxis(-0.5, Vector3.Forward()))

  let transform3 = Transform.getMutable(ring3)
	transform3.rotation = Quaternion.multiply(transform3.rotation, Quaternion.fromAngleAxis(1, Vector3.Forward()))
}

engine.addSystem(SimpleRotate)




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