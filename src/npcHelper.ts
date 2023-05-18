import { Entity } from "@dcl/sdk/ecs";
import { Vector3 } from "@dcl/sdk/math";
import * as npcLib from "dcl-npc-toolkit";
import { ImageData, NPCData } from "dcl-npc-toolkit/dist/types";

export class NpcCreationArgs{
  transformData: any
  npcData: NPCData
}

export function createNpc(args: NpcCreationArgs): Entity {
  const npc = npcLib.create(
    {
      position: args.transformData.position,
      rotation: args.transformData.rotation,
    },
    args.npcData
  )

  return npc
}