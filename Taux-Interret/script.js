let Basse = 100000;
let Taux = 1.01;
let GMonth = 1500;
let Gain = GMonth * 12;
let Basse0 = Basse;
// 101_000 - 12_120 = 88_880
function Bn(B0, R, T, n) {
    let QuotientT = (1 - Math.pow(T, n+1)) / (1 - T);
    return Math.pow(T, n) * B0 + R - R * QuotientT;
}
const LN = Math.log;

function getN (B0, R, T) {
    const LeftPart = -R * (1 - T) + R;
    const RightPart = (1 - T) * B0 + R* T;
    const years = (LN(LeftPart) - LN(RightPart)) / LN(T);
    const months = (years % 1) * 12;
    const yearsNeeded = Math.floor(years);
    const monthsNeeded = Math.ceil(months);
    return {
        you: {
            text: `${yearsNeeded} ans et ${monthsNeeded} mois de prelevement`,
            years: yearsNeeded,
            months: monthsNeeded,
        }
        banque: {
            text: `La banque a gagné ${} euros`            
        }
    };
}
const N = getN(Basse0, Gain, Taux);
console.log(N.text);
for (let index = 1; Basse > 0; index++) {
    Basse = Bn(Basse0, Gain, Taux, index);
    const str = Basse.toFixed(2).toString();
    const format = str.replace(/\B(?=(\d{3})+(?!\d))/g, " ").replace(".", ",");
    console.log(`Basse(${index})=${format}`);
}
