import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { NpcUtilsUi } from 'dcl-npc-toolkit/dist/ui'

const uiComponent = () => (
  <UiEntity>
    <NpcUtilsUi></NpcUtilsUi>
  </UiEntity>
)

export function setUpUI() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}
