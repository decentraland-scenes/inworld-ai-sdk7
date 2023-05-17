import { Entity } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import * as npcLib from "dcl-npc-toolkit";

export class NpcCreationArgs{
  transformData: any
  modelPath: string
  sfxPath: string
  onActivate: () => void
  onWalkAway: () => void
  cooldownDuration: number
}

export function createNpc(args: NpcCreationArgs): Entity {
  const npc = npcLib.create(
    {
      position: args.transformData.position,
      rotation: args.transformData.rotation,
    },
    {
      type: npcLib.NPCType.CUSTOM,
      model: args.modelPath,
      onActivate: () => {
        args.onActivate()
      },
      onWalkAway: () => {
        args.onWalkAway()
      },
      dialogSound: args.sfxPath,
      onlyETrigger: true,
      coolDownDuration: 3,
    }
  )

  return npc
}