import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity, Label, Button, Input } from '@dcl/sdk/react-ecs'
import { AtlasTheme, getImageMapping, sourcesComponentsCoordinates } from './uiResources'
import { NpcQuestionData, sendQuestion } from './customUIFunctionality'

let selectedPredefinedQuestion: NpcQuestionData[] = []

let isVisible: boolean = false

let aIndex = 0
let bIndex = 1

export const customNpcUI = () => {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        width: 926,
        height: 300,
        position: { bottom: '3%', left: '30%' },
        display: isVisible ? 'flex' : 'none'
      }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute',
          justifyContent: 'space-evenly',
          alignItems: 'stretch',
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row'
        }}
        uiBackground={{
          texture: { src: AtlasTheme.ATLAS_PATH_DARK },
          uvs: getImageMapping({
            ...sourcesComponentsCoordinates.backgrounds['NPCDialog']
          }),
          textureMode: 'stretch'
        }}
      >
        <UiEntity uiTransform={{ width: '100%', justifyContent: 'center' }}>
          <Label value="<b>Ask Me Anything!</b>" fontSize={30}></Label>
          <Button
            value=""
            fontSize={40}
            uiTransform={{
              positionType: 'absolute',
              position: { top: 15, right: 25 },
              width: 45,
              height: 45
            }}
            onMouseDown={() => {
              setVisibility(false)
            }}
            uiBackground={{
              color: Color4.White(),
              texture: { src: AtlasTheme.ATLAS_PATH_DARK },
              textureMode: 'stretch',
              uvs: getImageMapping({ ...sourcesComponentsCoordinates.icons.closeWLarge })
            }}
          ></Button>
        </UiEntity>
        <UiEntity uiTransform={{ width: '100%', justifyContent: 'center' }}>
          <UiEntity
            uiTransform={{
              positionType: 'absolute',
              width: '80%',
              height: 80,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            uiBackground={{
              color: Color4.White()
            }}
          >
            <Input
              uiTransform={{ width: '99%', height: '92%' }}
              uiBackground={{
                color: Color4.Black()
              }}
              fontSize={20}
              placeholder="Type your question here then hit enter..."
              color={Color4.White()}
              placeholderColor={Color4.White()}
              onChange={(x) => {
                onEdit(x)
              }}
            />
          </UiEntity>
        </UiEntity>
        <UiEntity
          uiTransform={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignContent: 'space-between',
            padding: { left: 80, right: 80 }
          }}
        >
          <Button
            value={selectedPredefinedQuestion?.length >= 2 ? selectedPredefinedQuestion[aIndex].displayText : ''}
            uiTransform={{
              width: '32%',
              height: '60%'
            }}
            uiBackground={{
              texture: {
                src: AtlasTheme.ATLAS_PATH_DARK
              },
              color: Color4.White(),
              textureMode: 'stretch',
              uvs: getImageMapping({ ...sourcesComponentsCoordinates.buttons.dark })
            }}
            fontSize={20}
            onMouseDown={() => {
              askQuestion(bIndex)
            }}
          ></Button>
          <Button
            value={
              selectedPredefinedQuestion?.length >= 2 && bIndex < selectedPredefinedQuestion?.length
                ? selectedPredefinedQuestion[bIndex].displayText
                : ''
            }
            uiTransform={{
              display: bIndex >= selectedPredefinedQuestion?.length ? 'none' : 'flex',
              width: '32%',
              height: '60%'
            }}
            uiBackground={{
              texture: {
                src: AtlasTheme.ATLAS_PATH_DARK
              },
              color: Color4.White(),
              textureMode: 'stretch',
              uvs: getImageMapping({ ...sourcesComponentsCoordinates.buttons.dark })
            }}
            fontSize={20}
            onMouseDown={() => {
              askQuestion(bIndex)
            }}
          ></Button>
          <Button
            value="More Options"
            uiTransform={{
              width: '32%',
              height: '60%'
            }}
            uiBackground={{
              texture: {
                src: AtlasTheme.ATLAS_PATH_DARK
              },
              color: Color4.White(),
              textureMode: 'stretch',
              uvs: getImageMapping({ ...sourcesComponentsCoordinates.buttons.dark })
            }}
            fontSize={25}
            onMouseDown={() => {
              nextQuestion()
            }}
          ></Button>
        </UiEntity>
        <UiEntity uiTransform={{ width: '100%', justifyContent: 'center' }}>
          <Label
            value="<b>Disclaimer: Beta. Power by a 3rd party AI. You may receive inaccurate information which is not \nendorsed by the Foundation or the Decentraland community.  Do not share personal information.</b>"
            fontSize={13}
          ></Label>
        </UiEntity>
      </UiEntity>

      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { left: -175 },
          width: 300,
          height: 300
        }}
        uiBackground={{
          texture: { src: 'images/portraits/bela.png' },
          textureMode: 'stretch'
        }}
      ></UiEntity>
    </UiEntity>
  )
}

function setVisibility(status: boolean): void {
  isVisible = status
  if (!status) {
    console.log('Close Custom Dialog')
  }
}

export function openCustomUI(questions: NpcQuestionData[]) {
  setVisibility(true)
  selectedPredefinedQuestion = questions
  console.log('QUESTIONS', questions, selectedPredefinedQuestion)
  aIndex = 0
  bIndex = 1
}

function nextQuestion() {
  aIndex += 2
  bIndex += 2
  if (aIndex >= selectedPredefinedQuestion.length) {
    aIndex = 0
    if (bIndex >= selectedPredefinedQuestion.length) {
      bIndex = 1
    }
  }
}

function askQuestion(index: number) {
  if (index >= selectedPredefinedQuestion.length) {
    console.error('Index is out of bounds for predefined questions')
    return
  }
  console.log('QUESTIONS', 'Asked Question:', selectedPredefinedQuestion[index])
  sendQuestion(selectedPredefinedQuestion[index])
}

function onEdit(param: string) {
  console.log('QUESTIONS', 'onEdit', param)
}

export function resetInputField() {}
