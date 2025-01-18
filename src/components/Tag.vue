<template>
  <div :class="$style.tag">
    <slot/>
    <i
      :class="$style.remove"
      title="Очистить"
      @click="$emit('remove')"
    >✕</i>
  </div>
</template>
<style module lang="scss">
@use "@/assets/scss/vars";

.tag {
  font-size: vars.$fontSize;
  font-weight: vars.$fontWeightL;

  line-height: vars.$lineHeight;

  display: inline-block;

  padding: vars.$gap vars.$gapL;

  color: vars.$colorLight;
  background: vars.$colorTagDefault;
  border-radius: vars.$gapS;

  user-select: none;
}

.remove {
  font-size: vars.$fontSizeS;
  font-style: normal;
  font-weight: vars.$fontWeightXL;

  line-height: vars.$lineHeightS;

  display: inline-block;
  cursor: pointer;

  margin-left: vars.$gapL;
}
</style>
<script setup lang="ts">
interface IProps {
  removable?: boolean
}

defineEmits([ 'remove' ])
defineProps<IProps>()
</script>
