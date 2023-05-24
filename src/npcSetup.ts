import * as npcLib from 'dcl-npc-toolkit'
import { NpcAnimationNameType, REGISTRY } from './registry'
import { RemoteNpc, startThinking } from './remoteNpc'
//import { showInputOverlay } from './customNPCUI' TODO: Implement Custom UI
import { closeAllInteractions } from './utils/connectedUtils'
import { FollowPathData } from 'dcl-npc-toolkit/dist/types'
import { Vector3 } from '@dcl/sdk/math'
import { connectNpcToLobby } from './lobby-scene/lobbyScene'

const FILE_NAME: string = "npcSetup.ts"

const ANIM_TIME_PADD = .2

const DOGE_NPC_ANIMATIONS: NpcAnimationNameType = {
  IDLE: { name: "Idle", duration: -1 },
  WALK: { name: "Walk", duration: -1 },
  TALK: { name: "Talk1", duration: 5 },
  THINKING: { name: "Thinking", duration: 5 },
  RUN: { name: "Run", duration: -1 },
  WAVE: { name: "Wave", duration: 4 + ANIM_TIME_PADD },
}

let doge: RemoteNpc
let simonas: RemoteNpc
let npcBluntBobby: RemoteNpc

export function setupNPC() {
  console.log("setupNPC", "ENTRY")

  // createDogeNpc()  
  createSimonas()  

  if (npcBluntBobby) REGISTRY.allNPCs.push(npcBluntBobby)

  for (const p of REGISTRY.allNPCs) {
    //TODO: Set Display text to center
    console.error("Check: ", FILE_NAME, 184);
    //p.npc.dialog.text.hTextAlign = 'center'
  }

  console.log("setupNPC", "RETURN")
}

function createDogeNpc() {
  const offsetpath = 5
  let dogePathPoints = [
    Vector3.create(offsetpath, .24, offsetpath),
    Vector3.create(offsetpath, .24, 16 - offsetpath),
    Vector3.create(16 - offsetpath, .24, 16 - offsetpath),
    Vector3.create(16 - offsetpath, .24, offsetpath)
  ]
  let dogePath: FollowPathData = {
    path: dogePathPoints,
    totalDuration: dogePathPoints.length * 6,
    loop: true,
    // curve: true,
  }

  doge = new RemoteNpc(
    { resourceName: "workspaces/genesis_city/characters/doge" },
    {
      transformData:
      {
        position: Vector3.clone(dogePath.path[0]),
        scale: Vector3.create(2, 2, 2)
      },
      npcData: {
        type: npcLib.NPCType.CUSTOM,
        model: 'models/dogeNPC_anim4.glb',//'models/robots/marsha.glb',//'models/Placeholder_NPC_02.glb',
        onActivate: () => {
          console.log('doge.NPC activated!')
          connectNpcToLobby(REGISTRY.lobbyScene, doge)
          return
          REGISTRY.activeNPC = doge
          closeAllInteractions({ exclude: REGISTRY.activeNPC })
          startThinking(doge, [REGISTRY.askWaitingForResponse])

        },
        onWalkAway: () => {
          console.log("NPC", doge.name, 'on walked away')
          const LOOP = false

          if (doge.npcAnimations.WALK) npcLib.playAnimation(doge.entity, doge.npcAnimations.WALK.name, LOOP, doge.npcAnimations.WALK.duration)
          npcLib.followPath(doge.entity, dogePath)
          const NO_LOOP = true
          //if(doge.npcAnimations.WAVE) doge.npc.playAnimation(doge.npcAnimations.WAVE.name, NO_LOOP,doge.npcAnimations.WAVE.duration)
        },
        idleAnim: DOGE_NPC_ANIMATIONS.IDLE.name,
        walkingAnim: DOGE_NPC_ANIMATIONS.WALK.name,
        faceUser: true,//continue to face user???
        //portrait:
        //{
        //  path: 'images/portraits/doge.png', height: 300, width: 300
        //  , offsetX: -10, offsetY: 0
        //  , section: { sourceHeight: 256, sourceWidth: 256 }
        //},
        darkUI: true,
        coolDownDuration: 3,
        hoverText: 'WOW',
        onlyETrigger: true,
        onlyClickTrigger: false,
        onlyExternalTrigger: false,
        reactDistance: 5,
        continueOnWalkAway: true,
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
        //TODO: Implement UI
        console.error(FILE_NAME, "Missing UI", 97)
        //showInputOverlay(true)
      }
      , onEndOfInteraction: () => {
        //showInputOverlay(true)
        const LOOP = false
        if (doge.npcAnimations.WALK) npcLib.playAnimation(doge.entity, doge.npcAnimations.WALK.name, LOOP, doge.npcAnimations.WALK.duration)
        //npcLib.followPath(doge.entity, dogePath)
      }
    }
  )
  doge.name = "npc.doge"
  npcLib.followPath(doge.entity, dogePath)
  //doge.showThinking(true)

  REGISTRY.allNPCs.push(doge)
}

