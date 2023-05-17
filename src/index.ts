import { engine, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { initRegistery } from './registry'

// export all the functions required to make the scene work
export * from '@dcl/sdk'


const floor = engine.addEntity()
MeshRenderer.setBox(floor)
Transform.create(floor, {
  position: Vector3.create(16 / 2, .1, 16 / 2),
  scale: Vector3.create(16, .1, 16)
})

initRegistery()