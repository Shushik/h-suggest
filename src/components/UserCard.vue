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
.userCard {
  text-align: left;
}

.userCard::after {
  content: "";
  display: block;
  clear: both;
}

.userCardName {
  font-weight: 400;

  white-space: nowrap;
  text-overflow: ellipsis;
}

.userCardAlias {
  white-space: nowrap;

  color: #999;
}

.userCardAvatar {
  float: left;
}

.userCardSizeS {
  font-size: 12px;

  line-height: 1.3;
}

.userCardSizeS .userCardAvatar {
  float: left;

  margin-top: 4px;
  margin-right: 10px;
}

.userCardSizeS .userCardName,
.userCardSizeS .userCardAlias {
  white-space: nowrap;

  margin-left: 30px;
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
