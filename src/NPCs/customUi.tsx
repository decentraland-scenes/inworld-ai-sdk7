import { UiInput } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity, Label, Button, Input } from '@dcl/sdk/react-ecs'

export const customNpcUI = () => {
  return (
    <UiEntity
      uiTransform={{
        width: 850,
        height: 350,
        positionType: 'absolute',
        position: { bottom: 25, left: '30%' },
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
        // display: isVisible ? 'flex' : 'none',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row'
      }}
      uiBackground={{
        color: Color4.create(0, 0, 0, 0.5)
      }}
    >
      <UiEntity
        key={'Top Level'}
        uiTransform={{ width: '100%', justifyContent: 'center' }}
        // uiText={{ value: 'Top Level', fontSize: 20, color: Color4.Black() }}
      >
        <Label
          value="<b>Ask Me Anything!</b>"
          fontSize={30}
          color={isVisible ? Color4.White() : Color4.Black()}
        ></Label>
        <Button
          value="X"
          fontSize={40}
          uiTransform={{
            positionType: 'absolute',
            position: { top: 10, right: 10 },
            width: 60,
            height: 60,
          }}
          onMouseDown={() => {
            // setVisibility(false)
            isVisible = !isVisible
          }}
          uiBackground={{
            color: Color4.Gray(),
          }}
        ></Button>
      </UiEntity>
      <UiEntity key={'Input Level'} uiTransform={{ width: '100%', justifyContent: 'center' }}>
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            // position: { top: 10 },
            width: '80%',
            height: 80,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          uiBackground={{ color: Color4.White() }}
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
          />
        </UiEntity>
      </UiEntity>
      <UiEntity
        key={'Buttons Level'}
        uiBackground={{
          color: Color4.Yellow()
        }}
        uiTransform={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: { left: 10, right: 10 }
        }}
      >
        <UiEntity
          key={'Buttons'}
          uiTransform={{
            width: '60%',
            height: '50%',
            alignContent: 'center',
            justifyContent: 'center'
          }}
          uiBackground={{ color: Color4.Black() }}
        >
          <Label value="Button A & Button B"></Label>
        </UiEntity>
        <Button value="OptionsButton" uiTransform={{ width: '30%' }} uiBackground={{ color: Color4.Black() }}></Button>
      </UiEntity>
      <UiEntity key={'Note Level'} uiTransform={{ width: '100%', justifyContent: 'center' }}>
        <Label
          value="<b>Disclaimer: Beta. Power by a 3rd party AI. You may receive inaccurate information which is not \nendorsed by the Foundation or the Decentraland community.  Do not share personal information.</b>"
          fontSize={13}
        ></Label>
      </UiEntity>
    </UiEntity>
  )
}

let isVisible: boolean = true

function setVisibility(status: boolean): void {
  isVisible = status
}
