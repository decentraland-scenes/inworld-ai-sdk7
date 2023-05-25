import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { NpcUtilsUi } from 'dcl-npc-toolkit/dist/ui'
import { customNpcUI } from './NPCs/customUi'
import * as ui from 'dcl-ui-toolkit'

const uiComponent = () => [NpcUtilsUi(), customNpcUI(), ui.render()]

const uiComponent2 = () => (
  <UiEntity>
    <NpcUtilsUi></NpcUtilsUi>
  </UiEntity>
)

export function setUpUI() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}
