<template>
<div class="content-right">
    <div class="form-container">
        <div><h3 class="uppercase">{{$t('advanced')}}</h3></div>
        <form action="">
          <div class="tournament_name">
            <div class="match_type">
            <div for="typename">{{$t('bracket type')}}:</div>
            <div>
              <!-- {{settings.bracketType}} -->
            <select id="typename" v-model="form.bracketType" @change="changeForm" multiple>
              <template v-for="typeB in settings.bracketTypes" >
                <option :value="typeB.value" :selected="typeB.value == settings.bracketType">{{typeB.title}}</option>
              </template>
            </select>
          </div>
            <label for="typetournament">{{$t('tournament type')}}:</label>
            <select id="typetournament" v-model="form.tournamentType" @change="changeForm">
              <template v-for="typeT in settings.tournamentTypes" >
                <option :value="typeT.value">{{typeT.title}}</option>
              </template>
            </select>
            </div>
            <!-- <input type="checkbox" @click="checkCompetitionArea"> -->
            <label class="con-check"> {{$t('competition area')}}?
              <input type="checkbox" v-model="form.isCompetitionArea" @change="changeIsCompetitionArea">
              <span class="checkmark"></span>
            </label>

            <input type="text" v-model="form.competitionArea" :placeholder="$t('competition area')" :disabled="!form.isCompetitionArea" @blur="changeForm">

            <!-- <label class="con-check">Category/Class?
              <input type="checkbox" v-model="form.isCategoryClass" v-on:change="changeForm" checked>
              <span class="checkmark"></span>
            </label> -->

            <!-- <input type="text" v-model="form.category" placeholder="Category/Class Name" :disabled="!form.isCategoryClass" @blur="changeForm"> -->

            <label class="con-check"> {{$t('show match number')}}?
              <input type="checkbox" v-model="form.isMatchNumber" @change="changeForm">
              <span class="checkmark"></span>
            </label>
          </div>
        </form>
        <div class="download-csv-sample">
          <h5>{{$t('download csv sample')}}</h5>
          <!-- <a :href="importSampleName" download>Download CSV Sample (Only Name)</a> -->
          <button style="margin-right: 10px" @click="downloadCSVDataOne">{{$t('sample csv')}} 1</button>
          <button @click="downloadCSVDataTwo">{{$t('sample csv')}} 2</button>
          <!-- <img src="@/assets/logo.png" alt=""> -->
        </div>
        <button class="button-back" @click="$emit('hideAdvance')">{{$t('back')}}</button>
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
// import SampleOnlyName from "../assets/import-sample-only-name.csv"
// import SampleOnlyName from "../assets/logo.png"
export default {
  props: {
    settings: Object,
  },
  data: () => ({
    form: {
      isCompetitionArea: false,
      competitionArea: '',
      bracketType: ['single-name'],
      tournamentType: 'single-elimination',
      isMatchNumber: true,
      isCategoryClass: false,
      category: '',
    },
    csvData1: [
      ['Selly'], ['Juliet'], ['Septy'],
    ],
    csvData2: [
      ['Selly', 'Team 1'], 
      ['Juliet', 'Team 2'], 
      ['Septy', 'Team 3'],
    ],
    // importSampleName: SampleOnlyName,
  }),
  methods: {
    changeForm() {
      this.$emit('changeFormAdvanced', this.form)
    },
    downloadCSVDataOne() {
      let title = 'name\n';
      this.createCsvFile('sample-import-csv-1.csv', this.csvData1, title)
    },
    downloadCSVDataTwo() {
      let title = 'name;team\n';
      this.createCsvFile('sample-import-csv-2.csv', this.csvData2, title)
    },
    createCsvFile(filename, csvData, titleData) {
      let csv = titleData;
      csvData.forEach((row) => {
              csv += row.join(';');
              csv += "\n";
      });
      const anchor = document.createElement('a');
      anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      anchor.target = '_blank';
      anchor.download = filename;
      anchor.click();
    }
  }
}
</script>

<style>
#typename {
    width: 100%;
    height: 40px;
}
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
.form-advance {
  position: absolute;
  top: 0;
  right: -35%;
  background-color: white;
  transition: all .5s;
}
.form-advance.show {
  transition: all .5s;
  right: 0%;
}
.download-csv-sample {
  margin-top: 30px;
}
@media (max-width: 767px) {
  .form-advance {
    right: 0;
    opacity: 0;
    z-index: -1;
  }
  .form-advance.show {
    transition: all .5s;
    right: 0%;
    opacity: 1;
    z-index: 1;
  }
}
</style>