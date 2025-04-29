RULEBOOK = {
	blinds : {
		small : {
			name : "Small Blind",
			description: "",
			scaling : 1,
			payout : 3,
			colors : [
				[0.314, 0.518, 0.431],
				[0.314, 0.62, 0.431],
				[0.086, 0.137, 0.145]
			],
			color : "#009dff",
		},
		big : {
			name : "Big Blind",
			description: "",
			scaling : 1.5,
			payout : 3,
			colors : [
				[0.314, 0.518, 0.431],
				[0.314, 0.62, 0.431],
				[0.086, 0.137, 0.145]
			],
			color : "#fda200",
		},
		boss : [
			{
				name : "The Wall",
				description: "Extra large blind",
				minimumAnte : 2,
				scaling : 4,
				payout : 5,
				hooks : ["cardCheckHook"],
				cardCheckHook : function(card){
					return true
				},
				colors : [
					[0.871, 0.267, 0.231],
					[0.0, 0.42, 0.706],
					[0.086, 0.137, 0.145],
				]
			},
			{
				name : "The Club",
				description: "All Club cards are debuffed",
				scaling : 2,
				payout : 5,
				hooks : ["cardCheckHook"],
				minimumAnte : 1,
				cardCheckHook : function(card){
					if(card.suit == "c"){
						return false
					}else{
						return true
					}
				},
				colors : [
					[0.871, 0.267, 0.231],
					[0.0, 0.42, 0.706],
					[0.086, 0.137, 0.145],
				]
			},
			{
				name : "The Goad",
				description: "All Spade cards are debuffed",
				scaling : 2,
				payout : 5,
				hooks : ["cardCheckHook"],
				minimumAnte : 1,
				cardCheckHook : function(card){
					if(card.suit == "s"){
						return false
					}else{
						return true
					}
				},
				colors : [
					[0.871, 0.267, 0.231],
					[0.0, 0.42, 0.706],
					[0.086, 0.137, 0.145],
				]
			},
			{
				name : "The Window",
				description: "All Diamond cards are debuffed",
				scaling : 2,
				payout : 5,
				hooks : ["cardCheckHook"],
				minimumAnte : 1,
				cardCheckHook : function(card){
					if(card.suit == "d"){
						return false
					}else{
						return true
					}
				},
				colors : [
					[0.871, 0.267, 0.231],
					[0.0, 0.42, 0.706],
					[0.086, 0.137, 0.145],
				]
			},
			{
				name : "The Head",
				description: "All Heart cards are debuffed",
				scaling : 2,
				payout : 5,
				hooks : ["cardCheckHook"],
				minimumAnte : 1,
				cardCheckHook : function(card){
					if(card.suit == "h"){
						return false
					}else{
						return true
					}
				},
				colors : [
					[0.871, 0.267, 0.231],
					[0.0, 0.42, 0.706],
					[0.086, 0.137, 0.145],
				]
			},
			{
				name : "The Plant",
				description: "All face cards are debuffed",
				scaling : 2,
				payout : 5,
				hooks : ["cardCheckHook"],
				minimumAnte : 1,
				cardCheckHook : function(card){
					if(card.rank > 10){
						return false
					}else{
						return true
					}
				},
				colors : [
					[0.871, 0.267, 0.231],
					[0.0, 0.42, 0.706],
					[0.086, 0.137, 0.145],
				]
			},
			{
				name : "The Arm",
				description: "Decrease level of played poker hand",
				scaling : 2,
				payout : 5,
				hooks : ["beforeScoring"],
				minimumAnte : 1,
          		//givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
				  beforeScoring : function(givenInformation){
					// alert(givenInformation);
					let relevantPokerHand = RULEBOOK.basePokerHands[givenInformation.handType.hand];
					if(relevantPokerHand.level != 1){
						RULEBOOK.upgradePokerHand(givenInformation.handType.hand, -1);
					}
				},
				colors : [
					[0.871, 0.267, 0.231],
					[0.0, 0.42, 0.706],
					[0.086, 0.137, 0.145],
				]
			},
			{
				name : "The Serpent",
				description: "After play or discard, always draw 3 cards",
				scaling : 2,
				payout : 5,
				hooks : [],
				minimumAnte : 1,
				//This blind is special, and specifically checked for in relevant code.
				colors : [
					[0.871, 0.267, 0.231],
					[0.0, 0.42, 0.706],
					[0.086, 0.137, 0.145],
				]
			},
			{
				name : "The Hook",
				description: "Discards 2 random cards per hand played",
				scaling : 2,
				payout : 5,
				hooks : ["afterPlayHook"],
				minimumAnte : 1,
				elementId : "NoneYet",
          		// givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
				afterPlayHook : function(givenInformation){
					// let lowerhand = givenInformation.stationaryHand;
					for (let index of [1,2]) {
						let randomChoice = Math.floor(Math.random() * lowerhand.length);
						discardPile.addCard(lowerhand[randomChoice]);
						discardPile.render();
					}
				},
				colors : [
					[0.871, 0.267, 0.211],
					[0.0, 0.32, 0.206],
					[0.186, 0.137, 0.145]
				]
			},
			// {
			// 	name : "The Wheel",
			// 	description: "1 in 7 cards get drawn face down",
			// 	scaling : 2,
			// 	payout : 5,
			// 	hooks : ["drawCardHook"],
			// 	minimumAnte : 1,
			// 	elementId : "NoneYet",
          	//givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			// 	drawCardHook : function(card){
			// 		if(Math.random() < (1/7)){
			// 			card.faceDownBLIND = true;
			// 		}
			// 	},
			// 	colors : [
			// 		[0.871, 0.267, 0.211],
			// 		[0.0, 0.32, 0.206],
			// 		[0.186, 0.137, 0.145]
			// 	]
			// },
		]
	},
	anteScaling : [300,800,2000,5000,11000,20000,35000,50000],
	buildBlind : function(level,ante){
		let returningBlind = {};
		switch (level) {
			case 0:
				returningBlind = this.blinds.small
				break;
			case 1:
				returningBlind = this.blinds.big
				break;
			case 2:
				returningBlind = this.blinds.boss[Math.floor(Math.random()*this.blinds.boss.length)]
				// returningBlind = this.blinds.boss[this.blinds.boss.length-2]
				break;
			default:
				alert("err in building blind")
				break;
		}
		returningBlind.minimum = this.anteScaling[ante] * returningBlind.scaling;
		return returningBlind;

	},
	enhancements : {
		none : "Basic Card",
		bonus : "Bonus Card",
		mult : "Mult Card",
		wild : "Wild Card",
		glass : "Glass Card",
		steel : "Steel Card",
		stone : "Stone Card",
		gold : "Gold Card",
		lucky : "Lucky Card"
	},
	seals : {
		none : "No seal",
		gold : "Gold Seal",
		red : "Red Seal",
		blue : "Blue Seal",
		purple : "Purple Seal"
	},
	editions : {
		base : "Base",
		foil : "Foil",
		holographic : "Holographic",
		polychrome : "Polychrome",
		negative : "Negative"
	},
	hookEnum : {
		
	},
	jokers:{
		//on played, on scored, on held, independent , on other jokers, on discard
		joker:{
			name : "Joker",
			description: "<mult>+4</mult> Mult",
			price: 2,
			quality:0,
			id : "000",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + 4}
				return returningData
			},
		},
		gluttonousJoker:{
			name : "Gluttonous Joker",
			description: "Played cards with <clubs>Clubs</clubs> suit give <mult>+3</mult> Mult when scored",
			price: 5,
			quality:0,
			id : "019",
			hooks : [
				{
					in:"onScored", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				let clubCount = 0
				if(givenInformation.card.suit == "c") clubCount++;
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (clubCount*3)}
				return returningData
			},
		},
		wrathfulJoker:{
			name : "Afton 'feel my' Wrath",
			description: "Played cards with <spades>Spades</spades> suit give <mult>+3</mult> Mult when scored",
			price: 5,
			quality:0,
			id : "018",
			hooks : [
				{
					in:"onScored", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				let clubCount = 0
				if(givenInformation.card.suit == "s") clubCount++;
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (clubCount*3)}
				return returningData
			},
		},
		lustyJoker:{
			name : "Lusty Joker",
			description: "Played cards with <hearts>Hearts</hearts> suit give <mult>+3</mult> Mult when scored",
			price: 5,
			quality:0,
			id : "017",
			hooks : [
				{
					in:"onScored", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				let clubCount = 0
				if(givenInformation.card.suit == "h") clubCount++;
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (clubCount*3)}
				return returningData
			},
		},
		greedyJoker:{
			name : "Greedy Joker",
			description: "Played cards with <diamonds>Diamonds</diamonds> suit give <mult>+3</mult> Mult when scored",
			price: 5,
			quality:0,
			id : "016",
			hooks : [
				{
					in:"onScored", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				let clubCount = 0
				if(givenInformation.card.suit == "d") clubCount++;
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (clubCount*3)}
				return returningData
			},
		},
		flowerPotJoker:{
			name : "Flower Pot",
			description: "<mult>x3</mult> Mult if poker hand contains all suits.",
			price: 6,
			quality:1,
			id : "060",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let clubCount = 1;
				// alert(givenInformation.handType.scoringCards.join())

				if(
				givenInformation.handType.scoringCards.join().includes('S') &&
				givenInformation.handType.scoringCards.join().includes('D') &&
				givenInformation.handType.scoringCards.join().includes('C') &&
				givenInformation.handType.scoringCards.join().includes('H')
				){
					clubCount = 3;
				}

				let returningData = {currentMultiplier: givenInformation.currentMultiplier * clubCount}
				return returningData
			},
		},
		halfJoker:{
			name : "Half Joker",
			description: "<mult>+20</mult> if played hand contains <b>3</b> or fewer cards",
			price: 5,
			quality:0,
			id : "007",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let additionalMult = 0
				if(givenInformation.handType.scoringCards.length <= 3 && givenInformation.stationaryHand.length >= givenInformation.gameObject.player.handSize - 3){
					additionalMult = 20
				} 
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + additionalMult}
				return returningData
			},
		},
		misprintJoker:{
			name : "Misprint",
			description: "<mult>+RANDOM</mult> Mult",
			price: 5,
			quality:0,
			id : "026",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + Math.floor((Math.random()*25))}
				return returningData
			},
		},
		raisedFistJoker:{
			name : "Raised Fist",
			description: "Adds <u>double</u> the rank of the <u>lowest</u> ranked card held in hand to Mult",
			price: 5,
			quality:0,
			id : "028",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				if(givenInformation.stationaryHand.length < 1){
					let returningData = {currentMultiplier: givenInformation.currentMultiplier};
					return returningData;
				}

				let rankValues = [];
				givenInformation.stationaryHand.forEach(card => {
					let rank = parseInt(card.name.slice(1));
					rankValues.push(rank);
				});
				rankValues.sort((a, b) => a - b);

				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (2 * rankValues[0])};
				return returningData;
			},
		},
		bannerJoker:{
			name : "Banner",
			description: "<chips>+30</chips> Chips for each remaining <u>discard</u>",
			price: 5,
			quality:0,
			id : "021",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentChips"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let returningData = {currentChips: givenInformation.currentChips + (30 * givenInformation.gameObject.blind.discards)};
				return returningData;
			},
		},
		oddToddJoker:{
			name : "Odd Todd",
			description: "Played cards with <u>odd</u> rank give <chips>+31</chips> Chips when scored",
			price: 5,
			quality:0,
			id : "039",
			hooks : [
				{
					in:"onScored", 
					out:["currentChips"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				
				let additionalChips = 0
				
				if(givenInformation.card.rank % 2 !== 0){
					additionalChips += 31;
				}
			
				let returningData = {currentChips: givenInformation.currentChips + additionalChips};
				return returningData;
			},
		},
		hikerJoker:{
			name : "Hiker",
			description: "Every played card permanently gains +5 chips when scored.",
			price: 5,
			quality:1,
			id : "108",
			hooks : [
				{
					in:"onPlayed", 
					out:[]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onPlayed : (givenInformation)=>{
				givenInformation.handType.scoringCards.forEach(card => {
					card.chipBonus += 5;
				});
			},
		},
		evenStevenJoker:{
			name : "Even Steven",
			description: "Played cards with <u>even</u> rank give <mult>+4</mult> Mult when scored",
			price: 5,
			quality:0,
			id : "038",
			hooks : [
				{
					in:"onScored", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				
				let additionalMult = 0
				
				if(givenInformation.card.rank % 2 == 0){
					additionalMult += 4;
				}
			
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + additionalMult};
				return returningData;
			},
		},
		supernovaJoker:{
			name : "Supernova",
			description: "Adds the number of times the played <u>poker hand</u> has been played this run to Mult",
			price: 5,
			quality:0,
			id : "042",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let timesPlayed = givenInformation.gameObject.player.timesPokerHandPlayed[givenInformation.handType.hand] || 0
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (timesPlayed)};
				return returningData;
			},
		},
		spaceJoker:{
			name : "Space Joker",
			description: "<u> 1 in 4 </u> chance to upgrade level of played <u> poker hand </u>",
			price: 6,
			quality: 1,
			id : "053",
			hooks : [
				{
					in:"onPlayed", 
					out:[]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onPlayed : (givenInformation)=>{
				if(Math.random() < 0.25){
					this.upgradePokerHand(givenInformation.handType.hand);
				}
			},
		},
		scholarJoker:{
			name : "Scholar",
			description: "Played <u>Aces</u> give <chips>+20</chips> Chips and <mult>+4</mult> Mult when scored",
			price: 5,
			quality:0,
			id : "040",
			hooks : [
				{
					in:"onScored", 
					out:["currentMultiplier", "currentChips"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				let acesCounted = 0
				if(givenInformation.card.rank == 1){
					acesCounted++
				}

				let returningData = {
					currentMultiplier: givenInformation.currentMultiplier + (acesCounted * 4),
					currentChips : givenInformation.currentChips + (acesCounted * 20)
				}
				return returningData;   
			},
		},
		smileyFaceJoker:{
			name : "Smiley Face",
			description: "Played <u>face cards</u> give <mult>+5</mult> Mult when scored",
			price: 5,
			quality:0,
			id : "154",
			hooks : [
				{
					in:"onScored", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				let acesCounted = 0
				if(givenInformation.card.rank > 10){
					acesCounted++
				}
				let returningData = {
					currentMultiplier: givenInformation.currentMultiplier + (acesCounted * 4)
				}
				return returningData;   
			},
		},
		sockAndBuskinJoker:{
			name : "Sock and Buskin",
			description: "Retrigger all played face cards.",
			price: 5,
			quality:1,
			id : "013",
			hooks : [
				{
					in:"onAssignRetriggers", 
					out:[]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onAssignRetriggers : (cards, ts)=>{
				//ts pmo
				for (const card of cards) {
					if(card.rank > 10){
						card.temporaryRetriggers.push(ts.elementId);
					}
				}
			},
		},
		hackJoker:{
			name : "Hack",
			description: "Retrigger each played 2, 3, 4, or 5",
			price: 5,
			quality:0,
			id : "025",
			hooks : [
				{
					in:"onAssignRetriggers", 
					out:[]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onAssignRetriggers : (cards, ts)=>{
				//ts pmo
				for (const card of cards) {
					if(card.rank < 6){
						card.temporaryRetriggers.push(ts.elementId);
					}
				}
			},
		},
		hangingChadJoker:{
			name : "Hanging Chad",
			description: "Retrigger first played card used in scoring 2 additional times",
			price: 5,
			quality:0,
			id : "069",
			hooks : [
				{
					in:"onAssignRetriggers", 
					out:[]
				},
			],
			elementId : "NoneYet",
			          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onAssignRetriggers : (cards, ts)=>{
				let alreadyDid = false;
				cards[0].temporaryRetriggers = cards[0].temporaryRetriggers.concat( [ ...Array(2).keys() ].fill( ts.elementId ) )
			},
		},
		duskJoker:{
			name : "Dusk",
			description: "Retrigger all played cards in final hand of round",
			price: 5,
			quality:1,
			id : "074",
			hooks : [
				{
					in:"onAssignRetriggers", 
					out:[]
				},
			],
			elementId : "NoneYet",
			          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onAssignRetriggers : (cards, ts)=>{
				if ( game.blind.hands == 0){
					cards.forEach(card =>{
						card.temporaryRetriggers = card.temporaryRetriggers.concat( [ ...Array(1).keys() ].fill( ts.elementId ) )
					});
				}
			},
		},
		jollyJoker:{
			name : "Jolly Joker",
			description: "<mult>+8</mult> Mult if played hand contains a <u>Pair</u>",
			price: 3,
			quality:0,
			id : "002",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
			          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let hasPair = 0;

				let ranks = {};
				for (let card of givenInformation.handType.scoringCards) {
					let rank = parseInt(card.name.slice(1));
					ranks[rank] = (ranks[rank] || 0) + 1;
				}
				let rankCounts = Object.entries(ranks).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
				//document.querySelector("h1").innerText = JSON.stringify(ranks) + " | " + JSON.stringify(rankCounts)
				if (rankCounts[0][1] >= 2) {
					hasPair = 1
				}
				
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (hasPair * 8)}
				return returningData
			},
		},
		zanyJoker:{
			name : "Zany Joker",
			description: "<mult>+12</mult> Mult if played hand contains a <u>Three of a Kind</u>",
			price: 3,
			quality:0,
			id : "003",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let hasPair = 0;

				let ranks = {};
				for (let card of givenInformation.handType.scoringCards) {
					let rank = parseInt(card.name.slice(1));
					ranks[rank] = (ranks[rank] || 0) + 1;
				}
				let rankCounts = Object.entries(ranks).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
				//document.querySelector("h1").innerText = JSON.stringify(ranks) + " | " + JSON.stringify(rankCounts)
				if (rankCounts[0][1] >= 3) {
					hasPair = 1
				}
				
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (hasPair * 12)}
				return returningData
			},
		},
		madJoker:{
			name : "Mad Joker",
			description: "<mult>+10</mult> Mult if played hand contains a <u>Two Pair</u>",
			price: 3,
			quality:0,
			id : "004",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let hasPair = 0;

				let ranks = {};
				for (let card of givenInformation.handType.scoringCards) {
					let rank = parseInt(card.name.slice(1));
					ranks[rank] = (ranks[rank] || 0) + 1;
				}
				let rankCounts = Object.entries(ranks).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
				//document.querySelector("h1").innerText = JSON.stringify(ranks) + " | " + JSON.stringify(rankCounts)
				if (rankCounts.length > 1 && rankCounts[0][1] >= 2 && rankCounts[1][1] >= 2) {
					hasPair = 1
				}
				
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (hasPair * 10)}
				return returningData
			},
		},
		slyJoker:{
			name : "Sly Joker",
			description: "<chips>+50</chips> Chips if played hand contains a <u>Pair</u>",
			price: 3,
			quality:0,
			id : "138",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentChips"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let hasPair = 0;

				let ranks = {};
				for (let card of givenInformation.handType.scoringCards) {
					let rank = parseInt(card.name.slice(1));
					ranks[rank] = (ranks[rank] || 0) + 1;
				}
				let rankCounts = Object.entries(ranks).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
				//document.querySelector("h1").innerText = JSON.stringify(ranks) + " | " + JSON.stringify(rankCounts)
				if (rankCounts[0][1] >= 2) {
					hasPair = 1
				}
				
				let returningData = {currentChips: givenInformation.currentChips + (hasPair * 50)}
				return returningData
			},
		},
		wilyJoker:{
			name : "Wily Joker",
			description: "<chips>+100</chips> Chips if played hand contains a <u>Three of a Kind</u>",
			price: 3,
			quality:0,
			id : "139",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentChips"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let hasPair = 0;

				let ranks = {};
				for (let card of givenInformation.handType.scoringCards) {
					let rank = parseInt(card.name.slice(1));
					ranks[rank] = (ranks[rank] || 0) + 1;
				}
				let rankCounts = Object.entries(ranks).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
				//document.querySelector("h1").innerText = JSON.stringify(ranks) + " | " + JSON.stringify(rankCounts)
				if (rankCounts[0][1] >= 3) {
					hasPair = 1
				}
				
				let returningData = {currentChips: givenInformation.currentChips + (hasPair * 100)}
				return returningData
			},
		},
		cleverJoker:{
			name : "Clever Joker",
			description: "<chips>+80</chips> chips if played hand contains a <u>Two Pair</u>",
			price: 3,
			quality:0,
			id : "140",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentChips"]
				},
			],
			elementId : "NoneYet",
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (givenInformation)=>{
				let hasPair = 0;

				let ranks = {};
				for (let card of givenInformation.handType.scoringCards) {
					let rank = parseInt(card.name.slice(1));
					ranks[rank] = (ranks[rank] || 0) + 1;
				}
				let rankCounts = Object.entries(ranks).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
				//document.querySelector("h1").innerText = JSON.stringify(ranks) + " | " + JSON.stringify(rankCounts)
				if (rankCounts.length > 1 && rankCounts[0][1] >= 2 && rankCounts[1][1] >= 2) {
					hasPair = 1
				}
				
				let returningData = {currentChips: givenInformation.currentChips + (hasPair * 80)}
				return returningData;
			},
		},
		mysticSummitJoker:{
			name : "Mystic Summit",
			description: "<mult>+15</mult> Mult when <u>0</u> discards remaining",
			price: 5,
			quality:0,
			id : "022",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onIndependent : (givenInformation)=>{
				let qualifies = 0;
				if ( givenInformation.gameObject.blind.discards == 0 ){
					qualifies = 15;
				}
				let returningData = {currentMultiplier: givenInformation.currentMultiplier + (qualifies)};
				return returningData;
			},
		},
		fourFingersJoker:{
			name : "Four Fingers",
			description: "All flushes and straights can be made with 4 cards",
			price: 6,
			quality:1,
			id : "066",
			hooks : [],
			//This is a special joker - it is specifically checked for in relevant functions.
		},
		splashJoker:{
			name : "Splash",
			description: "All cards count in scoring.",
			price: 4,
			quality:0,
			id : "104",
			hooks : [],
			//This is a special joker - it is specifically checked for in relevant functions.
		},
	},
	vouchers:{
		overstockVoucher : {
			name : "Overstock",
			description : "Add an additional card slot to the shop.",
			price : 10,
			id : '00',
			onUse : function(voucherInformation){game.player.topShelfMax+=1;},
		},
	},
	boosters:{
		arcana : [
			{
				type : "Arcana",
				pick : 1,
				options : 3,
				id : "00"
			},
			{
				type : "Arcana",
				pick : 1,
				options : 3,
				id : "01"
			},
			{
				type : "Arcana",
				pick : 1,
				options : 3,
				id : "02"
			},
			{
				type : "Arcana",
				pick : 1,
				options : 3,
				id : "03"
			},
			{
				type : "Arcana",
				pick : 1,
				options : 5,
				id : "08"
			},
			{
				type : "Arcana",
				pick : 1,
				options : 5,
				id : "09"
			},
			{
				type : "Arcana",
				pick : 2,
				options : 5,
				id : "10"
			},
			{
				type : "Arcana",
				pick : 2,
				options : 5,
				id : "11"
			},
		],
		celestial : [
			{
				type : "Celestial",
				pick : 1,
				options : 3,
				id : "04"
			},
			{
				type : "Celestial",
				pick : 1,
				options : 3,
				id : "05"
			},
			{
				type : "Celestial",
				pick : 1,
				options : 3,
				id : "06"
			},
			{
				type : "Celestial",
				pick : 1,
				options : 3,
				id : "07"
			},
			{
				type : "Celestial",
				pick : 1,
				options : 5,
				id : "12"
			},
			{
				type : "Celestial",
				pick : 1,
				options : 5,
				id : "13"
			},
			{
				type : "Celestial",
				pick : 2,
				options : 5,
				id : "14"
			},
			{
				type : "Celestial",
				pick : 2,
				options : 5,
				id : "15"
			},
		],
		standard : [
			{
				type : "Standard",
				pick : 1,
				options : 3,
				id : "21"
			},
			{
				type : "Standard",
				pick : 1,
				options : 3,
				id : "22"
			},
			{
				type : "Standard",
				pick : 1,
				options : 3,
				id : "23"
			},
			{
				type : "Standard",
				pick : 1,
				options : 3,
				id : "24"
			},
			{
				type : "Standard",
				pick : 1,
				options : 5,
				id : "25"
			},
			{
				type : "Standard",
				pick : 1,
				options : 5,
				id : "26"
			},
			{
				type : "Standard",
				pick : 2,
				options : 5,
				id : "27"
			},
			{
				type : "Standard",
				pick : 2,
				options : 5,
				id : "28"
			},
		],
		buffoon : [
			{
				type : "Buffoon",
				pick : 1,
				options : 2,
				id : "29"
			},
			{
				type : "Buffoon",
				pick : 1,
				options : 2,
				id : "30"
			},
			{
				type : "Buffoon",
				pick : 1,
				options : 4,
				id : "31"
			},
			{
				type : "Buffoon",
				pick : 2,
				options : 4,
				id : "32"
			},
		],
		spectral : [
			{
				type : "Spectral",
				pick : 1,
				options : 2,
				id : "16"
			},
			{
				type : "Spectral",
				pick : 1,
				options : 2,
				id : "17"
			},
			{
				type : "Spectral",
				pick : 1,
				options : 4,
				id : "18"
			},
			{
				type : "Spectral",
				pick : 2,
				options : 4,
				id : "19"
			},
		],
	},

	tags : {
		uncommonTag : {
			name : "Uncommon Tag",
			description : "temp",
			hookOnto : "onShop",
			onShop : (tagInformation)=>{},
		},
		rareTag : {
			name : "Rare Tag",
			description : "temp",
			hookOnto : "onShop",
			onShop : (tagInformation)=>{},
		},
		negativeTag : {
			name : "Negative Tag",
			description : "temp",
			hookOnto : "onShop",
			onShop : (tagInformation)=>{},
		},
		foilTag : {
			name : "Foil Tag",
			description : "temp",
			hookOnto : "onShop",
			onShop : (tagInformation)=>{},
		},
		holographicTag : {
			name : "Holographic Tag",
			description : "temp",
			hookOnto : "onShop",
			onShop : (tagInformation)=>{},
		},
		polychromeTag : {
			name : "Polychrome Tag",
			description : "temp",
			hookOnto : "onShop",
			onShop : (tagInformation)=>{},
		},
		investmentTag : {
			name : "Investment Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		voucherTag : {
			name : "Voucher Tag",
			description : "temp",
			hookOnto : "onShop",
			onShop : (tagInformation)=>{},
		},
		bossTag : {
			name : "Boss Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		standardTag : {
			name : "Standard Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		charmTag : {
			name : "Charm Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		meteorTag : {
			name : "Meteor Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		buffoonTag : {
			name : "Buffoon Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		handyTag : {
			name : "Handy Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		garbageTag : {
			name : "Garbage Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		etherealTag : {
			name : "Ethereal Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		couponTag : {
			name : "Coupon Tag",
			description : "temp",
			hookOnto : "onShop",
			onShop : (tagInformation)=>{},
		},
		doubleTag : {
			name : "Double Tag",
			description : "temp",
			hookOnto : "onTag",
			onTag : (tagInformation)=>{},
		},
		juggleTag : {
			name : "Juggle Tag",
			description : "temp",
			hookOnto : "onBlind",
			onBlind : (tagInformation)=>{},
		},
		diceTag : {
			name : "D6 Tag",
			description : "temp",
			hookOnto : "onShop",
			onShop : (tagInformation)=>{},
		},
		topUpTag : {
			name : "Top-up Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		speedTag : {
			name : "Speed Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		orbitalTag : {
			name : "Orbital Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
		economyTag : {
			name : "Economy Tag",
			description : "temp",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{},
		},
	},

	consumables : {
		tarot : {
			theFool : {
				name : "The Fool",
				description : "Temporary",
				id : "00",
				selectionMaximum : -1,
				use : (tarotInformation)=>{},
			},
			theMagician : {
				name : "The Magician",
				description : "Temporary",
				id : "01",
				selectionMaximum : 2,
				use : (tarotInformation)=>{},
			},
			theHighPriestess : {
				name : "The High Priestess",
				description : "Temporary",
				id : "02",
				selectionMaximum : -1,
				use : (tarotInformation)=>{},
			},
			theEmpress : {
				name : "The Empress",
				description : "Temporary",
				id : "03",
				selectionMaximum : 2,
				use : (tarotInformation)=>{},
			},
			theEmperor : {
				name : "The Emperor",
				description : "Temporary",
				id : "04",
				selectionMaximum : -1,
				use : (tarotInformation)=>{},
			},
			theHierophant : {
				name : "The Fool",
				description : "Gives 2 soul hearts!",
				id : "05",
				selectionMaximum : -1,
				use : (tarotInformation)=>{},
			},
			theLovers : {
				name : "The Lovers",
				description : "Temporary",
				id : "06",
				selectionMaximum : 1,
				use : (tarotInformation)=>{},
			},
			theChariot : {
				name : "The Chariot",
				description : "Temporary",
				id : "07",
				selectionMaximum : 1,
				use : (tarotInformation)=>{},
			},
			theJustice : {
				name : "Justice",
				description : "Temporary",
				id : "00",
				selectionMaximum : 1,
				use : (tarotInformation)=>{},
			},
			theHermit : {
				name : "The Hermit",
				description : "Temporary",
				id : "09",
				selectionMaximum : -1,
				use : (tarotInformation)=>{game.player.money *= 2;},
			},
			theWheelOfFortune : {
				name : "The Wheel Of Fortune",
				description : "Temporary",
				id : "10",
				selectionMaximum : -1,
				use : (tarotInformation)=>{},
			},
			theStrength : {
				name : "Strength",
				description : "Temporary",
				id : "11",
				selectionMaximum : 2,
				use : (tarotInformation)=>{},
			},
			theHangedMan : {
				name : "The Hanged Man",
				description : "Temporary",
				id : "12",
				selectionMaximum : 2,
				use : (tarotInformation)=>{},
			},
			theDeath : {
				name : "The Death",
				description : "Temporary",
				id : "03",
				selectionMaximum : 2,
				use : (tarotInformation)=>{},
			},
			theTemperance : {
				name : "Temperance",
				description : "Temporary",
				id : "14",
				selectionMaximum : -1,
				use : (tarotInformation)=>{},
			},
			theDevil : {
				name : "The Devil",
				description : "Temporary",
				id : "15",
				selectionMaximum : 1,
				use : (tarotInformation)=>{},
			},
			theTower : {
				name : "The Tower",
				description : "Temporary",
				id : "16",
				selectionMaximum : 1,
				use : (tarotInformation)=>{},
			},
			theStar : {
				name : "The Star",
				description : "Temporary",
				id : "17",
				selectionMaximum : 3,
				use : (tarotInformation)=>{},
			},
			theMoon : {
				name : "The Moon",
				description : "Temporary",
				id : "18",
				selectionMaximum : 3,
				use : (tarotInformation)=>{},
			},
			theSun : {
				name : "The Sun",
				description : "Temporary",
				id : "19",
				selectionMaximum : 3,
				use : (tarotInformation)=>{},
			},
			theJudgement : {
				name : "Judgement",
				description : "Temporary",
				id : "20",
				selectionMaximum : -1,
				use : (tarotInformation)=>{},
			},
			theWorld : {
				name : "The World",
				description : "Temporary",
				id : "21",
				selectionMaximum : 3,
				use : (tarotInformation)=>{},
			},
		},
		// planet : {
		// 	mercury : {
		// 		name : "Mercury",
		// 		pokerHand : "Pair",
		// 		id : "30",
		// 	},
		// 	venus : {
		// 		name : "Venus",
		// 		pokerHand : "Three of a Kind",
		// 		id : "31",
		// 	},
		// 	earth : {
		// 		name : "Earth",
		// 		pokerHand : "Full House",
		// 		id : "32",
		// 	},
		// 	mars : {
		// 		name : "Mars",
		// 		pokerHand : "Four of a Kind",
		// 		id : "33",
		// 	},
		// 	jupiter : {
		// 		name : "Jupiter",
		// 		pokerHand : "Flush",
		// 		id : "34",
		// 	},
		// 	saturn : {
		// 		name : "Saturn",
		// 		pokerHand : "Straight",
		// 		id : "35",
		// 	},
		// 	uranus : {
		// 		name : "Uranus",
		// 		pokerHand : "Two Pair",
		// 		id : "36",
		// 	},
		// 	neptune : {
		// 		name : "Neptune",
		// 		pokerHand : "Straight Flush",
		// 		id : "37",
		// 	},
		// 	pluto : {
		// 		name : "Pluto",
		// 		pokerHand : "High Card",
		// 		id : "38",
		// 	},
			
		// },
		spectral : {
			sBlackHole : {
				name : "Black Hole",
				pokerHand : "ALL",
				id : "39",
			},
			sFamiliar : {
				name : "Familiar",
				description : "Temp",
				id : "40",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sGrim : {
				name : "Grim",
				description : "Temp",
				id : "41",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sIncantation : {
				name : "Incantation",
				description : "Temp",
				id : "42",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sTalisman : {
				name : "Talisman",
				description : "Temp",
				id : "43",
				selectionMaximum : 1,
				use : (spectralInformation)=>{},
			},
			sAura : {
				name : "Aura",
				description : "Temp",
				id : "44",
				selectionMaximum : 1,
				use : (spectralInformation)=>{},
			},
			sWraith : {
				name : "Wraith",
				description : "Temp",
				id : "45",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sSigil : {
				name : "Sigil",
				description : "Temp",
				id : "46",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sOuija : {
				name : "Ouija",
				description : "Temp",
				id : "47",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sEctoplasm : {
				name : "Ectoplasm",
				description : "Temp",
				id : "48",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sImmolate : {
				name : "Immolate",
				description : "Temp",
				id : "49",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sAnkh : {
				name : "Ankh",
				description : "Temp",
				id : "50",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sDejaVu : {
				name : "Deja Vu",
				description : "Temp",
				id : "51",
				selectionMaximum : 1,
				use : (spectralInformation)=>{},
			},
			sHex : {
				name : "Hex",
				description : "Temp",
				id : "52",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
			sTrance : {
				name : "Trance",
				description : "Temp",
				id : "53",
				selectionMaximum : 1,
				use : (spectralInformation)=>{},
			},
			sMedium : {
				name : "Medium",
				description : "Temp",
				id : "54",
				selectionMaximum : 1,
				use : (spectralInformation)=>{},
			},
			sCryptid : {
				name : "Cryptid",
				description : "Temp",
				id : "55",
				selectionMaximum : 1,
				use : (spectralInformation)=>{},
			},
			sTheSoul : {
				name : "The Soul",
				description : "Temp",
				id : "22",
				selectionMaximum : -1,
				use : (spectralInformation)=>{},
			},
		},
	},

	basePokerHands : {
		"Straight Flush" :{
			level : 1,
			chips : 100,
			mult  : 8,
			upgrade : [40,4],
			played: 0,
			id : 37,
			description: "Five cards in consecutive order of the same suit."
		},
		"Four of a Kind" :{
			level : 1,
			chips : 60,
			mult  : 7,
			upgrade : [30,3],
			played: 0,
			id : 33,
			description: "Four cards of the same rank. (xxxx)"
		},
		"Full House"     :{
			level : 1,
			chips : 40,
			mult  : 4,
			upgrade : [25,2],
			played: 0,
			id: 32,
			description: "A three pair and a two pair combined. (xxxzz)"
		},
		"Flush"          :{
			level : 1,
			chips : 35,
			mult  : 4,
			upgrade : [15,2],
			played: 0,
			id : 34,
			description: "Five cards of the same suit."
		},
		"Straight"       :{
			level : 1,
			chips : 30,
			mult  : 4,
			upgrade : [30,3],
			played: 0,
			id : 35,
			description: "Five cards in consecutive order."
		},
		"Three of a Kind":{
			level : 1,
			chips : 30,
			mult  : 3,
			upgrade : [20,2],
			played: 0,
			id : 31,
			description: "Three cards of the same rank."
		},
		"Two Pair"       :{
			level : 1,
			chips : 20,
			mult  : 2,
			upgrade : [20,1],
			played: 0,
			id : 36,
			description: "Two pairs in one hand. (xxzz)"
		},
		"One Pair"       :{
			level : 1,
			chips : 10,
			mult  : 2,
			upgrade : [15,1],
			played: 0,
			id : 30,
			description: "Two cards of the same rank. (xx)"
		},
		"High Card"      :{
			level : 1,
			chips : 5,
			mult  : 1,
			upgrade : [10,1],
			played: 0,
			id : 38,
			description: "Nothing else matches. Highest card scores, and no others."
		},
	},



	gamestates : {
		gsShop : "Shop",
		gsMenu : "Menu",
		gsBlind : "Blind",
		gsBooster : "Booster",
		gsBlindSelect : "Blind Select",
	},

	upgradePokerHand : (hand, times = 1) => {
		// alert(`"Reached rulebook" : ${hand} ${RULEBOOK.basePokerHands}`);
		saidHand = RULEBOOK.basePokerHands[hand];
		saidHand.level += times;
		saidHand.chips += (times * saidHand.upgrade[0]);
		saidHand.mult += (times * saidHand.upgrade[1]);
		alert(`${hand} is now level ${saidHand.level}! New base: ${saidHand.chips} x ${saidHand.mult}`);
	},
  }