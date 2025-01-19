<template>
  <Form
    name="form-habr-suggest"
  >
    <FormField
      required
      labelFor="field-habr-suggest"
    >
      <template #label>
        Пользователь или компания
      </template>
      <template #input>
        <InputSuggest
          :getData="onSuggestGetData"
          :getValue="onSuggestGetValue"
          name="field-habr-suggest"
        >
          <template #selected="{ item, onClear }">
            <Tag
              v-if="item"
              removable
              @remove="onClear"
            >@{{ item.alias }}
            </Tag>
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
      </template>
    </FormField>
  </Form>
</template>
<script setup lang="ts">
import Tag from '@/components/Tag.vue'
import Form from '@/components/Form.vue'
import FormField from '@/components/FormField.vue'
import UserCard from '@/components/UserCard.vue'
import InputSuggest from '@/components/InputSuggest.vue'
import { ApiRequest } from '@/helpers/ApiOperations'

const API_URL = 'https://habr.com/kek/v2/publication/suggest-mention?q={queryString}'

let req = <ApiRequest<IUserCardItem[]> | null>null

function onSuggestGetValue(raw: unknown): string {
  const item = raw as IUserCardItem

  return item.alias
}

async function onSuggestGetData(raw: string) {
  if (req) {
    req.abort()

    req = null
  }

  req = new ApiRequest<IUserCardItem[]>(
    API_URL.replace(/\{[\s]*queryString[\s]*\}/g, raw)
  )

  const { data, error } = await req?.exec()

  return { data, error }
}
</script>
