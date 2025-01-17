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
.userAvatar {
  font-weight: 600;
  text-align: center;

  display: inline-block;

  width: 50px;
  height: 50px;
  overflow: hidden;

  border-radius: 0.3rem;
}

.userAvatar::before {
  vertical-align: middle;

  content: "";
  display: inline-block;

  width: 0;
  height: 100%;
}

.userAvatarSizeS {
  font-size: 0.9rem;

  width: 20px;
  height: 20px;
}

.userAvatarSizeL {
  width: 80px;
  height: 80px;
}

.userAvatarPic {
  width: 100%;
  height: 100%;
}
</style>
<script setup lang="ts">
import {computed, ref} from 'vue'

interface IProps {
  size?: TUserCardSize
  user: InputSuggestApiItem
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
