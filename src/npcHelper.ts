import { Entity } from "@dcl/sdk/ecs";
import * as npcLib from "dcl-npc-toolkit";
import { NPCData } from "dcl-npc-toolkit/dist/types";
import { ChatPart } from "./streamedMsgs";
import { NpcAnimationNameDef, REGISTRY } from "./registry";
import { EmotionBehaviorCode } from "./connection/state/server-state-spec";

export class NpcCreationArgs {
  transformData: any
  npcData: NPCData
}

export function createNpc(args: NpcCreationArgs): Entity {
  const npc = npcLib.create(
    {
      position: args.transformData.position,
      rotation: args.transformData.rotation,
      scale: args.transformData.scale,
    },
    args.npcData
  )

  npcLib.getData(npc).portrait = args.npcData.portrait

  return npc
}

export function getNpcEmotion(emotion: ChatPart) {
  const activeNpc = REGISTRY.activeNPC;

  let npcData = (npcLib.getData(activeNpc.entity) as NPCData)
  const defaultEmotion: NpcAnimationNameDef = {
    portraitDirectory: REGISTRY.activeNPC.args.npcAnimations.IDLE.portraitDirectory,
    name: REGISTRY.activeNPC.args.npcAnimations.IDLE.name,
    duration: 2
  }

  if (!emotion) {
    return defaultEmotion
  }

  let result: NpcAnimationNameDef = undefined;
  switch (emotion.packet.emotions.behavior) {
    case EmotionBehaviorCode.JOY:
      result = activeNpc.args.npcAnimations.HAPPY
      break
    case EmotionBehaviorCode.AFFECTION:
      result = activeNpc.args.npcAnimations.HEART_WITH_HANDS
      break
    case EmotionBehaviorCode.STONEWALLING:
      result = activeNpc.args.npcAnimations.COME_ON
      break
    case EmotionBehaviorCode.HUMOR:
    case EmotionBehaviorCode.TENSE_HUMOR:
      result = activeNpc.args.npcAnimations.LAUGH
      break
    case EmotionBehaviorCode.SADNESS:
      result = activeNpc.args.npcAnimations.SAD
      break
    case EmotionBehaviorCode.SURPRISE:
      result = activeNpc.args.npcAnimations.SURPRISE
      break
  }
  result = result ? result : defaultEmotion
  return result;
}