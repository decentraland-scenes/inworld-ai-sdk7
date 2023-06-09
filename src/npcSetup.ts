import * as npcLib from 'dcl-npc-toolkit'
import { NpcAnimationNameType, REGISTRY } from './registry'
import { RemoteNpc, hideThinking } from './remoteNpc'
import { FollowPathData } from 'dcl-npc-toolkit/dist/types'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { connectNpcToLobby } from './lobby-scene/lobbyScene'
import { genericPrefinedQuestions } from './NPCs/customUIFunctionality'
import { closeCustomUI, openCustomUI } from './NPCs/customUi'
import { ColliderLayer, TextShape, Transform, engine } from '@dcl/sdk/ecs'
import { CONFIG } from './config'

const FILE_NAME: string = "npcSetup.ts"

const ANIM_TIME_PADD = .2

const DOGE_NPC_ANIMATIONS: NpcAnimationNameType = {
  IDLE: { name: "Idle", duration: -1 },
  WALK: { name: "Walk", duration: -1 },
  TALK: { name: "Talk1", duration: 5 },
  THINKING: { name: "Thinking", duration: 5 },
  RUN: { name: "Run", duration: -1 },
  WAVE: { name: "Wave", duration: 4 + ANIM_TIME_PADD },
  LAUGH: { name: "Laugh", duration: 2, autoStart: undefined },
  HAPPY: { name: "Happy", duration: 2, autoStart: undefined },
  SAD: { name: "Sad", duration: 2, autoStart: undefined },
  SURPRISE: { name: "Surprise", duration: 2, autoStart: undefined }
}

const SIMONAS_NPC_ANIMATIONS: NpcAnimationNameType = {
  HI: { name: "Hi", duration: 2, autoStart: undefined, portraitPath: "images/portraits/simone/hi1.png" },
  IDLE: { name: "Idle", duration: 4, autoStart: undefined, portraitPath: "images/portraits/simone/idle1.png" },
  TALK: { name: "Talking", duration: 2, autoStart: undefined, portraitPath: "images/portraits/simone/talking1.png" },
  THINKING: { name: "Thinking", duration: 2, autoStart: undefined, portraitPath: "images/portraits/simone/interesting1.png" },
  LOADING: { name: "Loading", duration: 2, autoStart: undefined, portraitPath: "images/portraits/simone/interesting1.png" },
  LAUGH: { name: "Laugh", duration: 2, autoStart: undefined, portraitPath: "images/portraits/simone/laughing1.png" },
  HAPPY: { name: "Happy", duration: 2, autoStart: undefined, portraitPath: "images/portraits/simone/happy1.png" },
  SAD: { name: "Sad", duration: 2, autoStart: undefined, portraitPath: "images/portraits/simone/sad1.png" },
  SURPRISE: { name: "Surprise", duration: 2, autoStart: undefined, portraitPath: "images/portraits/simone/surprise1.png" },
}

export function setupNPC() {
  console.log("setupNPC", "ENTRY")

  createDogeNpc()
  createSimonas()

  for (const p of REGISTRY.allNPCs) {
    //TODO: Set Display text to center
    console.error("Check:" + FILE_NAME + 184);
    //p.npc.dialog.text.hTextAlign = 'center'
  }

  console.log("setupNPC", "RESOLVED")
}

