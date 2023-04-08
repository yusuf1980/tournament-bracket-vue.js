<template>
<div class="bracket_container">
    <div class="" style="">
        <button title="Downlod Bracket (PDF)" class="button-pdf" @click="makePdf"><export-pdf /></button>
    </div>   
    <div class="tournament-bracket"  id="capture">
        <div class="bracket-header">
            <h4 class="title">{{settings.name}}</h4>
            <div v-if="settings.competitionArea">
                <span class="competition-area">Competition Area: {{settings.competitionArea}}</span>
            </div>
            <div class="bracket-info">
                <span class="date">Date: {{settings.date}}</span>
                <div v-show="settings.category">Category/Class: {{settings.category}}</div>
            </div>
        </div>
        <div class="tournament" v-if="formula.length" :class="['type'+formula[0].typeRule]">
            <template v-for="(round, i) in formula[1]" :key="i">
                <ul class="round" :class="'round-'+i" :style="{'font-size': fontSize + 'px'}">
                <template v-for="(p, index) in round" :key="index">
                    <li class="spacer">&nbsp;</li>
                    <li class="game-left game-top" v-html="nameTop(p)"></li>
                    <li class="game-left game-top-team" v-html="teamNameTop(p)"></li>
                    <li class="game-left spacer">&nbsp;</li>
                    <li class="match-number-left"><span v-show="p.bracketNo!=''" v-html="matchNumber(p)"></span></li>
                    <li class="game-left spacer">&nbsp;</li>
                    <li class="game-left game-bottom" v-html="nameBottom(p)"></li>
                    <li class="game-left bottom-team" v-html="teamNameBottom(p)"></li>
                    <li class="spacer">&nbsp;</li>
                </template>
                </ul>
            </template>
            <ul class="round final-result">
                <li class="spacer">&nbsp;</li>
                <li class="spacer">&nbsp;</li>
            </ul>
        </div>
    </div>
    
          
</div>
</template>

<script>
// import brackets from '../brackets.js'
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { ref, reactive, onMounted, watch} from 'vue'
import ExportPdf from '../components/icons/ExportPdf'

export default {
    props: {
        players: Array,
        settings: Object,
        formula: Array,
    },
    components: {
        ExportPdf
    },  
    setup(props) {
        let fontSize = ref(12)
        const settings = props.settings

        const nameTop = (p) => {
            return p.teamnames[0].name == ''? "&nbsp;": p.teamnames[0].name
        }
        const nameBottom = (p) => {
            return p.teamnames[1].name == ''? "&nbsp;": p.teamnames[1].name
        }
        const matchNumber = (p) => {
            if(settings.isMatchNumber) return p.bracketNo==''?"":p.bracketNo
            else return "&nbsp;"
            // return p.teamnames[1].name == ''? "&nbsp;": p.teamnames[1].name
        }
        const teamNameTop = (p) => {
            if(settings.bracketType == 'name-team') return p.teamnames[0].team == ''? "&nbsp;": p.teamnames[0].team
            else return "&nbsp;"
        }
        const teamNameBottom = (p) => {
            if(settings.bracketType == 'name-team') return p.teamnames[1].team == ''? '&nbsp;': p.teamnames[1].team
            else return "&nbsp;"
        }
        // const { single } = brackets()

        function makePdf() {
            const typeRule = props.formula[0].typeRule
            
            let pdfWidth = 610
            if(typeRule == 16) {
                pdfWidth = 330
                // fontSize = 14
            }
            else if (typeRule == 8) {
                pdfWidth = 550
            }
            else if (typeRule == 32 || typeRule == 64) {
                pdfWidth = 345
            }
            // window.html2canvas = html2canvas
            // html2canvas(document.body).then(function(canvas) {
            //     document.body.appendChild(canvas);
            // });
            // html2canvas(document.querySelector("#capture"), {
            //     // allowTaint: true,
            //     // useCORS: true,
            //     // scale: 1
            // }).then(canvas => {
            //     document.body.appendChild(canvas);
            //     var img = canvas.toDataURL("image/png")
            //     console.log(img)
            //     console.log(canvas.width)
            //     var doc = new jsPDF({
            //         orientation: "landscape"
            //     })
            //     doc.setFont('Arial')
            //     doc.getFontSize(12)
            //     doc.addImage(img, 'PNG', 7, 13, 195, 105)
            //     doc.save("a4.pdf")
            // });
            // console.log(html2canvas)
            var doc = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4',
            })
            doc.html(document.querySelector("#capture"), {
                callback: function(pdf) {
                    // console.log(doc.internal.pageSize.height)
                    pdf.setFont('helvetica')
                    pdf.getFontSize(20)
                    // pdf.page = 1
                    pdf.getLineWidth(100)
                    pdf.text(20,615, 'https://tournamentbuilder.net'); //print number bottom right
                    pdf.save("bracket.pdf")
                },
                margin: [20, 10, 20, 40],
                x: 0,
                y: 0,
                width: pdfWidth,
                height: 300,
                windowWidth: 675,
            })
        }

        onMounted(() => {
        })

        return {
            // formula,
            makePdf,
            fontSize,
            settings,
            teamNameBottom,
            teamNameTop,
            nameTop,
            nameBottom,
            matchNumber
        }
    }
}
</script>

