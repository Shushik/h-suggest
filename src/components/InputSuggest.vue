<template>
  <div
    :class="{
      [$style.inputSuggest]: true,
      [$style.inputSuggestHasError]: hasError,
      [$style.inputSuggestIsFocused]: isFocused,
      [$style.inputSuggestIsDisabled]: disabled,
      [$style.inputSuggestIsReadonly]: readonly,
    }"
  >
    <DropDown
      v-model="dropdownValue"
      :shown="isShown"
      :items="inputItems"
    >
      <template #anchor="{ isShown, setAnchor }">
        <div
          :class="$style.trigger"
          :ref="isShown ? (el) => setAnchor(el as HTMLElement) : undefined"
        >
          <slot
            v-if="dropdownValue"
            :item="dropdownValue as TItem | null"
            :onClear="onClear"
            name="selected"
          />
          <input
            v-model="inputValue"
            :id="id || name"
            :name="name"
            :type="dropdownValue ? 'hidden' : 'text'"
            :class="$style.input"
            :disabled="disabled"
            :tabindex="disabled ? undefined : tabindex"
            :readonly="readonly"
            :required="required"
            :maxlength="maxlength"
            :autofocus="autofocus"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :aria-disabled="disabled"
            :aria-expanded="isShown"
            ref="inputRef"
            role="combobox"
            aria-label="Search"
            aria-autocomplete="inline"
            @blur="onBlur"
            @focus="onFocus"
            @keydown="(event) => onKeydown(event, isShown)"
          />
        </div>
      </template>
      <template #item="{ item }">
        <slot
          :item="item as TItem | null"
          name="item"
        />
      </template>
    </DropDown>
  </div>
</template>
<style module lang="scss">
@use "sass:meta";
@use "@/assets/scss/vars";

.trigger {
  @include vars.fontSize("XL");
  @include vars.color;
  @include vars.backgroundColor;

  display: flex;
  align-items: center;

  width: 100%;
  min-width: vars.$inputWidthMin;
  min-height: vars.$inputHeightMin;
  padding: vars.getGap() vars.getGap("L");
  box-sizing: border-box;

  border: #{vars.getColor("BorderDefault")} solid 1px;
  border-radius: vars.getGap();

  transition: border-color vars.$transitionDelay;
}

.input {
  appearance: none;

  width: 100%;
  padding: 0;
  margin: 0;

  color: inherit;
  background: inherit;
  border-width: 0;
  outline: none;
}

.input::placeholder {
  @include vars.color("Muted");
}

.inputSuggestIsFocused .trigger {
  border-color: #{vars.getColor("BorderHovered")};
}

.inputSuggestIsDisabled .input,
.inputSuggestIsDisabled .trigger {
  cursor: not-allowed;
}

.inputSuggestIsDisabled .trigger,
.inputSuggestIsDisabled.inputSuggestIsFocused .trigger {
  @include vars.backgroundColor("BackgroundDisabled");
}

.inputSuggestHasError .trigger {
  @include vars.shadow("Important");

  border-color: #{vars.getColor("Important")};
}

.inputSuggestIsReadonly .input,
.inputSuggestIsReadonly .trigger {
  cursor: default;
}
</style>
<script setup lang="ts" generic="TItem">
import DropDown from '@/components/DropDown.vue'
import { ref, watch, nextTick, onMounted } from 'vue'
import { debounceAction } from '@/helpers/TimerOperations'
import { handlePreventDefault } from '@/helpers/EventOperations'

interface IProps {
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autofocus?: boolean
  tabindex?: number
  minlength?: number
  maxlength?: number
  id?: string
  name: string
  placeholder?: string
  autocomplete?: 'on' | 'off'
  modelValue?: TItem | null
  getData: (raw: string) => Promise<IApiRes<TItem[], ''>>
  getValue: (raw: TItem) => string
}

interface ISlots {
  item(props: { item: TItem | null })
  selected(props: { item: TItem | null, onClear: () => void })
}

const ONCHANGE_INTERVAL = 150

const emit = defineEmits([ 'update:modelValue' ])
const props = withDefaults(defineProps<IProps>(), {
  minlength: 3,
  autoComplete: 'off',
})
const slots = defineSlots<ISlots>()

const isShown = ref<boolean>(false)
const isFocused = ref<boolean>(false)
const hasError = ref<boolean>(false)
const inputValue = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)
const inputItems = ref<TItem[] | null>(null)
const dropdownValue = ref<unknown>(null)

const onDebouncedChange = debounceAction(onChange, ONCHANGE_INTERVAL)

watch(() => props.modelValue, (val?: TItem | null) => onSelect(val))
watch(() => inputValue.value, onDebouncedChange)
watch(() => dropdownValue.value, (val: unknown) => onSelect(val as TItem | null))
onMounted(() => onSelect(props.modelValue))

function showSuggest() {
  isShown.value = false

  if (!inputItems.value || !inputItems.value.length) {
    return
  }

  nextTick(() => {
    isShown.value = true
  })
}

function onClear() {
  inputValue.value = ''
  inputItems.value = null
  dropdownValue.value = null

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

function onBlur() {
  if (props.disabled || props.readonly) {
    return
  }

  if (!inputValue.value) {
    isFocused.value = false
  }
}

function onFocus() {
  if (props.disabled || props.readonly) {
    return
  }

  hasError.value = false
  isFocused.value = true

  showSuggest()
}

function onSelect(raw?: TItem | null) {
  dropdownValue.value = raw

  emit('update:modelValue', raw)
}

async function onChange(val?: string) {
  isShown.value = false
  hasError.value = false
  inputItems.value = null

  if (!val || val.length < props.minlength) {
    inputItems.value = null

    return
  }

  if (!props.getData) {
    return
  }

  const { data, error } = await props.getData(val)

  if (error) {
    if (error !== 'ABORTED') {
      hasError.value = !!error
    }

    return
  }

  inputItems.value = data as TItem[] | null

  if (data && data.length) {
    isShown.value = true
  }
}

function onKeydown(event: KeyboardEvent, shown?: boolean) {
  if (shown) {
    return
  }

  const key = event.key

  hasError.value = false

  switch (key) {

    case 'ArrowDown':
      handlePreventDefault(event, showSuggest)
      break

  }
}
</script>