function createDogeNpc() {
  let doge: RemoteNpc
  const offsetpath = 3
  let dogePathPoints = [
    Vector3.create(offsetpath, .24, offsetpath),
    Vector3.create(offsetpath, .24, 16 - offsetpath),
    Vector3.create(16 - offsetpath, .24, 16 - offsetpath),
    Vector3.create(16 - offsetpath, .24, offsetpath)
  ]
  let dogePathData: FollowPathData = {
    path: dogePathPoints,
    totalDuration: dogePathPoints.length * 6,
    loop: true,
    onFinishCallback() {
      console.log("Finished => FollowPath()");
      npcLib.followPath(doge.entity, dogePathData)
    }
  }

  for (let index = 0; index < dogePathPoints.length; index++) {
    const element = dogePathPoints[index];
    createDebugEntity("Position: " + index.toString(), Vector3.add(element, Vector3.create(0, 0.5, 0)))
  }

  doge = new RemoteNpc(
    { resourceName: "workspaces/genesis_city/characters/doge" },
    {
      transformData:
      {
        position: Vector3.clone(dogePathData.path[0]),
        scale: Vector3.create(2, 2, 2)
      },
      npcData: {
        type: npcLib.NPCType.CUSTOM,
        model: {
          src: 'models/dogeNPC_anim4.glb',
          //visibleMeshesCollisionMask: ColliderLayer.CL_POINTER | ColliderLayer.CL_PHYSICS,
          //invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
        },//'models/robots/marsha.glb',//'models/Placeholder_NPC_02.glb',
        onActivate: () => {
          console.log('doge.NPC activated!')
          connectNpcToLobby(REGISTRY.lobbyScene, doge)
        },
        onWalkAway: () => {
          console.log("NPC", doge.name, 'walked away')
          closeCustomUI(false)//already in walkaway dont trigger second time
          hideThinking(doge)
          if (REGISTRY.activeNPC === doge) REGISTRY.activeNPC = undefined
          const LOOP = false
          npcLib.followPath(doge.entity, dogePathData)
        },
        idleAnim: DOGE_NPC_ANIMATIONS.IDLE.name,
        walkingAnim: DOGE_NPC_ANIMATIONS.WALK.name,
        faceUser: true,//continue to face user???
        portrait:
        {
          path: 'images/portraits/doge.png', height: 300, width: 300
          , offsetX: -100, offsetY: 0
          , section: { sourceHeight: 256, sourceWidth: 256 }
        },
        darkUI: true,
        coolDownDuration: 3,
        hoverText: 'WOW',
        onlyETrigger: true,
        onlyClickTrigger: false,
        onlyExternalTrigger: false,
        reactDistance: 5,
        continueOnWalkAway: false,
        //dialogCustomTheme: RESOURCES.textures.dialogAtlas,
      }
    },
    {
      npcAnimations: DOGE_NPC_ANIMATIONS,
      thinking: {
        enabled: true,
        modelPath: 'models/loading-icon.glb',
        offsetX: 0,
        offsetY: 2,
        offsetZ: 0
      }
      , onEndOfRemoteInteractionStream: () => {
        openCustomUI()
      }
      , onEndOfInteraction: () => {
      },
      predefinedQuestions: genericPrefinedQuestions
    }
  )
  doge.name = "npc.doge"
  npcLib.followPath(doge.entity, dogePathData)

  REGISTRY.allNPCs.push(doge)
}

function createSimonas() {
  let simonas: RemoteNpc
  simonas = new RemoteNpc(
    { resourceName: "workspaces/genesis_city/characters/simone" },
    {
      transformData: { position: Vector3.create(6, 0, 6), scale: Vector3.create(1, 1, 1) },
      npcData: {
        type: npcLib.NPCType.CUSTOM,
        model: {
          src: 'models/Simone_Anim_Collider.glb',
          visibleMeshesCollisionMask: ColliderLayer.CL_NONE,
          invisibleMeshesCollisionMask: ColliderLayer.CL_POINTER | ColliderLayer.CL_PHYSICS
        },//'models/Simone_Anim.glb',
        onActivate: () => {
          console.log('simonas.NPC activated!')
          connectNpcToLobby(REGISTRY.lobbyScene, simonas)
        },
        onWalkAway: () => {
          closeCustomUI(false)//already in walkaway dont trigger second time
          hideThinking(simonas)
          if (REGISTRY.activeNPC === simonas) REGISTRY.activeNPC = undefined
          console.log("NPC", simonas.name, 'on walked away')
          const NO_LOOP = true
          if (simonas.npcAnimations.SAD) npcLib.playAnimation(simonas.entity, simonas.npcAnimations.SAD.name, true, simonas.npcAnimations.SAD.duration)
        },
        idleAnim: SIMONAS_NPC_ANIMATIONS.IDLE.name,
        //walkingAnim: DOGE_NPC_ANIMATIONS.WALK.name,
        faceUser: true,
        portrait:
        {
          path: SIMONAS_NPC_ANIMATIONS.IDLE.portraitPath, height: 320, width: 320
          , offsetX: -60, offsetY: -40
          , section: { sourceHeight: 384, sourceWidth: 384 }
        },
        darkUI: true,
        coolDownDuration: 3,
        hoverText: 'Talk',
        onlyETrigger: true,
        onlyClickTrigger: false,
        onlyExternalTrigger: false,
        reactDistance: 5,
        continueOnWalkAway: false,
      }
    },
    {
      npcAnimations: SIMONAS_NPC_ANIMATIONS,
      thinking: {
        enabled: true,
        modelPath: 'models/loading-icon.glb',
        offsetX: 0,
        offsetY: 2.3,
        offsetZ: 0
      }
      , onEndOfRemoteInteractionStream: () => {
        openCustomUI()
      }
      , onEndOfInteraction: () => { },
      predefinedQuestions: genericPrefinedQuestions
    }
  )

  simonas.name = "npc.simonas"
  REGISTRY.allNPCs.push(simonas)
}

function createDebugEntity(text: string, position: Vector3) {
  if (!CONFIG.PATH_DEBUG) return
  let test = engine.addEntity()
  Transform.create(test, {
    position: position,
    scale: Vector3.create(.25, .25, .25)
  })
  TextShape.create(test, {
    text: text,
    textColor: Color4.Black()
  })
}