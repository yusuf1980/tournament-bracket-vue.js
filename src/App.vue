<template>
<div>
  <header>
    <div class="header-left">
      <h1><a href="/">TOURNAMENT <span style="color:rgb(80 159 239)">BUILDER</span></a></h1>
    </div>
    <div class="header-right">
      <div class="language-header">
        <select class="lang_button" v-model="$i18n.locale" @change="changeLang">
            <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang.code">
              {{ lang.text }}
            </option>
          </select>
      </div>
    </div>
  </header>
  <div class="content">
    <div class="content-left">
      <div class="content-left-container">
        <div class="content-header-left">

          <button @click="showBracket" :disabled="state.players.length < 2" >
            <span v-if="!columnShow.isShowBracket">{{$t('create_bracket')}}</span>
            <span v-else="columnShow.isShowBracket">{{$t('back')}}</span>
          </button>

          <div style="float: right">
            <button v-if="!isFullScreen" @click="fullScreen" title="Better use F11">Full Screen</button>
            <button v-else @click="closeFullScreen">x Close Full Screen</button>
          </div>

        </div>
        <div class="main-content">
          <participants 
          :tournamentSettings="tournamentSettings"
          :isShowBracket="columnShow.isShowBracket"
          :playerList="playerList"
          :players="state.players"
          @participanUpdateRandom="participanUpdateRandom"
          @editParticipant="editParticipant"
          />

          <bracket 
          :class="{show: columnShow.isShowBracket}"
          :players="participants"
          :settings="tournamentSettings"
          :formula="formula"
          />
          
        </div>
        
      </div>
    </div>
    <div class="sidebar">
        <form-right 
        class="main-form " :class="{hidden:advanceActive}"
        :tournamentSettings="tournamentSettings"
        :participants="state.players"
        :participant="state.participant"
        :isUpdate="state.isUpdate"
        :isShowBracket="columnShow.isShowBracket"
        @addParticipant="addParticipant"
        @openAdvanced="advanceActive = !advanceActive"
        @updateParticipant="updateParticipant"
        @cancelEditing="state.isUpdate = false"
        @changeOption="changeOption"
        />

        <form-advance class="form-advance"  :class="{show:advanceActive}"
        :settings="tournamentSettings"
        @hideAdvance="advanceActive = !advanceActive"
        @changeFormAdvanced="changeFormAdvanced"
        />
    </div>
  </div>
</div>
</template>

<script>
import Participants from './components/Participants'
import FormRight from './components/FormRight'
import FormAdvance from './components/FormAdvance'
import Bracket from './components/Bracket'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import {dateNow} from './helps.js'
import brackets from './brackets.js'
import { useI18n } from 'vue-i18n'
// import Papa from 'papaparse';

