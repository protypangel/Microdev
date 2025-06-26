/** Retouner les valeurs des portes et la porte choisit
 * @return boolean[nbPorte] "doors" - les valeurs des portes
 * @return int "chooseDoor"   - la porte choisit
 * @return int "looseDoor"    - la porte qui est perdante obligatoirement
 */
function poseLeProbleme() {
    // Mettre ou se trouves la recompense et les deux perdents
    // 0 <= winDoor <= nbPorte - 1
    const winDoor = Math.floor(Math.random() * nbPorte);
    // Poser un tableau qui contient les valeurs
    // La porte gagante vaut true
    const doors = Array(nbPorte).fill(0).map((_,i) => i==winDoor);
    // Choisir une porte
    const chooseDoor = Math.floor(Math.random() * nbPorte);
    // La porte Perdante qui n'est la bonne porte, ni la porte gagnante.
    let looseDoor = doors
        // Ne pas prendre la porte choisit au debut et ne pas prendre la porte gagnante
        .findIndex((x,i) => i !== chooseDoor && !x);
    return [
        doors,
        chooseDoor,
        looseDoor
    ]
}
/** Retourne vrai si derriere la porte il y a la cadillac
 * Sinon retourne faux.
 * En prenant en compte le changement de porte
 * @params boolean[nbPorte] "doors" - les valeurs des portes
 * @params int "chooseDoor"   - la porte choisit
 * @params int "looseDoor"    - la porte qui est perdante obligatoirement
 * @return vrai si la porte choisit contient la cadillac sinon faux
 */
function changerDePorte([doors, chooseDoor, looseDoor]) {
    return doors.map((x,i) => { // Se souvenir de l'index pour le find
        return {
            index: i,
            value: x
        }
    })
    .find(x => chooseDoor !== x.index && looseDoor !== x.index) // Ne pas prendre la porte choisit du debut ni la porte perdante
    .value // Ya t'il la cadillac derriere ?
}
/** Retourne vrai si derriere la porte il y a la cadillac
 * Sinon retourne faux.
 * Sans prendre le changement de porte
 * @params boolean[nbPorte] "doors" - les valeurs des portes
 * @params int "chooseDoor"   - la porte choisit
 * @params int "looseDoor"    - la porte qui est perdante obligatoirement
 * @return vrai si la porte choisit contient la cadillac sinon faux
 */
function pasChangerDePorte([doors, chooseDoor, looseDoor]) {
    return doors[chooseDoor];
}

for (var nbPorte=3; nbPorte<=10;nbPorte++) {
    let A = 0, B = 0;
    for(let i=0; i<=1_000_000;i++) {
        const poser = poseLeProbleme();
        if (changerDePorte(poser)) A++;
        if (pasChangerDePorte(poser)) B++;
    }
    console.log(`Quand on change de porte : P${nbPorte}=`, A / 1_000_000);
    console.log(`Quand on ne change pas de porte : P${nbPorte}=`, B / 1_000_000);
}