const SIMONAS_NPC_ANIMATIONS: NpcAnimationNameType = {
  HI: { name: "Hi", duration: 5 },
  IDLE: { name: "Idle", duration: -1 },
  TALKING: { name: "Talking", duration: 5 },
  THINKING: { name: "Thinking", duration: 5 },
  LOADING: { name: "Loading", duration: 5 },
  LAUGH: { name: "Laugh", duration: 5 },
  HAPPY: { name: "Happy", duration: 5 },
  SAD: { name: "Sad", duration: 5 },
  SURPRISE: { name: "Surprise", duration: 5 },
}

function createSimonas() {
  simonas = new RemoteNpc(
    { resourceName: "workspaces/genesis_city/characters/simone" },
    {
      transformData: { position: Vector3.create(6, 1.5, 6), scale: Vector3.create(1, 1, 1) },
      npcData: {
        type: npcLib.NPCType.CUSTOM,
        model: 'models/Simone_Anim.glb',//'models/robots/marsha.glb',//'models/Placeholder_NPC_02.glb',
        onActivate: () => {
          console.log('Simonas.NPC activated!')
          connectNpcToLobby(REGISTRY.lobbyScene, simonas)
          return
          REGISTRY.activeNPC = simonas
          closeAllInteractions({ exclude: REGISTRY.activeNPC })
          startThinking(simonas, [REGISTRY.askWaitingForResponse])
        },
        onWalkAway: () => {
          console.log("NPC", simonas.name, 'on walked away')
          const LOOP = false

          //if(doge.npcAnimations.WALK) doge.npc.playAnimation(doge.npcAnimations.WALK.name, LOOP,doge.npcAnimations.WALK.duration)
          //doge.npc.followPath()
          const NO_LOOP = true
          if (doge.npcAnimations.WAVE) npcLib.playAnimation(simonas.entity, simonas.npcAnimations.WAVE.name, NO_LOOP, simonas.npcAnimations.WAVE.duration)
        },
        idleAnim: SIMONAS_NPC_ANIMATIONS.IDLE.name,
        walkingAnim: SIMONAS_NPC_ANIMATIONS.WALK.name,
        //faceUser: true,//continue to face user???
        //portrait:
        //{
        //  path: 'images/portraits/marsha.png', height: 300, width: 300
        //  , offsetX: -10, offsetY: 0
        //  , section: { sourceHeight: 384, sourceWidth: 384 }
        //},
        darkUI: true,
        coolDownDuration: 3,
        hoverText: 'Talk',
        onlyETrigger: true,
        onlyClickTrigger: false,
        onlyExternalTrigger: false,
        reactDistance: 5,
        continueOnWalkAway: true,
      }
    },
    {
      npcAnimations: DOGE_NPC_ANIMATIONS,
      thinking: {
        enabled: true,
        modelPath: 'models/loading-icon.glb',
        modelScale: Vector3.create(4, 4, 4),
        modelOffset: Vector3.create(0, 1, 0),
        offsetX: 0,
        offsetY: 1,
        offsetZ: 0,
        textScale: Vector3.create(2, 2, 2),
        textOffset: Vector3.create(0, -1, 0)
      }
      , onEndOfRemoteInteractionStream: () => {
        //TODO: Implement Missing UI
        console.error(FILE_NAME, "Missing UI", 166)
        //showInputOverlay(true)
      }
      , onEndOfInteraction: () => {
        //showInputOverlay(true)

      }
    }
  )
  simonas.name = "npc.dclGuide"

  REGISTRY.allNPCs.push(simonas)

}