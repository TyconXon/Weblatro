// alert("Hello!");
// sv_cheats = 1;

RULEBOOK.jokers.myJoker = {
    name : "My Joker!",                             //Name displayed on hover
    description: "No more mult!",                   //Description
    price: -99999,                                  //Price in shop
    quality:0,                                      //Quality 
    id : "096",                                     //image will be `img/Jokers/joker_${id}.png`
    hooks : [
        {
            in:"onIndependent", 
            out:["currentMultiplier"]
        },
    ],
    elementId : "NoneYet",
    //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
    onIndependent : (givenInformation)=>{
        let returningData = {currentMultiplier: 1};
        return returningData;
    },
};


game.player.addJoker(RULEBOOK.jokers.myJoker);