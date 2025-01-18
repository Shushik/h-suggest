<template>
  <div
    :class="$style.dropDown"
    @click="onInnerClick"
  >
    <slot
      :isShown="isShown"
      :onHide="onHide"
      :onShow="onShow"
      :setAnchor="setAnchor"
      :aria-hidden="!isShown"
      name="anchor"
    />
    <div
      v-show="isShown"
      :class="$style.dropDownItems"
      :data-position="itemsPos"
      ref="itemsRef"
      role="listbox"
    >
      <div
        v-for="(item, itemPos) in items"
        :key="`drop-down-item-${itemPos}`"
        :ref="hoveredItemPos === itemPos ? (el) => setHoveredItemRef(el as HTMLElement) : undefined"
        :class="{
          [$style.dropDownItem]: true,
          [$style.dropDownItemIsHovered]: hoveredItemPos === itemPos,
          [$style.dropDownItemIsSelected]: selectedItemPos === itemPos,
        }"
        role="option"
        @click="onClick(itemPos)"
        @mouseout="onMouseout"
        @mouseover="onMouseover(itemPos)"
      >
        <slot
          :item="item"
          name="item"
        />
      </div>
    </div>
  </div>
</template>
<style module lang="scss">
.dropDown {
  font-size: 1rem;

  line-height: 1.2rem;

  position: relative;
}

.dropDownItem {
  cursor: pointer;

  min-height: 40px;
  padding: 4px 8px;
  box-sizing: border-box;
}

.dropDownItemIsHovered,
.dropDownItemIsSelected {
  background: #F4F4F4;
}

.dropDownItems {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 1000;
  transform: translateX(-50%);

  min-width: 100%;
  max-height: 160px;
  overflow-y: auto;

  background: #FFF;
  border-radius: 0.3rem;
  box-shadow: 0 1px 15px rgba(0, 0, 0, .2);
}

.dropDownItems[data-position="top"] {
  top: auto;
  bottom: 100%;
}
</style>
<script setup lang="ts" generic="TItem">
import { ref, watch, nextTick } from 'vue'
import { setTimer, clearTimer } from '@/helpers/TimerOperations'

interface IProps {
  shown?: boolean
  items: TItem[] | null
  modelValue?: TItem | null
}

interface ISlots {
  item(props: { item: TItem })
  anchor(props: {
    isShown: boolean
    onShow: () => void
    onHide: () => void
    setAnchor: (el: HTMLElement | null) => void
  })
}

type TPosition = 'top' | 'bottom'

const POSITION_TIMER = 50
const POSITION_VALUE = <TPosition>'bottom'
const MOUSEOUT_TIMER = 100

const emit = defineEmits([ 'update:modelValue' ])
const props = defineProps<IProps>()
const slots = defineSlots<ISlots>()

const isShown = ref<boolean>(props.shown)
const hoveredItemPos = ref<number>(-1)
const selectedItemPos = ref<number>(-1)
const itemsPos = ref<TPosition>(POSITION_VALUE)
const itemsRef = ref<HTMLElement | null>(null)
const anchorRef = ref<HTMLElement | null>(null)
const hoveredItemRef = ref<HTMLElement | null>(null)

let mouseTimerId = <TimerId>null
let resizeTimerId = <TimerId>null
let innerClick = false

watch(() => props.shown, (val: boolean) => {
  if (val) {
    onShow()
  } else {
    onHide()
  }
})

function setAnchor(el: HTMLElement | null) {
  anchorRef.value = el
}

function selectItem(itemPos: number) {
  if (!props.items || !props.items[itemPos]) {
    return
  }

  selectedItemPos.value = itemPos

  hoverItem(itemPos)
  onHide()
  emit('update:modelValue', props.items[itemPos])
}

function setHoveredItemRef(element: HTMLElement | null) {
  hoveredItemRef.value = element
}

function selectHoveredItem() {
  const itemPos = hoveredItemPos.value

  if (!props.items || itemPos < 0 || itemPos > props.items.length - 1) {
    return
  }

  selectItem(itemPos)
}

function hoverItem(itemPos: number) {
  if (!props.items) {
    return
  }

  hoveredItemPos.value = itemPos

  nextTick(scrollItems)
}

function scrollItems() {
  if (!hoveredItemRef.value || !itemsRef.value) {
    return
  }

  const item = hoveredItemRef.value
  const items = itemsRef.value

  items.scrollTop = item.offsetTop - item.offsetHeight
}

function hoverNextItem() {
  if (!props.items) {
    return
  }

  let nextPos = hoveredItemPos.value + 1

  if (nextPos > props.items.length - 1) {
    nextPos = 0
  }

  hoverItem(nextPos)
}

function hoverPrevItem() {
  if (!props.items) {
    return
  }

  let prevPos = hoveredItemPos.value - 1

  if (prevPos < 0) {
    prevPos = props.items.length - 1
  }

  hoverItem(prevPos)
}

function onHide() {
  isShown.value = false
  itemsPos.value = 'bottom'
  hoveredItemPos.value = -1
  selectedItemPos.value = -1

  setHoveredItemRef(null)

  window.removeEventListener('click', onOuterClick)
  window.removeEventListener('resize', onOuterResize)
  window.removeEventListener('keydown', onKeydown)
}

function onShow() {
  if (isShown.value) {
    return
  }

  isShown.value = true

  if (itemsRef.value) {
    itemsRef.value.scrollTop = 0
  }

  changePosition()

  window.addEventListener('click', onOuterClick)
  window.addEventListener('resize', onOuterResize)
  window.addEventListener('keydown', onKeydown)
}

function onClick(itemPos: number) {
  if (!props.items) {
    return
  }

  const item = props.items[itemPos]

  selectedItemPos.value = itemPos

  onHide()

  emit('update:modelValue', item)
}

function onInnerClick() {
  innerClick = true
}

function onOuterClick() {
  if (innerClick) {
    innerClick = false

    return
  }

  onHide()
}

function onOuterResize() {
  resizeTimerId = clearTimer(resizeTimerId)
  resizeTimerId = setTimer(() => {
    changePosition()
  }, POSITION_TIMER)
}

function changePosition() {
  if (!itemsRef.value || !anchorRef.value) {
    return
  }

  const wHeight = window.innerHeight
  const { top, bottom } = anchorRef.value.getBoundingClientRect()
  const { height } = itemsRef.value.getBoundingClientRect()

  let pos = <TPosition>POSITION_VALUE

  if (
    (bottom + height > wHeight) &&
    (top > height)
  ) {
    pos = 'top'
  }

  itemsPos.value = pos
}

function onKeydown(event: KeyboardEvent) {
  const key = event.key || event.keyCode

  switch (key) {

    case 13:
    case 'Enter':
      event.preventDefault()
      selectHoveredItem()
      break

    case 27:
    case 'Escape':
      event.preventDefault()
      onHide()
      console.log('Escape')
      break

    case 38:
    case 'ArrowUp':
      event.preventDefault()
      hoverPrevItem()
      break

    case 40:
    case 'ArrowDown':
      event.preventDefault()
      hoverNextItem()
      break

  }
}

function onMouseout() {
  mouseTimerId = clearTimer(mouseTimerId)
  mouseTimerId = setTimer(() => {
    hoveredItemPos.value = -1
  }, MOUSEOUT_TIMER)
}

function onMouseover(itemPos: number) {
  mouseTimerId = clearTimer(mouseTimerId)

  hoveredItemPos.value = itemPos
}
</script>
