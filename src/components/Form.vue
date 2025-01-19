<template>
  <form
    :id="id || name"
    :name="name"
    :class="$style.form"
    :action="action"
    :method="method"
    :target="target"
    :enctype="enctype"
    @submit="(event) => onSubmit(event as SubmitEvent)"
  >
    <slot/>
  </form>
</template>
<style module lang="scss">
@use "@/assets/scss/vars";

.form {
  min-width: vars.$formMinWidth;
  padding: vars.$gapXL;
  box-sizing: border-box;
}
</style>
<script setup lang="ts">
interface IProps {
  ajax?: boolean
  id?: string
  name: string
  action?: string
  method?: TFormMethod
  target?: TFormTarget
  enctype?: TFormEnctype
}

const props = defineProps<IProps>()

function onSubmit(event: SubmitEvent) {
  if (!props.ajax) {
    return
  }

  event.preventDefault()

  // ... some onsubmit code
}
</script>
