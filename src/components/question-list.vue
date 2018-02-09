<template>
<div>
  <v-list>
    <v-list-tile v-for="q in questions">
      <v-list-tile-content>
        <v-list-tile-title v-text="q"/>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</div>
</template>

<script>
export default {
  name: 'QuestionList',
  data: () => ({
    questions: [
      'Domanda 1',
      'Domanda 2',
      'Domanda 3',
    ],
  })
}
</script>
