import React from 'react'
import { DropTargetMonitor, useDrop } from 'react-dnd'

import { EntityOrObjectUUID } from '@etherealengine/engine/src/ecs/functions/EntityTree'

import { ItemTypes } from '../../constants/AssetTypes'
import { ControlledStringInput } from './StringInput'

export function MaterialInput<
  T extends { value: EntityOrObjectUUID; onChange: (val: EntityOrObjectUUID) => any; [key: string]: any }
>({ value, onChange, ...rest }: T) {
  function onDrop(item, monitor: DropTargetMonitor) {
    const value = item.value
    let element = value as EntityOrObjectUUID | EntityOrObjectUUID[] | undefined
    if (typeof element === 'undefined') return
    if (Array.isArray(value)) {
      element = element[0]
    }
    if (typeof element !== 'string') return
    onChange(element)
  }

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: [ItemTypes.Material],
    drop: onDrop,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    })
  })

  return (
    <>
      <ControlledStringInput
        ref={dropRef}
        onChange={onChange}
        canDrop={isOver && canDrop}
        value={'' + value}
        {...rest}
      />
    </>
  )
}
