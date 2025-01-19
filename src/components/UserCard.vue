<template>
  <div
    :class="{
      [$style.userCard]: true,
      [$style[`userCardSize${size}`]]: size
    }"
  >
    <template v-if="user">
      <UserAvatar
        :user="user"
        :size="size"
        :class="$style.userCardAvatar"
      />
      <div :class="$style.userCardName">
        {{ user.name || user.alias }}
      </div>
      <div :class="$style.userCardAlias">
        <template v-if="user.type === 'company'">
          Компания
        </template>
        <template v-else>
          @{{ user.alias }}
        </template>
      </div>
    </template>
  </div>
</template>
<style module lang="scss">
@use "sass:map";
@use "@/assets/scss/vars";

.userCard {
  text-align: left;
}

.userCard::after {
  content: "";
  display: block;
  clear: both;
}

.userCardName {
  font-weight: vars.$fontWeightL;

  white-space: nowrap;
  text-overflow: ellipsis;
}

.userCardAlias {
  white-space: nowrap;

  color: vars.$colorMuted;
}

.userCardAvatar {
  float: left;
}

.userCardSizeS {
  @include vars.fontSize;
}

.userCardSizeS .userCardAvatar {
  float: left;

  margin-top: vars.$gap;
  margin-right: vars.$gapL;
}

.userCardSizeS .userCardName,
.userCardSizeS .userCardAlias {
  white-space: nowrap;

  margin-left: map.get(vars.$userAvatarSize, 'S') + vars.$gapL;
}
</style>
<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue'

interface IProps {
  size?: TUserCardSize
  user: IUserCardItem | null
}

defineProps<IProps>()
</script>
