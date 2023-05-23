import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { NpcUtilsUi } from 'dcl-npc-toolkit/dist/ui'
import { customNpcUI } from './NPCs/customUi'

const uiComponent = () => [NpcUtilsUi(), customNpcUI()]

const uiComponent2 = () => (
  <UiEntity>
    <NpcUtilsUi></NpcUtilsUi>
  </UiEntity>
)

export function setUpUI() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}
