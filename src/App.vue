<template>
  <div style="width: 300px;margin-top: 100px;">
    <InputSuggest
      :getData="onSuggestGetData"
      :getValue="onSuggestGetValue"
      name="habr-suggest"
    >
      <template #selected="{ item, onClear }">
        <Tag
          v-if="item"
          @remove="onClear"
        >@{{ item.alias }}</Tag>
      </template>
      <template #item="{ item }">
        <UserCard
          v-if="item"
          :user="item"
          :aria-label="item.name || item.alias"
          size="S"
        />
      </template>
    </InputSuggest>
  </div>
</template>
<script setup lang="ts">
import Tag from '@/components/Tag.vue'
import UserCard from '@/components/UserCard.vue'
import InputSuggest from '@/components/InputSuggest.vue'
import { ApiRequest } from '@/helpers/ApiOperations'

const API_URL = 'https://habr.com/kek/v2/publication/suggest-mention?q={queryString}'

let req = <ApiRequest<InputSuggestApiItem[]> | null>null

function onSuggestGetValue(raw: unknown): string {
  const item = raw as InputSuggestApiItem

  return item.alias
}

async function onSuggestGetData(raw: string) {
  if (req) {
    req.abort()

    req = null
  }

  req = new ApiRequest<InputSuggestApiItem[]>(
    API_URL.replace(/\{[\s]*queryString[\s]*\}/g, raw)
  )

  const { data, error } = await req?.exec()

  return { data, error }
}
</script>
