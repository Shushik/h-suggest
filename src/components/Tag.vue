<template>
  <div :class="$style.tag">
    <slot/>
    <i
      v-if="removable"
      :class="$style.remove"
      :title="removeTitle"
      @click="$emit('remove')"
    >✕</i>
  </div>
</template>
<style module lang="scss">
@use "@/assets/scss/vars";

.tag {
  @include vars.fontSize;
  @include vars.fontWeight("L");
  @include vars.color("Light");
  @include vars.backgroundColor("TagDefault");

  display: inline-block;

  padding: vars.$gap vars.$gapL;

  border-radius: vars.$gapS;

  user-select: none;
}

.remove {
  @include vars.fontSize("S");
  @include vars.fontWeight("L");

  font-family: serif;
  font-style: normal;

  display: inline-block;
  cursor: pointer;

  margin-left: vars.$gapL;
}
</style>
<script setup lang="ts">
interface IProps {
  removable?: boolean
  removeTitle?: string
}

defineEmits([ 'remove' ])
defineProps<IProps>()
</script>
