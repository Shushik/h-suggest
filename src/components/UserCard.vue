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
  @include vars.fontSize("L");
  @include vars.fontWeight("L");

  white-space: nowrap;
  text-overflow: ellipsis;
}

.userCardAlias {
  @include vars.fontSize;
  @include vars.color("Muted");

  white-space: nowrap;

  margin-top: vars.getGap("S");
}

.userCardAvatar {
  float: left;
}

.userCardSizeS .userCardAvatar {
  float: left;

  margin-top: vars.getGap();
  margin-right: vars.getGap("L");
}

.userCardSizeS .userCardName,
.userCardSizeS .userCardAlias {
  white-space: nowrap;

  margin-left: vars.getAvatarSize("S") + vars.getGap("L");
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
