<template>
<div id="content-players" v-if="!isShowBracket">
          <div class="button_download button-csv" v-if="!isShowBracket">
            <input id="file-csv" type="file" accept=".csv" @change="handleFileUpload( $event )" title="Upload File CSV"/>
            <span class='button'>Import CSV</span>
          </div>
          <div class="button_download pdf-download" v-if="!isShowBracket">
            <button title="Download List (PDF)" class="button-pdf" @click="makePdf" :disabled="playerList.length < 2"><export-pdf /></button>
          </div> 
          <template v-if="!state.isRandom">
          <div class="button_download button-header" v-if="!isShowBracket">
            <button class="button-success" @click="randomPlayers" :disabled="players.length < 3" title="Random Participants">{{$t('random')}}</button>
          </div>
          </template>
          <template v-else-if="state.isRandom">
          <div class="button_download button-header" v-if="!isShowBracket">
            <button class="button-danger" @click="stopRandom" :disabled="players.length < 3">{{$t('stop')}}</button>
          </div>
          </template>
          
          <div class="player-list" :class="{hidden: isShowBracket}">
            <h3>{{$t('participants')}}</h3>
            <div class="table table-player">
              <table>
                <tr>
                  <th class="uppercase">{{$t('name')}}</th>
                  <th class="uppercase" v-if="tournamentSettings.bracketType == 'name-team'">{{$t('team')}}</th>
                  <th class="uppercase" style="text-align:center">{{$t('action')}}</th>
                </tr>
                <template v-for="(player, i) in playerList" :key="i">
                  <tr>
                    <td>{{player.name}}</td>
                    <td v-if="tournamentSettings.bracketType == 'name-team'">{{player.team}}</td>
                    <td class="action">
                      <span><button @click="editParticipant(player.id)">Edit</button></span>
                      <span><button @click="deleteParticipant(player.id)">Del</button></span>
                    </td>
                  </tr>
                </template>
                  <tr v-if="!playerList.length">
                    <td>{{$t('no_participants')}}</td>
                  </tr>
              </table>
            </div>
          </div>

          <div id="player-download" class="player-list" :class="{hidden:!state.isDownload}">
            <!-- <div id="player-download" class="player-list" > -->
            <div class="bracket-header">
                <h4 class="title">{{tournamentSettings.name}}</h4>
                <!-- <div v-if="tournamentSettings.competitionArea">
                    <span class="competition-area">Competition Area: {{tournamentSettings.competitionArea}}</span>
                </div> -->
                <div class="bracket-info">
                    <span class="date">{{$t('date')}}: {{tournamentSettings.date}}</span>
                    <div v-show="tournamentSettings.category">{{$t('category')}}: {{tournamentSettings.category}}</div>
                </div>
            </div>
            <div class="table table-player">
              <table>
                <tr>
                  <th>No.</th>
                  <th class="uppercase">{{$t('name')}}</th>
                  <th class="uppercase" v-if="tournamentSettings.bracketType == 'name-team'">{{$t('team')}}</th>
                </tr>
                <template v-for="(player, i) in playerList" :key="i">
                  <tr>
                    <td>{{i+1}}</td>
                    <td style="padding-left: 5px">{{player.name}}</td>
                    <td style="padding-left: 5px" v-if="tournamentSettings.bracketType == 'name-team'">{{player.team}}</td>
                  </tr>
                </template>
              </table>
            </div>
          </div>
    
</div>
</template>

