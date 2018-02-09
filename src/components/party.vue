<template>
<v-content class="snapcolor">
<v-container fluid class="pt-0 ma-0" id="main">
  <div id="party-code-form" v-if="partyId === null">
  <v-form @submit.prevent="submitPartyCode">
      <v-text-field name="code" label="Party Code"/>
  </v-form>
  </div>
  <div v-if="partyId">
    <div id="party-details" class="my-5 text-xs-center">
      <h1 class="display-3">{{ partyData.name }}</h1>
      <p class="headline">
        Partecipanti:
        <span v-for="player in partyData.players" :key="player.id">
        {{player.nick}},
      </span>
      </p>
    </div>
    <div v-if="!completed" class="round-section mb-5 text-xs-center">
      <h2>Round {{ partyData.round + 1 }}</h2>
      <h2 class="question">{{ partyData.question }}</h2>
      <h3 class="answers">{{ answersText }}</h3>
    </div>
    <div v-if="completed" class="round-section mb-5 text-cs-center">
      <p>Il party si è concluso! Questa è la classifica finale:</p>
    </div>
    <div v-if="!completed" id="ranking">
        <div id="correct">
          <h3>Bravi</h3>
          <ul>
            <li v-for="correct in correctPlays" :key="correct.player">
              {{correct.player}}: <strong class="green--text darken-2">{{correct.score}}</strong>
            </li>
          </ul>
        </div>
        <div id="wrong">
          <h3>Meno Bravi</h3>
          <ul>
            <li v-for="wrong in wrongPlays" :key="wrong.player">
              {{wrong.player}}: <strong class="red--text darken-2">{{wrong.score}}</strong>
            </li>
          </ul>
        </div>
    </div>
    <div v-if="completed" id="final-ranking" class="text-cs-center">
      <li v-for="finalRank in finalRanking" :key="finalRank.player">
        {{finalRank.player}}: {{finalRank.score}}
      </li>
    </div>
  </div>
</v-container>
</v-content>
</template>

<script>
import baasbox from 'baasbox'

const USER = 'agos!'
const PASS = 'minandoinallegria'

const PARTY_START_WAIT_MESSAGE = 'Il party deve ancora iniziare!'

baasbox.setEndPoint('http://baasbox.snaporder.top:9000')
baasbox.appcode = '1234567890'

const emptyPartyData = {
  name: null,
  players: [],
  round: -1,
  question: null,
  questions: [],
  plays: {},
  answers: [],
  ranking: [],
}

const getDataFromPartyModel = (partyDoc) => {
  const currentQuestion = partyDoc.questions[+partyDoc.currentRound]
  return  {
    name: partyDoc.name,
    players: partyDoc.players,
    round: partyDoc.currentRound,
    questions: partyDoc.questions,
    question: currentQuestion !== undefined
      ? currentQuestion.question
      : PARTY_START_WAIT_MESSAGE,
    answers: currentQuestion !== undefined
      ? currentQuestion.answers.map(a => a.answer).sort(() => Math.random() - 0.5)
      : [],
    plays: currentQuestion !== undefined
      ? partyDoc.plays[partyDoc.currentRound]
      : {},
    ranking: partyDoc.scores,
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
        .sort((a, b) => a.score < b.score)
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
        .sort((a, b) => a.score < b.score)
      return c
    },

    completed: function () {
      return this.partyData.round >= this.partyData.questions.length
    },

    finalRanking: function () {
      const c = Object.entries(this.partyData.ranking)
        .map(([pId, score]) => {
          return {
            player: this.playerNameFromId(pId),
            score: score
          }
        })
        .sort((a, b) => a.score < b.score)
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

.snapcolor {
  background-color: #F18623;
}

#main {
  width: 100%;
  font-size: 2rem;
}

#main h1,
#main h2,
#main h3 {
  font-family: Raleway;
}

#main h1,
#main h2,
#main h3,
#main .headline {
  color: #FFF;
  font-weight: 200;
}
#main .headline span {
  font-style: italic;
  font-weight: 500;
  color: #CDDC39;
  text-shadow: 1px 1px 0px grey;
}
#main .question {
  font-family: Raleway;
  font-size: 26px;
  font-weight: 600;
  margin: 25px 0;
  letter-spacing: .5px;
}

.round-section {
  text-align: center;
}

.round-section h2:first-child {
  color: #F44336;
  font-size: 60px;
  text-shadow: 0px 1px 0 grey;
}

#party-code-form {
  width: 100%;
  max-width: 400px;
  margin: auto;
  margin-top: 45vh;
}

#party-code-form form label {
  font-size: 25px;
  color: #FFF;
}

#ranking {
  display: flex;
  width: 70%;
  margin: auto;
  flex-direction: row;
  justify-content: space-around;
}

#ranking > div {
  flex: 0 1 400px;
}

#ranking > div > h3 {
  text-align: center;
}

#ranking ul {
  list-style: none;
}

#party-details {
  margin-top: 5px !important;
  margin-bottom: 15px !important;
}

#correct h3:first-child,
#wrong h3:first-child {
  color: #101010;
  text-decoration: underline;
}
#correct ul li,
#wrong ul li {
  text-align: center
}
#correct ul li,
#wrong ul li {
  text-align: center;
  color: #CDDC39;
  text-shadow: 0px 1px 0 grey;
  font-family: Raleway;
}
#correct ul li span.text--red {
  color: #2196f3;
}
#wrong ul li span.text--red {
  color: #f44336;
}

#final-ranking {
  max-width: 400px;
  margin: auto;
  text-align: center
}

</style>
