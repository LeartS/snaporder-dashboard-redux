<template>
<v-content>
<v-container fluid class="pt-0 ma-0 text-xs-center" id="main">
  <div id="party-code-form" v-if="partyId === null">
  <v-form @submit.prevent="submitPartyCode">
      <v-text-field name="code" label="Party Code"/>
  </v-form>
  </div>
  <div v-if="partyId">
    <div id="party-details mb-1">
      <h1 class="display-3">{{ partyData.name }}</h1>
      <p>
        Partecipanti:
        <span v-for="player in partyData.players" :key="player.id">
        {{player.nick}},
      </span>
      </p>
    </div>
    <div id="current-round mb-1">
      <h2>{{ partyData.question }}</h2>
      <h3>{{ answersText }}</h3>
    </div>
    <div id="ranking">
        <div class="xs-12 md-6">
          <ul>
            <li v-for="correct in correctPlays">
              {{correct.player}}: {{correct.score}}
            </li>
          </ul>
        </div>
        <div class="xs-12 md-6">
          <ul>
            <li v-for="wrong in wrongPlays">
              {{wrong.player}}: {{wrong.score}}
            </li>
          </ul>
        </div>
    </div>
  </div>
</v-container>
</v-content>
</template>

<script>
import baasbox from 'baasbox'

const USER = 'METTIILTUOUTENTE'
const PASS = 'METTIILATUAPASS'

const PARTY_START_WAIT_MESSAGE = 'Il party deve ancora iniziare!'

baasbox.setEndPoint('http://baasbox.snaporder.top:9000')
baasbox.appcode = '1234567890'

const emptyPartyData = {
  name: null,
  players: [],
  question: null,
  plays: {},
  answers: [],
  ranking: [],
}

const getDataFromPartyModel = (partyDoc) => {
  const currentQuestion = partyDoc.questions[+partyDoc.currentRound]
  return  {
    name: partyDoc.name,
    players: partyDoc.players,
    question: currentQuestion !== undefined
      ? currentQuestion.question
      : PARTY_START_WAIT_MESSAGE,
    answers: currentQuestion !== undefined
      ? currentQuestion.answers.map(a => a.answer)
      : [],
    plays: currentQuestion !== undefined
      ? partyDoc.plays[partyDoc.currentRound]
      : {},
    ranking: [
      {name: 'LeartS', score: 213},
      {name: 'Saro', score: 209},
    ]
  }
}

const setup = async () => {
  await baasbox.login(USER, PASS)
}

export default {
  name: 'Party',
  data: () => ({
    partyData: emptyPartyData,
    partyCode: null,
    partyId: null,
  }),
  computed: {
    answersText: function () {
      return this.partyData.answers.join(', ')
    },

    correctPlays: function () {
      const c = Object.entries(this.partyData.plays)
        .filter(([pId, play]) => play && play.correct === true)
        .map(([pId, play]) => {
          return {
            player: this.playerNameFromId(pId),
            score: play.score,
            correct: true,
          }
        })
      return c
    },

    wrongPlays: function () {
      const c = Object.entries(this.partyData.plays)
        .filter(([pId, play]) => play && play.correct === false)
        .map(([pId, play]) => {
          return {
            player: this.playerNameFromId(pId),
            score: play.score,
            correct: false,
          }
        })
      return c
    }

  },
  created: async function () {
    setup()
    if (this.$route.query.code) {
      await this.tryPartyCode(this.$route.query.code)
    }
  },
  methods: {
    playerNameFromId: function (playerId) {
      return this.partyData.players.find(p => p.id === playerId).nick
    },

    refreshParty: async function () {
      let party = (await baasbox.loadObject('Parties', this.partyId)).data
      this.partyData = getDataFromPartyModel(party)
    },

    setParty: function (partyId, partyCode) {
      this.partyCode = partyCode
      this.partyId = partyId
      setInterval(this.refreshParty, 1000)
    },

    submitPartyCode: function (e) {
      return this.tryPartyCode(e.target[0].value)
    },

    tryPartyCode: async function (code) {
      const parties = await baasbox.loadCollectionWithParams(
        'Parties', {where: `code='${code.toUpperCase()}'`}
      )
      if (parties.length > 0) {
        const party = parties[0]
        this.setParty(party.id, party.code)
      }
    }
  }
}
</script>

<style scoped>
#main {
  background-color: #ffca28;
  width: 100%;
  height: 100%;
}

#party-code-form {
  width: 100%;
  max-width: 400px;
  margin: auto;
}

#ranking {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#ranking > div {
  flex: 0 1 400px;
}
</style>

