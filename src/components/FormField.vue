<template>
  <fieldset
    :class="{
      [$style.formField]: true,
      [$style.formFieldIsRequired]: required,
      [$style.formFieldLayoutV]: layout === 'V'
    }"
  >
    <label
      v-if="!fullWidth"
      :for="labelFor"
      :class="$style.formFieldLabel"
    >
      <slot name="label"/>
      {{ labelText }}
    </label>
    <div :class="$style.formFieldInput">
      <slot name="input"/>
    </div>
  </fieldset>
</template>
<style module lang="scss">
@use "@/assets/scss/vars";

@mixin horisontal_layout_both {
  width: 100%;
}

@mixin horisontal_layout_label {
  margin-bottom: vars.$gapL;
}

.formField {
  text-align: left;

  display: flex;
  flex-wrap: wrap;
  align-items: center;

  min-width: vars.$formFieldWidthMin;
  min-height: vars.$inputHeightMin;
  padding: 0;
  margin: 0;

  border-width: 0;
  outline: none;
}

.formFieldLabel {
  @include vars.fontSize("XL");

  display: block;

  min-width: vars.$formFieldWidthMin;
  padding-right: vars.$gapXXL;
  box-sizing: border-box;
}

.formFieldInput {
  min-width: vars.$formFieldWidthMin;
}

.formFieldIsRequired .formFieldLabel {
  position: relative;

  padding-left: vars.$gapXL;
}

.formFieldIsRequired .formFieldLabel::before {
  @include vars.fontSize("L");
  @include vars.fontWeight("XL");

  font-family: serif;

  content: "*";
  position: absolute;
  top: vars.$gapS;
  left: 0;

  color: vars.$colorImportant;
}

.formFieldLayoutV .formFieldInput,
.formFieldLayoutV .formFieldLabel {
  @include horisontal_layout_both;
}

.formFieldLayoutV .formFieldLabel {
  @include horisontal_layout_label;
}

@media screen and (max-width: vars.$formMinWidth) {
  .formFieldInput,
  .formFieldLabel {
    @include horisontal_layout_both;
  }

  .formFieldLabel {
    @include horisontal_layout_label;
  }
}
</style>
<script setup lang="ts">
interface IProps {
  required?: boolean
  fullWidth?: boolean
  labelFor?: string
  labelText?: string
  layout?: 'H' | 'V'
}

withDefaults(defineProps<IProps>(), {
  layout: 'H',
})
</script>
