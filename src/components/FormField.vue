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
  font-size: vars.$fontSizeXL;

  line-height: vars.$lineHeightXL;

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
  font-size: vars.$fontSizeL;
  font-weight: vars.$fontWeightXL;
  font-family: serif;

  line-height: vars.$lineHeightL;

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

const props = withDefaults(defineProps<IProps>(), {
  layout: 'H',
})
</script>
