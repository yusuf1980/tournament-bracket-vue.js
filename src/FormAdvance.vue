<template>
<div class="content-right">
    <div class="form-container">
        <div><h3>ADVANCE</h3></div>
        <form action="">
          <div class="tournament_name">
            <div class="match_type">
            <label for="typename">Bracket Type:</label>
            <select id="typename" v-model="form.bracketType" @change="changeForm">
              <template v-for="typeB in settings.bracketTypes" >
                <option :value="typeB.value">{{typeB.title}}</option>
              </template>
            </select>
            <label for="typetournament">TournamentType:</label>
            <select id="typetournament" v-model="form.tournamentType" @change="changeForm">
              <template v-for="typeT in settings.tournamentTypes" >
                <option :value="typeT.value">{{typeT.title}}</option>
              </template>
            </select>
            </div>
            <!-- <input type="checkbox" @click="checkCompetitionArea"> -->
            <label class="con-check"> Competition Area?
              <input type="checkbox" v-model="form.isCompetitionArea" @change="changeIsCompetitionArea">
              <span class="checkmark"></span>
            </label>
            <input type="text" v-model="form.competitionArea" placeholder="Competition Area" :disabled="!form.isCompetitionArea" @blur="changeForm">
            <label class="con-check"> Gunakan Kategori/Class?
              <input type="checkbox" v-model="form.isCategoryClass" @change="changeIsCategoryClass">
              <span class="checkmark"></span>
            </label>
            <label class="con-check"> Use Match Number?
              <input type="checkbox" v-model="form.isMatchNumber" @change="changeIsCompetitionArea">
              <span class="checkmark"></span>
            </label>
          </div>
        </form>
        <button class="button-back" @click="$emit('hideAdvance')">Back</button>
      </div>
</div>
</template>

<script>
// import {ref} from 'vue'
// let isCompetitionArea = ref(false)
// const checkCompetitionArea = () => {
//   isCompetitionArea = !isCompetitionArea
//   console.log(isCompetitionArea)
// }
// let competitionArea 
export default {
  props: {
    settings: Object,
  },
  data: () => ({
    test: '',
    form: {
      isCompetitionArea: false,
      competitionArea: '',
      bracketType: 'single-name',
      tournamentType: 'single-elimination',
      isMatchNumber: true,
      isCategoryClass: false,
    }
  }),
  methods: {
    checkCompetitionArea() {
      this.isCompetitionArea = !this.isCompetitionArea
      console.log(this.isCompetitionArea)
    },
    changeTournamentType() {
      console.log(this.form.tournamentType)
    },
    changeBracketType() {
      console.log(this.form.bracketType)
    },
    changeIsCompetitionArea() {
      this.isCompetitionArea = !this.isCompetitionArea
      this.emitForm()
    },  
    changeForm() {
      this.emitForm()
    },
    emitForm() {
      this.$emit('changeFormAdvanced', this.form)
    }
  },
  
}
</script>

<style>
.match_type {
  padding: 7px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
}
.match_type select {
  margin-bottom: 12px;
}
.con-check {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.con-check input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}
.con-check:hover input ~ .checkmark {
  background-color: #ccc;
}
.con-check input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.con-check input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.con-check .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.button-back {
  margin-top: 20px;
}
</style>