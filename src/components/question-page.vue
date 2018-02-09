<template>
<div>
  <v-form>
    <v-select
      label="Language"
      :items="items"
      required/>
    <v-text-field label="Testo della domanda"></v-text-field>
  </v-form>
</div>
</template>

<script>
export default {
  name: 'QuestionPage',
  data: () => ({
    items: ['Italian', 'English'],
  })
}
</script>
