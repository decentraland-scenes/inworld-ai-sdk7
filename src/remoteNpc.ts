import { Entity, GltfContainer, MeshRenderer, TextShape, Transform, engine, removeEntityWithChildren } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { NpcAnimationNameType } from "./registry"
import * as npcLib from 'dcl-npc-toolkit'
import * as utils from '@dcl-sdk/utils'
import { NpcCreationArgs, createNpc } from "./npcHelper"
import { closeDialog } from "dcl-npc-toolkit/dist/dialog"

const FILE_NAME: string = "remoteNpc.ts"

export class RemoteNpcConfig {
  /**
   * inworlds needs the resource name of the character
   */
  resourceName: string
  /**
   * id for internal scene usage, could be same as resource name
   */
  id?: string
}

export type QuestionData = {
  displayQuestion: string
  queryToAi: string
}

export type RemoteNpcThinkingOptions = {
  enabled: boolean
  modelPath?: string//TODO: this was a GLTF component so figure that out
  modelScale?: Vector3
  modelOffset?: Vector3
  textEnabled?:boolean
  text?: string
  textScale?: Vector3
  textOffset?: Vector3
  offsetX?: number
  offsetY?: number
  offsetZ?: number
}

export type RemoteNpcOptions = {
  loadingIcon?: { enable: boolean }//TODO USE THIS
  npcAnimations?: NpcAnimationNameType
  thinking?: RemoteNpcThinkingOptions
  onEndOfRemoteInteractionStream: () => void
  onEndOfInteraction: () => void
}

export class RemoteNpc {
  entity: Entity//TODO: this was NPC (inheriting class to Entity) so figure this out  
  name: string
  config: RemoteNpcConfig
  args?: RemoteNpcOptions

  thinkingIconEnabled: boolean = false
  thinkingIconRoot: Entity
  thinkingIcon: Entity
  thinkingIconText: Entity
  isThinking: boolean = false
  npcAnimations: NpcAnimationNameType

  onEndOfRemoteInteractionStream: () => void
  onEndOfInteraction: () => void

  /**
   * 
   * @param inConfig configuration needed for remote npc
   * @param npc normal configuration for NPC @see https://github.com/decentraland/decentraland-npc-utils
   * @param inArgs additional configuration arts for remote npc intance
   */
  constructor(inConfig: RemoteNpcConfig, npcCreationArgs: NpcCreationArgs, inArgs?: RemoteNpcOptions) {
    this.entity = createNpc(npcCreationArgs)
    this.config = inConfig
    this.args = inArgs

    if (inArgs) {
      if (inArgs.npcAnimations)
        this.npcAnimations = inArgs?.npcAnimations

      this.onEndOfRemoteInteractionStream = inArgs.onEndOfRemoteInteractionStream
      this.onEndOfInteraction = inArgs.onEndOfInteraction
    }

    this.isThinking = false
  }

}

function cancelThinking(npc: RemoteNpc): void {
  if (npc.thinkingIconRoot) {
    removeEntityWithChildren(engine, npc.thinkingIconRoot)
    npc.isThinking = false
  }
}

function showThinking(npc: RemoteNpc): void {

  if (!npc.thinkingIconEnabled) return
  if (npc.isThinking) return

  const defaultWaitingOffsetX = 0
  const defaultWaitingOffsetY = 2.3
  const defaultWaitingOffsetZ = 0
  const TEXT_HEIGHT = -1

  npc.thinkingIconRoot = engine.addEntity()
  npc.thinkingIcon = engine.addEntity()
  npc.thinkingIconText = engine.addEntity()


  setParent(npc.entity, npc.thinkingIconRoot)
  setParent(npc.thinkingIconRoot, npc.thinkingIcon)
  setParent(npc.thinkingIconRoot, npc.thinkingIconText)

  const args = npc.args

  if (args) {
    npc.thinkingIconEnabled = args.thinking !== undefined && args.thinking.enabled

    Transform.create(npc.thinkingIconRoot, {
      position: Vector3.create(
        args.thinking?.offsetX ? args.thinking?.offsetX : defaultWaitingOffsetX
        , args.thinking?.offsetY ? args.thinking?.offsetY : defaultWaitingOffsetY
        , args.thinking?.offsetZ ? args.thinking?.offsetZ : defaultWaitingOffsetZ
      ),
      scale: Vector3.create(.1, .1, .1)
    })

    if(npc.thinkingIconEnabled && (args.thinking.textEnabled === undefined || args.thinking.textEnabled)){
      TextShape.create(npc.thinkingIconText, {
        text: args.thinking?.text ? args.thinking.text : "Thinking..."
      })

      if (args.thinking?.modelPath) {
        GltfContainer.create(npc.thinkingIcon, {
          src: args.thinking.modelPath
        })
        //this.thinkingIcon.addComponent(new KeepRotatingComponent(Quaternion.Euler(0,25,0)))
      }
      else {
        MeshRenderer.setBox(npc.thinkingIcon)
        infiniteRotation(
          npc.thinkingIcon,
          Vector3.create(0, 0, 0),
          Vector3.create(0, 360, 0),
          2
        )
      }
    }

    Transform.create(npc.thinkingIconText, {
      position: args.thinking?.textOffset ? args.thinking.textOffset : Vector3.create(0, TEXT_HEIGHT, 0),
      scale: args.thinking?.textScale ? args.thinking?.textScale : Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 180, 0)
    })

  }
  npc.isThinking = true
}

function setParent(parent: Entity, child: Entity): void {
  Transform.getOrCreateMutable(child).parent = parent
}

function infiniteRotation(entity: Entity, start: Vector3, end: Vector3, duration: number): void {
  utils.tweens.startRotation(
    entity,
    Quaternion.fromEulerDegrees(start.x, start.y, start.z),
    Quaternion.fromEulerDegrees(end.x, end.y, end.z),
    duration,
    utils.InterpolationType.LINEAR,
    () => {
      infiniteRotation(entity, start, end, duration)
    }
  )
}

export function startThinking(npc: RemoteNpc, dialog: npcLib.Dialog[]): void {
  const METHOD_NAME = "startThinking"
  console.log(FILE_NAME, METHOD_NAME, "Entry", npc.name, dialog);
  showThinking(npc)

  if (npc.npcAnimations.THINKING) npcLib.playAnimation(npc.entity, npc.npcAnimations.THINKING.name, true, npc.npcAnimations.THINKING.duration)
  npcLib.talk(npc.entity, dialog)
}

export function endInteraction(npc: RemoteNpc) {
  console.log("NPC.endInteraction", "ENTRY", npc.name)
  closeDialog(npc.entity)
  cancelThinking(npc)
  if (npc.onEndOfInteraction) npc.onEndOfInteraction()
}

export function endOfRemoteInteractionStream(npc: RemoteNpc) {
  console.log("NPC.endOfRemoteInteractionStream","ENTRY",npc.name)
  if(npc.onEndOfRemoteInteractionStream) npc.onEndOfRemoteInteractionStream()
}

export function goodBye(npc: RemoteNpc){
  console.log("NPC.goodbye","ENTRY",npc.name)
  npcLib.handleWalkAway(npc.entity)
}