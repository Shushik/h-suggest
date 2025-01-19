<template>
  <div
    :class="{
      [$style.userAvatar]: true,
      [$style[`userAvatarSize${size}`]]: size === 'S' || size === 'L',
    }"
  >
    <img
      v-if="user.avatar && !brokenImage"
      :alt="initials"
      :src="user.avatar"
      :class="$style.userAvatarPic"
      :title="initials"
      @error="onError"
    />
    <template v-else>
      {{ initials }}
    </template>
  </div>
</template>
<style module lang="scss">
@use "@/assets/scss/vars";

.userAvatar {
  @include vars.fontSize("L");
  @include vars.avatarSize;

  font-weight: vars.$fontWeightXL;

  text-align: center;

  display: inline-block;

  overflow: hidden;

  border-radius: vars.$gapL;
}

.userAvatar::before {
  vertical-align: middle;

  content: "";
  display: inline-block;

  width: 0;
  height: 100%;
}

.userAvatarSizeS {
  @include vars.fontSize("L");
  @include vars.avatarSize("S");
}

.userAvatarSizeL {
  @include vars.fontSize("XL");
  @include vars.avatarSize("L");
}

.userAvatarPic {
  width: 100%;
  height: 100%;
}
</style>
<script setup lang="ts">
import { ref, computed } from 'vue'

interface IProps {
  size?: TUserCardSize
  user: IUserCardItem
}

const props = defineProps<IProps>()

const brokenImage = ref<boolean>(false)
const initials = computed<string>(() => {
  const raw = props.user.name ? props.user.name : props.user.alias
  const parts = raw.split(' ')

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return `${parts[0][0]}`.toUpperCase()
})

function onError() {
  brokenImage.value = true
}
</script>
