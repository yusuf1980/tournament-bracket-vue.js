<template>
<div class="content-right">
      <div class="form-container">
        <h3 class="uppercase">{{$t('participant')}}</h3>
        <!-- <div class="category_class" v-show="tournamentSettings.isCategoryClass">
            <label for="class_category"> Kelas/Kategori:</label>
            <span id="class_category">Kadet Putra</span>
            <button class="button_class">Pilih</button>
        </div> -->
        <form @submit.prevent="submit">
          <div class="tournament_name">
            <input id="participan_name" v-model="form.name" type="text" class="form-control" :placeholder="$t('name')+'*'" autocomplete="off" :disabled="isShowBracket" title="Participant Name (required)">
            <input id="participant_team" v-model="form.team" type="text" class="form-control" :placeholder="$t('team')" v-if="tournamentSettings.bracketType == 'name-team'" autocomplete="off" :disabled="isShowBracket" title="Team Name">
          </div>
          <input type="submit" class="previous action-button" :value="isUpdate? $t('update'): '+ ' + $t('add')" :disabled="isShowBracket" />
        </form>
        <div style="text-align: center;">
            <button v-show="isUpdate" class="previous" @click="cancelEdit">{{$t('cancel editing')}}</button>
        </div>
      </div>
      <hr>
      <div class="form-container">
        <div><h3 class="uppercase">{{$t('options')}}</h3></div>
          <div class="tournament_name">
            <input id="tournament_name" v-model="options.tournamentName" type="text" class="form-control" :placeholder="$t('tournament name')" @blur="changeOption" :title="$t('tournament name')">
            <input id="tournament_date" v-model="options.tournamentDate" type="date" class="form-control" placeholder="Tournament Date" @blur="changeOption" :title="$t('tournament date')">
            <input type="text" v-model="options.category" :placeholder="$t('category name')" @blur="changeOption" :title="$t('category') + ' (Optional)'">
          </div>
        <button style="float: right" @click="$emit('openAdvanced')">{{ $t('advanced') }}</button>
      </div>
</div>
</template>

<script>
import { ref, onMounted, reactive, watch } from 'vue'
import {arrayMaxId, arrayMaxOrder} from '../helps.js'
export default {
    props: {
        tournamentSettings: Object,
        participants: Array,
        isUpdate: Boolean,
        participant: Object,
        isShowBracket: Boolean,
    },
    setup(props, {emit}) {
        
        const isCategory = ref(false)
        const participantId = ref(null)

        const form = reactive({
            id: null,
            name: '',
            team: '',
        })

        const options = reactive({
            tournamentName: '',
            tournamentDate: '',
            category: '',
        })

        const submit = async () => {
            if(props.isUpdate) return updateParticipant()
            if(form.name.length > 2) {
                let id = 1
                let order = 1
                if(props.participants.length) {
                    let participants = props.participants
                    let maxId = arrayMaxId(participants)
                    let maxOrder = arrayMaxOrder(participants)
                    id = maxId + 1
                    order = maxOrder + 1
                }
                let participant = {id: id, order: order, name: form.name, team: form.team}
                emit('addParticipant', participant)
                // console.log(props.participants)
                clearForm()
                participantId.value.focus()
            }
            else {
                alert('form harus diisi')
            }
        }

        const editParticipant = (participant) => {
            form.id = participant.id
            form.name = participant.name
            form.team = participant.team
            form.order = participant.order
            participantId.value.focus()
        }

        const updateParticipant = () => {
            let newParticipant = {id: form.id, name: form.name, team: form.team, order: form.order}
            emit('updateParticipant', newParticipant)
            clearForm()
        }

        const cancelEdit = () => {
            emit('cancelEditing')
            clearForm()
        }

        watch(() => props.isUpdate, (newVal) => {
            if(newVal === true) editParticipant(props.participant)
        })

        const clearForm = () => {
            form.id = null
            form.name = ''
            form.team = ''
        }

        const changeOption = () => {
            if(options.tournamentDate === '') options.tournamentDate = props.tournamentSettings.date
            if(options.tournamentName === '') options.tournamentName = props.tournamentSettings.name
            emit('changeOption', options)
        }

        onMounted(() => {
            let participant = document.getElementById("participan_name")
            participantId.value = participant
            // participantId.value.focus()
        })

        return {
            emit,
            isCategory,
            submit,
            form,
            cancelEdit,
            options,
            changeOption,
        }
    }
}


</script>

<style>
.content-right {
  position: relative;
  width: 300px;
  border-left: 1px solid #ccc;
  overflow: hidden;
}
.form-container {
  padding-left: 10px;
  padding-right: 10px;
}

input, textarea {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  color: #2C3E50;
  font-size: 18px;
}
form .action-button {
  background: #27AE60;
  font-weight: bold;
  color: white;
  border: 0 none;
  border-radius: 1px;
  cursor: pointer;
  padding: 10px;
  margin: 10px 5px;
  text-decoration: none;
  font-size: 16px;
  border-radius: 5px;
}
form .action-button:hover, form .action-button:focus {
  box-shadow: 0 0 0 2px white, 0 0 0 3px #27AE60;
}
form input.action-button:disabled {
    background: rgb(179, 178, 178);
    background: -internal-light-dark(rgba(228, 227, 227, 0.3), rgba(19, 1, 1, 0.3));
    /* background-color: -internal-light-dark(rgba(239, 239, 239, 0.3), rgba(19, 1, 1, 0.3)); */
    color: -internal-light-dark(rgba(16, 16, 16, 0.3), rgba(255, 255, 255, 0.3));
    border-color: -internal-light-dark(rgba(118, 118, 118, 0.3), rgba(195, 195, 195, 0.3));
}
.category_class {
    margin-bottom: 10px;
    border-bottom: 1px solid #2b91e5;
}
.category_class label {
    display: block;
    font-size: 12px;
}
#class_category {
    color: #da6218;
}
.button_class {
    position: absolute;
    right: 10px;
    background-color: #2b91e5;
    border: 1px solid #2b91e5;
    border-radius: 3px;
    color: rgb(244, 241, 241);
}
</style>