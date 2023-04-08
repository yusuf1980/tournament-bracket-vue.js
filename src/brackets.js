export default function brackets () {
    const rule = [2, 4, 8, 16, 32, 64, 128]
    const arrayRound = [1, 2, 3, 4, 5, 6, 7]
    let sumPlayer = 0

    const type = ['single', 'double'];

    const double = (players) => {
        console.log('double elimination')
    }

    const single  =  (players) => {
        sumPlayer = players.length
        let roundIndex
        let typeRule = rule.find((item, index) => {
            roundIndex = sumPlayer === 2 ? 0: index + 1
            return sumPlayer <= item
        })
        let result = [], playerArray = []
        result.push({typeRule: typeRule})
        let byeInRound1 = typeRule - sumPlayer

        let base = sumPlayer,
            byes = byeInRound1

        if(byes > 0) base = typeRule

        let brackets = [],
            round = 1,
            baseT = base / 2,
            baseC = base / 2,
            teamMark = 0,
            nextInc = base/2,
            empty = {name: '', team:''};
        let match = 1

        for(let i = 1; i<=(base-1); i++) {
            let baseR = i/baseT,
                isBye = false;

            if(byes>0 && (i%2!=0 || byes >= (baseT-i))) {
                isBye = true
                byes--
            }

            let l = brackets.filter((b) => b.nextGame == i)
            let last = l.map((b) => {
                return { game:b.bracketNo, teams:b.teamnames }
            })
            
            brackets.push({
                lastGames: round == 1? null : [last[0].game, last[1].game],
                nextGame: nextInc + i > base -1 ? null : nextInc + i,
                teamnames: round == 1 ? isBye ? [players[teamMark], empty] : [players[teamMark], players[teamMark + 1]] : ['',''],
                bracketNo: isBye ? '': match,
                roundNo: round,
                bye: isBye
            })

            if(isBye) {
                teamMark+=1; 
            }else {
                teamMark+=2;
                match++
            }
            
            if(i%2!=0)	nextInc--;
			while(baseR>=1) {
			    round++;
				baseC/= 2;
				baseT = baseT + baseC;
				baseR = i/baseT;
			}
        }

        let groupBracketByRound = groupBy(brackets, 'roundNo')

        result.push(groupBracketByRound)

        return result
    }

    const groupBy = (xs, key) => {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    return {
        single
    }
}