<script>
import { ref, reactive } from 'vue'
import { jsPDF } from "jspdf";
import Papa from 'papaparse';
import {arrayMaxId, arrayMaxOrder} from '../helps.js'
import ExportPdf from '../components/icons/ExportPdf'
export default {
    props: {
        tournamentSettings: Object,
        isShowBracket: Boolean,
        playerList: Array,
        players: Array,
    },
    components: {ExportPdf},
    setup(props, {emit}) {
        const state = reactive({
            isDownload: false,
            isRandom: false,
        })
        const interval = ref(null)
        const autoStop = ref(null)

        const randomPlayers = () => {
            state.isRandom= true
            interval.value =  setInterval(() => {
                let newParticipants = props.players
                let afterShuffle = shuffle(newParticipants)
                let newAfter = []
                for(let i=0; i<afterShuffle.length; i++) {
                    let newObject = {id: afterShuffle[i].id, order: (i+1), name: afterShuffle[i].name, team: afterShuffle[i].team}
                    newAfter.push(newObject)
                }
                emit('participanUpdateRandom', newAfter)
            }, 70)

            autoStop.value = setTimeout(() => {
                if(state.isRandom) {
                clearInterval(interval.value)
                state.isRandom= false
                }
            }, 10000)
        }

        function shuffle(array) {
        return [...array].sort(() => Math.random() - 0.5);
        }

        const stopRandom = () => {
            state.isRandom= false
            clearInterval(interval.value);
            clearTimeout(autoStop.value)
        }

        const upload = reactive({
            file: '',
            content: [],
            parsed: false,
        })

        const handleFileUpload = async (event) => {
            upload.file = await event.target.files[0];
            if(upload.file) {
                parseFile(upload.file);
            }
        }

        const parseFile = async (file) => {
        await Papa.parse( upload.file, {
            header: true,
            skipEmptyLines: true,
            complete: function( results ){
                upload.content = results;
                upload.parsed = true;
                processData(upload)
            }.bind(upload)
        } );
        }
        const processData = (file) => {
        let content = file.content 
        let id = 1;
        let order = 1
        if(props.players.length) {
            let participants = props.players
            // console.log(participants)
            let maxId = arrayMaxId(participants)
            let maxOrder = arrayMaxOrder(participants)
            // console.log(maxOrder)
            id = maxId + 1
            order = maxOrder + 1
        }
        
        if(content.meta.fields[0] === 'name' || content.meta.fields[1] === 'team') {
            content.data.map((item) => {
            item.id = id
            item.order = order
            props.players.push(item)
            id++
            order++
            })
        }else {
            alert('Something wrong with your data, please try again!')
        }
        //   console.log(props.players)
        document.getElementById('file-csv').value = null
        // state.players.push(file.content.data)
        }
        async function makePdf() {
            state.isDownload = true
            var doc = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4',
                })
            
            await doc.html(document.querySelector("#player-download"), {
                callback: function(pdf) {
                    // console.log(doc.internal.pageSize.height)
                    pdf.setFont('helvetica')
                    pdf.getFontSize(12)
                    // pdf.page = 1
                    pdf.getLineWidth(100)
                    pdf.text(20,615, 'https://tournamentbuilder.net'); //print number bottom right
                    pdf.save("participants.pdf")
                    },
                margin: [10, 10, 10, 20],
                x: 0,
                y: 0,
                width: 410,
                // height: 300,
                windowWidth: 630,
            })
            state.isDownload = false
        }

        const editParticipant = (id) => {
            let participant = props.players.find((item) => item.id === id)
            emit('editParticipant', id)
            // props.isUpdate = true
         }

        const deleteParticipant = (id) => {
            let participantIndex = props.players.findIndex((item) => item.id === id)
            props.players.splice(participantIndex, 1)
            // console.log(participant)
        }
        
        return {
            state,
            makePdf,
            randomPlayers,
            stopRandom,
            upload,
            handleFileUpload,
            deleteParticipant,
            editParticipant,
        }
    }
}
</script>

<style>
#content-players {
    padding-top: 10px;
    border-top: 1px solid #ccc;
}

#player-download table > tr {
  font-size: 11px;
  height: 25px;
}
#player-download tr th {
  text-align: center;
}
#player-download tr th:last-child, #player-download tr td:last-child {
    width: auto;
}
#player-download tr th, #player-download tr td {
  border-right: 1px solid #ccc;
}
#player-download tr th:first-child, #player-download tr td:first-child {
  text-align: center;
  border-left: 1px solid #ccc;
}
#player-download tr > td:first-child, #player-download tr > th:first-child {
  width: 30px;
}
.player-list {
  position: relative;
  transition: all .7s;
  left: 0;
}
.player-list.hidden {
  position: absolute;
  /* top: 0; */
  left: -100%;
  transition: all .7s;
}
td.action > span:first-child {
  margin-right: 3px;
}
#file-csv {
  /* margin-top: 10px; */
  padding: 5px;
  /* width: 200px; */
  font-size: 13px;
  cursor: pointer;
}
.button_download {
    display: inline-block;
    margin-right: 5px;
}

table {
  min-width: 630px;
  border-collapse: collapse;
}
tr {
  border-bottom: 1px solid #ccc;
    height: 40px;
}
tr th {
  text-align: left;
  border-top: 1px solid #ccc;
}
tr th, tr td {
  /* border-left: 1px solid #ccc; */
}
tr td:first-child, tr td:nth-child(2) {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
tr th:last-child, tr td:last-child {
  width: 80px;
}
.table {
  height: 340px;
  overflow-y: auto;
}
@media (min-height: 700px) {
  .table {
    height: 450px;
  }
}
/* @media (max-height: 601px) {
  .table {
    height: 340px;
  }
} */
#player-download .table {
    height: 100%;
}
.button-csv {
    display: inline-block;
    position: relative;
    cursor: pointer;
    margin-right: 0;
}
#file-csv[type='file'] {
    position: absolute;
    opacity: 0;
}
.button-csv > .button {
    color: white;
    background: rgb(121, 173, 225);
    border: 1px solid #ccc;
	border-radius: 3px;
	cursor: pointer;
	display: inline-block;
	padding: 5px 25px;
    font-size: 14px;
}
.button-csv:hover > .button{
	/* background: rgb(121, 173, 225); */
    background: rgb(74, 141, 208);
	color: white;
    /* opacity: 3; */
}
.button-csv:active > .button {
    /* padding: 4px 22px; */
    background: rgb(19, 88, 157);
}
.player-list > h3 {
  text-transform: uppercase;
}
.uppercase {
  text-transform: uppercase;
}
</style>