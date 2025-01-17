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
:root {
  --tag-color: #FFF;
  --tag-background: #92A8BA;
}

.tag {
  font-size: 12px;
  font-weight: 400;

  line-height: 14px;

  display: inline-block;

  padding: 4px 8px;

  color: var(--tag-color);
  background: var(--tag-background);
  border-radius: 2px;

  user-select: none;
}

.remove {
  font-size: 10px;
  font-style: normal;
  font-weight: 600;

  display: inline-block;
  cursor: pointer;

  margin-left: 8px;
}
</style>
<script setup lang="ts">
interface IProps {
  removable?: boolean
}

defineEmits([ 'remove' ])
defineProps<IProps>()
</script>
