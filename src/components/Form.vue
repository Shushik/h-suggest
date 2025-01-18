<template>
  <form
    :class="$style.form"
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

</script>