export default {
  name: 'App',
  components: {
    Participants, FormRight: FormRight, FormAdvance, Bracket
  },
  setup() {    
    const tournamentSettings = reactive({
      name: 'TournamentBuilder.net',
      date: dateNow('-'),
      isCompetitionArea: false,
      competitionArea: '',
      bracketType: 'single-name',
      bracketTypes: [{title: 'Name Only', value: 'single-name'}, 
                     {title: 'Name & Team/Club', value: 'name-team'}],
      tournamentTypes: [
        {title: 'Single Elimination', 'value': 'single-elimination'},
        {title: 'double Elimination', 'value': 'double-elimination'},
      ],
      tournamentType: 'single-elimination',
      isMatchNumber: true,
      isCategoryClass: false,
      category: '',
    })

    const height = window.innerHeight
    console.log(height) 

    const columnShow = reactive({
      isShowBracket: false,
      isShowPlayerList: true,
    })
    const advanceActive = ref(false)
    const isFullScreen = ref(false)
    const fullScreen = () => {
      var elem = document.documentElement;
      isFullScreen.value = true
      if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    const closeFullScreen = () => {
      isFullScreen.value = false
      var elem = document.documentElement;
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
    
    const state = reactive({
      players: [],
      isUpdate: false,
      participant: {},
      // menuActive: false
    })

    const { t, locale } = useI18n({ useScope: 'global' })

    const langs = ref([
        { code: "en", text: "English" },
        { code: "id", text: "Bahasa Indonesia" },
      ])

    const localSettings = reactive({
      localStorage: {lang: 'en'}
    })

    const changeLang = (e) => {
      localStorage.setItem('tournament-settings', JSON.stringify({lang: e.target.value}))
    }

    const currentSettings = () => {
      
      if(localStorage.getItem('tournament-settings')) {
        try {
          let settings = JSON.parse(localStorage.getItem('tournament-settings'))
          localSettings.localStorage = settings        }
        catch(e) {
          localStorage.removeItem('tournament-settings');
          localStorage.setItem('tournament-settings', JSON.stringify({lang: 'en'}))
        }
      }else {
        
        localStorage.setItem('tournament-settings', JSON.stringify({lang: 'en'}))
      }
    }

    const participanUpdateRandom = (randomParticipant) => {
      state.players = randomParticipant
    }

    const playerList = computed(() => {
      return state.players.sort((a, b) => a.order - b.order)
    })

    let participants = ref([])

    let formula = ref([])

    const addParticipant = (participant) => state.players.push(participant)

    const editParticipant = (id) => {
      state.participant = state.players.find((item) => item.id === id)
      state.isUpdate = true
    }

    const updateParticipant = (participant) => {
      let pIndex = state.players.findIndex((item) => item.id === participant.id)
      state.players.splice(pIndex, 1, participant)
      state.isUpdate = false
    }

    const { single } = brackets()
    
    const showBracket = () => {
      if(state.players.length > 1) {
        participants = state.players
        columnShow.isShowBracket = !columnShow.isShowBracket
        formula.value = single(participants)
      }
      else if (state.players.length == 1 ) alert('Minimal 2 participants.')
      else alert('Create participants first.')
    }

    watch(formula, (newValue, oldValue) => 
      newValue
    );

    const changeFormAdvanced = (value) => {
      tournamentSettings.competitionArea = value.competitionArea
      tournamentSettings.isCompetitionArea = value.isCompetitionArea
      tournamentSettings.bracketType = value.bracketType[0]
      tournamentSettings.tournamentType = value.tournamentType
      tournamentSettings.isMatchNumber = value.isMatchNumber
      // tournamentSettings.isCategoryClass = value.isCategoryClass
      
    }

    const changeOption = (setting) => {
      tournamentSettings.name = setting.tournamentName
      tournamentSettings.date = setting.tournamentDate
      tournamentSettings.category = setting.category
    }

    onMounted(() => {
      currentSettings()
      locale.value = localSettings.localStorage.lang
    })
      
    return {
      advanceActive,
      state,
      tournamentSettings,
      columnShow,
      showBracket,
      changeFormAdvanced,
      addParticipant,
      participants,
      formula,
      editParticipant,
      updateParticipant,
      playerList,
      changeOption,
      participanUpdateRandom,
      langs,
      changeLang,
      isFullScreen,
      fullScreen,
      closeFullScreen,
    }
  }
}
</script>

<style>
/* @font-face {
    font-family: "Open Sans Pro";
    src: url("assets/fonts/SourceSansPro-Regular.ttf");
}
@font-face {
    font-family: "Open Sans Pro";
    src: url("assets/fonts/SourceSansPro-Bold.ttf");
    font-weight: bold;
} */
* {
  box-sizing: border-box;
}
html {
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html, input, button {
    font-family: Helvetica, Arial, sans-serif;
    /* font-family: "Open Sans Pro", Arial, sans-serif; */
}
body {
  height: 100%;
  width: 100%;
  max-width: 970px;
  margin: 0 auto;
  /* display: flex; */
  align-items: center;
  padding-top: 1.5em;
  flex-direction: column;
}

/* Header */
header {
  position: relative;
  width: 970px;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
}
.header-left {
  position: relative;
  width: 100%;
  margin-right: 1em;
}
.header-left > h1 {
  margin-top: 0;
}
.header-left > h1 > a {
  color: #2c3e50;
  text-decoration: none;
}
.header-right {
  position: relative;
  flex-shrink: 0;
  width: 300px;
}
span.image-logo {

}

/* Menu Language */
.language-header {
  position: absolute;
  right: 0;
  top: 0;
}
.lang_button {
  background: none;
    outline: none;
    border: none;
    cursor: pointer;
    font-size: 1em;
    padding: 0 0.7em;
    color: #000;
    background-color: #fff;
    transition: color 0.2s ease-out, background-color 0.2s ease-out;
    align-items: center;
    justify-content: center;
    height: 2.1875em;
    display: flex;
    border: 2px solid #2a73d9;
    border-radius: 4px;
}
/* .lang_button:active {
  background: #2a73d9;
  color: white;
} */

.menu-lang {
    width: 100%;
    border: 1px solid;
    position: absolute;
    margin-top: 5px;
    border-radius: 0 0 5px 5px;
    z-index: -1;
    /* height: 0; */
    display: none;
    background-color: rgb(246, 246, 246);
}
.menu-lang.show {
  display: block;
  z-index: 100;
}
.menu-lang ul {
  list-style: none;
  margin-block-start: 5px;
  padding-inline-start: 5px;
  
}
.menu-lang ul > li {
    border-bottom: 1px solid;
    padding: 5px 0;
    cursor: pointer;
}
.menu-lang ul > li:last-child {
  border-bottom: none;
}
.menu-lang ul > li:active {
  color: #2a73d9;
}
/* end menu lang */

.content {
  position: relative;
  width: 100%;
  max-width: 970px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
}
.content {
  overflow: hidden;
}
.sidebar {
  width: 300px;
  border-left: 1px solid #ccc;
  overflow: hidden;
}
.content-left-container {
  padding: 10px;
  overflow: hidden;
}
.content-header-left {
}

.main-content {
  position: relative;
  overflow: hidden;
}
.content-header-left {
  margin-bottom: 10px;
}
.content-header-left > div, .content-header-left > button {
  display: inline-block;
  margin-right: 5px;
}
.main-form {
  left: 0%;
  transition: all .5s;
  opacity: 1;
  
}
.main-form.hidden {
  position: relative;
  left: -100%;
  transition: all .5s;
}

/* width */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 
  border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: rgb(181, 176, 176); 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(181, 176, 176); 
}

button {
  cursor: pointer;
}
.button-header button {
  padding: 6px;
  color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.button-header button:active {
  padding: 4px;
}
.button-success {
  background: #5ba279;
  border: 1px solid #575a57;
}
.button-success:hover {
  background: #328a57;
}
.button-danger {
  background: rgb(216, 86, 86);
}
.button-danger:hover {
  background: rgb(143, 31, 31);
}
.button-header button:disabled {
  color: rgba(16, 16, 16, 0.3);
  background: rgba(239, 239, 239, 0.3);
}
.button-header button:disabled {
  padding: 6px;
}
.button-pdf {
    background: no-repeat;
    border: none;
}
.button-pdf > svg {
    width: 2.5em !important;
    height: 2.5em !important;
}
.button-pdf:active > svg .disabled {
  fill: #ccc;
    /* width: 2.3em !important; */
    /* height: 2.3em !important; */
}
.pdf-download {
  margin-right: 0;
}
.button-pdf:disabled > svg {
    width: 2.5em !important;
    height: 2.5em !important;
}
.button-pdf:disabled > svg .disabled {
  fill: #ccc;
}
@media (max-width: 991px) {
  body {
    display: block;
  }
  .content {
    display: table;
    width: 100%;
  }
  .content-left, .sidebar {
    /* width: 100%; */
    display: table-cell;
  }
}
@media (max-width: 767px) {
  header {
    display: block;
    width: 100%;
  }
  .header-left {
    margin-left: 10px;
  }
  .header-right {
    width: 100%;
  }
  .language-header {
    position: relative;
    margin-right: 10px;
    margin-bottom: 20px;
    text-align: center;
    /* float: right; */
  }
  .lang_button {
    display: inline-block;
  }
  .content {
    display: block;
    width: 100%;
  }
  .content-left, .sidebar {
    display: block;
    position: relative;
    float: left;
    width: 100%;
  }
  table {
    min-width: 100%;
      /* border-collapse: collapse; */
  }
  .content-right {
    width: 100%;
    min-width: 300px;
  }
  .header-left {
    text-align: center;
  }
}
@media (max-width: 400px) {
  .header-left > h1 {
    font-size: 25px;
  }
}
select.lang_button option {
  cursor: pointer;
}
</style>