<style>

.bracket_container {
    width: 630px;
    overflow: auto;
    position: absolute;
    /* top: 30px; */
    top: 0;
    opacity: 0;
    /* right: -100%; */
    transition: all .5s;
    z-index: -1;
    padding-top: 10px;
    border-top: 1px solid #ccc;
}
.bracket_container.show {
    position: relative;
    opacity: 1;
    right: 0;
    transition: all .5s;
    z-index: 1;
}
.bracket-header {
    /* border-bottom: 1px solid #aaa; */
    margin-bottom: 20px;
}
.bracket-header > .title {
    text-transform: uppercase;
    margin-bottom: 3px;
    font-weight: 500;
}
.bracket-info {
    font-size: 13px;
}
.tournament {
    display: flex;
    flex-direction: row;
    position: relative;
}
.tournament .round {
    font-size: .65em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100px;
    list-style: none;
    padding: 0;
    /* position: relative; */
}
.tournament .round .spacer {
    flex-grow: 1;
}
.tournament .round .spacer:first-child, .tournament .round .spacer:last-child {
    flex-grow: 1;
}
li.game-left {
    border-right: .7px solid #000;
}
li.game-left {
    border-right: .7px solid #000;
}
li.game-bottom {
    border-bottom: .7px solid #000;
}
li.game-top {
    border: none;
    border-bottom: .7px solid #000;
}
.first-four-winner li.game-left, .round-1 li.game-left, .round-2 li.game-left, .round-3 li.game-left, .round-4 li.game-left, .semi-final li.game-left {
    /* padding-left: 0.5em; */
}
.tournament .round.spacer {

}
li.game-left.spacer {
    border-right: .7px solid #000;
    /* min-height: 120px; */
    padding-right: 0.25em;
}
li.game-right.spacer {
    border-left: .7px solid #000;
    /* min-height: 120px; */
    padding-left: 0.25em;
}
li.game-right {
    text-align: right;
}
li.spacer.spacer-right {
    right: 0;
}
li.game-right.game-bottom {
    border-left: .7px solid #000;
}
.first-four-winner li.game-right, .round-1 li.game-right, .round-2 li.game-right, .round-3 li.game-right, .round-4 li.game-right, .semi-final li.game-right {
    padding-right: 0em;
}
/* .final {
    text-align: center;
    padding-top: 1em;
    padding-bottom: 1em;
    border: .7px solid #000;
    margin-top: 1em;
    margin-bottom: 1em;
    font-weight: bold;
} */

/* type 2 */
.tournament.type2 {
    font-size: 18px;
}
.tournament.type2 li.game-left.spacer, .tournament.type2 li.game-right.spacer {
    min-height: 50px;
}
.tournament.type2 .round-1 {
    width: 250px;
}
.tournament.type2 .round-2 {
    width: 120px;
}

/* type 4 */
.tournament.type4 {
    font-size: 18px;
}
.tournament.type4 li.game-left.spacer, .tournament.type4 li.game-right.spacer {
    min-height: 30px;
}
.tournament .round-1 {
    width: 200px;
}
.tournament.type4 .round-2 {
    width: 120px;
}


.match-number-left {
    /* font-size: 20px; */
    /* margin: 0 auto; */
    border-right: .7px solid #000;
    /* width: 30px; */
    padding: 3px;
    text-align: center;
    height: 20px;
}
.match-number-left {
    /* flex-grow: 1; */
}
.match-number-left > span, .match-number-right > span {
    border: .7px solid #000;
    padding: 3px 5px;
}
.match-number-right {
    border-left: .7px solid #000;
    padding: 3px;
    text-align: center;
}

.game-top > span {
    /* font-size: 12px; */
    position: absolute;
    top: -2px;
    left: 0;
}
.game-right.game-top > span {
    left: auto;
    right: 0;
}
.game-bottom + .spacer {
    /* position: absolute; */
    bottom: -3px;
}
.game-left.team span {
    position: absolute;
    left: 0;
}
.semi-final > .spacer:first-child {
    border-bottom: .7px solid #000;
}
.game-left.game-bottom span, .game-right.game-bottom span {
    /* position: absolute !important;  */
    bottom: 12px;
}
.game-left.game-bottom span {
    padding-left: 0;
    left: 0;
}
.game-right.game-bottom span {
    padding-right: 0;
    right: 0;
}
.round .spacer:first-child, .round .spacer:last-child {
    flex-grow: .5;
}
li.game-left.bottom-team {
    border-right: none;
}
.tournament .round.final-result {
    width: 30px;
}
.final-result .spacer:first-child {
    border-bottom: 1px solid;
    widows: 10px;
}
</style>