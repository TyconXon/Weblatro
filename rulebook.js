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
			{
				name : "The Manacle",
				description: "-1 Hand Size",
				scaling : 2,
				payout : 5,
				hooks : [],
				minimumAnte : 1,
				elementId : "NoneYet",
				//Special blind.
				colors : [
					[0.171, 0.167, 0.111],
					[0.0, 0.12, 0.106],
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
	//   https://www.desmos.com/calculator/rlvef810pn
	anteScaling : [300,800,2000,5000,11000,20000,35000,50000],//,  110000,560000,7200000,300000000,47000000000, 2.900e13,7.700e16,8.600e20 ],
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
		returningBlind.tag = randomOf(RULEBOOK.tags, (a)=>{return a.description == "temp"})
		// alert(returningBlind.tag.description);
		returningBlind.minimum = this.anteScaling[ante] * returningBlind.scaling;
		try {
			if( isNaN(this.anteScaling[ante]) ){
				let c = Math.round(ante) - 7
				let d = 1 + 0.2 * c;
				let amount = Math.floor(50000 * (1.6 + (0.75 * c)**(d) )**(c) )
				let computed = amount - (amount % (10**(Math.floor(Math.log10(amount)-1))))
				returningBlind.minimum = computed * returningBlind.scaling;
				if(isNaN(returningBlind.minimum)){
					alert("You've reached blinds too high to calculate! Congrats!");
					returningBlind.minimum = Number.POSITIVE_INFINITY
				}
			}
		} catch (error) {
			alert(error)
		}
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
		//onPlayed, onScored, onHeld, onIndependent , onOtherJokers, onDiscard, onRoundStart, onBuy, onSell
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
		steelJoker:{
			name : "Steel Joker",
			description: "Gives <mult>X0.2</mult> Mult for each <u>Steel Card</u> in your <u>full deck</u>",
			price: 5,
			quality:1,
			id : "027",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (givenInformation)=>{
				let multmultiplier = 1;
				cards.all.forEach(card => {
					if(card.enhancement == "Steel Card") multmultiplier+=0.2;
				});
				
				let returningData = {currentMultiplier: givenInformation.currentMultiplier * multmultiplier}
				return returningData;
			},
		},
		grosMichelJoker:{
			name : "Gros Michel",
			description: "<mult>+15</mult> Mult. <br> <u>1 in (9 x hands)</u> chance this card stops working permanently.",
			price: 3,
			quality:0,
			id : "067",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
			stillWorks : 15,
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (givenInformation)=>{
				let returningData = {currentMultiplier: givenInformation.currentMultiplier +givenInformation.ts.stillWorks}
				if( Math.random() < (1/(9 * Math.min(game.blind.hands,1))) ){
					alert("The banana is extinct!");
					givenInformation.ts.stillWorks = 0;
					$(`#${givenInformation.ts.elementId} span`).text("Extinct!");
					$(`#${givenInformation.ts.elementId}`).css({filter : "grayscale(100%)"});
				}
				return returningData;
			},
		},
		dnaJoker:{
			name : "DNA",
			description: "If only one card is played, copy that card and add it to your hand.",
			price: 5,
			quality:1,
			id : "103",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (givenInformation)=>{

				if(givenInformation.handType.scoringCards.length == 1){
					let referenceCard = givenInformation.handType.scoringCards[0];
					let card = new cards.Card(referenceCard.suit, referenceCard.rank, '#card-table');
					card.enhancement = referenceCard.enhancement;
					cards.all.push(card);
					card.el.click((ev) => {
						if (card.container) {
							var handler = card.container._click;
							if (handler) {
								handler.func.call(handler.context || window, card, ev);
							}
						}
					});
					lowerhand.addCard(card);	
				}
				
				let returningData = {currentMultiplier: givenInformation.currentMultiplier}
				return returningData;
			},
		},
		throwbackJoker:{
			name : "Throwback",
			description: "<mult>x0.25</mult> Mult for each Blind skipped",
			price: 5,
			quality:1,
			id : "075",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (givenInformation)=>{
				let multmultiplier = 1 + (0.25 * game.player.timesSkipped);

				let returningData = {currentMultiplier: givenInformation.currentMultiplier * multmultiplier}
				return returningData;
			},
		},
		bootstrapsJoker:{
			name : "Bootstraps",
			description: "<mult>+2</mult> Mult for every <u>$5</u> you have",
			price: 3,
			quality:1,
			id : "089",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (givenInformation)=>{
				let multAdd = (2 * Math.floor(game.player.money/5));

				let returningData = {currentMultiplier: givenInformation.currentMultiplier + multAdd}
				return returningData;
			},
		},
		cardSharpJoker:{
			name : "Card Sharp",
			description: "<mult>x3</mult> Mult if played poker hand has already been played this round",
			price: 5,
			quality:1,
			id : "114",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
			knownRound : -1,
			playedHands : [],
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (gI)=>{
				let tMult = 1;
				if( game.round != gI.ts.knownRound ){
					gI.ts.playedHands = [];
					gI.ts.knownRound = game.round;
				}
				if( gI.ts.playedHands.includes(gI.handType.hand) ) tMult = 3;
				

				gI.ts.playedHands.push(gI.handType.hand);

				let returningData = {currentMultiplier: gI.currentMultiplier * tMult}
				return returningData;
			},
		},
		rideTheBusJoker:{
			name : "Ride the Bus",
			description: "This Joker gains <mult>+1</mult> Mult per <u>consecutive</u> hand played without a scoring <u>face</u> card",
			price: 3,
			quality:0,
			id : "061",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
			growth : 0,
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (gI)=>{
				let search = false;
				gI.handType.scoringCards.forEach((card)=>{
					if(card.rank > 10) search = true;
				});
				if(!search){
					gI.ts.growth++;
				}else { gI.ts.growth = 0; }

				let returningData = {currentMultiplier: gI.currentMultiplier + gI.ts.growth}
				return returningData;
			},
		},
		constellationJoker:{
			name : "Constellation",
			description: "This Joker gains <mult>x0.1</mult> Mult every time a Planet card is ues",
			price: 6,
			quality:1,
			id : "107",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
			growth : 0,
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (gI)=>{
				gI.ts.growth = 1 + (0.1 * game.player.planetsUsed); 

				let returningData = {currentMultiplier: gI.currentMultiplier * gI.ts.growth}
				return returningData;
			},
		},
		glassJoker:{
			name : "Glass Joker",
			description: "This Joker gains <mult>x0.5</mult> Mult every time a Glass Card breaks.",
			price: 6,
			quality:1,
			id : "031",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
			growth : 0,
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (gI)=>{
				gI.ts.growth = 1 + (0.1 * game.player.glassCardsBroken); 

				let returningData = {currentMultiplier: gI.currentMultiplier * gI.ts.growth}
				return returningData;
			},
		},
		photographJoker:{
			name : "Photograph",
			description: "First played face card gives <mult>x2</mult> mult when scored",
			price: 5,
			quality:0,
			id : "130",
			hooks : [
				{
					in:"onScored", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				let search = -1;
				let tMult = 1;
				for (let index = 0; index < givenInformation.handType.scoringCards.length; index++) {
					const lcard = givenInformation.handType.scoringCards[index];
					if(lcard.rank > 10 && search == -1){
						search = index;
						if(givenInformation.card == lcard){
							tMult = 2;
						}
					}
				}
				let returningData = {currentMultiplier: givenInformation.currentMultiplier * tMult}
				return returningData
			},
		},
		riffRaffJoker:{
			name : "Riff Raff",
			description: "More options are shown in shop.",
			price: 3,
			quality:0,
			id : "119",
			hooks : [
				{
					in:"onBuy", 
					out:[""]
				},
				{
					in:"onSell",
					out:[""]
				}
			],
			elementId : "NoneYet",
          	//givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onBuy :  function(){
				game.player.topShelfMax++;
				game.player.bottomShelfMax++;

			},
			onSell : function(){
				game.player.topShelfMax--;
				game.player.bottomShelfMax--;

			}
		},
		jugglerJoker:{
			name : "Juggler",
			description: "+1 Hand Size",
			price: 5,
			quality:0,
			id : "010",
			hooks : [
				{
					in:"onBuy", 
					out:[""]
				},
				{
					in:"onSell",
					out:[""]
				}
			],
			elementId : "NoneYet",
          	//givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onBuy :  function(){
				game.player.handSize++;
			},
			onSell : function(){
				game.player.handSize--;
			}
		},
		drunkardJoker:{
			name : "Drunkard",
			description: "+1 Discard",
			price: 3,
			quality:0,
			id : "011",
			hooks : [
				{
					in:"onBuy", 
					out:[""]
				},
				{
					in:"onSell",
					out:[""]
				}
			],
			elementId : "NoneYet",
          	//givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onBuy :  function(){
				game.player.initialDiscards++;
				game.blind.discards++;
			},
			onSell : function(){
				game.player.initialDiscards--;
			}
		},
		certificateJoker:{
			name : "Certificate",
			description: "Add a random enhanced playing card to your hand at the start of each round",
			price: 6,
			quality:1,
			id : "088",
			hooks : [
				{
					in:"onRoundStart", 
					out:[""]
				},
				
			],
			elementId : "NoneYet",
          	//givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onRoundStart :  function(){
				try {
						let randomSuit = Math.floor(Math.random() * 4);
						let chosenSuit = "none";
						switch (randomSuit) {
							case 0:
								chosenSuit = 'h'
								break;
							case 1:
								chosenSuit = 's'
								break;
							case 2:
								chosenSuit = 'd'
								break;
							case 3:
								chosenSuit = 'c'
								break;
						}
			
						let card = new cards.Card(chosenSuit, Math.ceil(Math.random() * 13), '#card-table');
						let randomChoice = Math.ceil(Math.random() * 9)
						switch (randomChoice) {
							case 1:
								card.enhancement = RULEBOOK.enhancements.none;
								break;
							case 2:
								card.enhancement = RULEBOOK.enhancements.bonus;
								break;
							case 3:
								card.enhancement = RULEBOOK.enhancements.mult;
								break;
							case 4:
								card.enhancement = RULEBOOK.enhancements.mult;
								break;
							case 5:
								card.enhancement = RULEBOOK.enhancements.glass;
								break;
							case 6:
								card.enhancement = RULEBOOK.enhancements.glass;
								break;
							case 7:
								card.enhancement = RULEBOOK.enhancements.steel;
								break;
							case 8:
								card.enhancement = RULEBOOK.enhancements.gold;
								break;
							case 9:
								card.enhancement = RULEBOOK.enhancements.lucky;
								break;
						}
						cards.all.push(card);
						card.el.click((ev) => {
							if (card.container) {
								var handler = card.container._click;
								if (handler) {
									handler.func.call(handler.context || window, card, ev);
								}
							}
						});
						// alert(cards.mouseEvent)
						// deck.addCard(card);
						lowerhand.addCard(card);
						lowerhand.render();
				} catch (error) {
					alert(error)
				}
			}
		},
		ancientJoker:{
			name : "Ancient Joker",
			description: "<mult>x1.5</mult> Mult for each [###] card played. Suit changes every round.",
			Basicdescription: "<mult>x1.5</mult> Mult for each [###] card played. Suit changes every round.",
			price: 4,
			quality:1,
			id : "155",
			hooks : [
				{
					in:"onScored", 
					out:["currentMultiplier"]
				},
				{
					in:"onRoundStart", 
					out:[""]
				},
			],
			elementId : "NoneYet",
			chosenSuit : "",
	        onRoundStart : (ts)=>{
				try {
					// alert(JSON.stringify(ts))
					let suits = ["h","s","d","c"];
					let suitsNice = ["hearts","spades","diamonds","clubs"];
	
					let rng = Math.floor(Math.random() * suits.length)
					let m = suitsNice[rng];
					// alert(m)
					ts.chosenSuit = suits[rng];
					ts.description = ts.Basicdescription.replace("[###]", `<${m}>${m}</${m}>`)
					$(`#${ts.elementId} span`).html(ts.description);
					// alert("fin")

				} catch (error) {
					alert(error)
				}
			},
			 
			onScored : (gI)=>{
				let tMult = 1;
				if( gI.card.suit == gI.ts.chosenSuit ) tMult = 1.5;

				let returningData = {currentMultiplier: gI.currentMultiplier * tMult}
				return returningData;
			},
		},
		hitTheRoadJoker:{
			name : "Hit the Road",
			description: "This joker gains <mult>x0.5</mult> Mult for each jack discarded this round.",
			price: 4,
			quality:1,
			id : "058",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
				{
					in:"onRoundStart", 
					out:[""]
				},
				{
					in:"onDiscard", 
					out:[""]
				},
			],
			elementId : "NoneYet",
			growth : 0,
	        onRoundStart : (ts)=>{
				try {
					ts.growth = 0;
				} catch (error) {
					alert(error)
				}
			},
			onDiscard : (cards,ts)=>{
				cards.forEach(card => {
					if(card.rank == 11) ts.growth++;
				});
			},
			 
			onIndependent : (gI)=>{
				let tMult = 1 + (0.5 * gI.ts.growth);
				let returningData = {currentMultiplier: gI.currentMultiplier * tMult}
				return returningData;
			},
		},
		ramenJoker:{
			name : "Ramen",
			description: "<mult>x2</mult> Mult. <mult>-x0.01</mult> per card discarded.",
			price: 4,
			quality:0,
			id : "150",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
				{
					in:"onDiscard", 
					out:[""]
				},
			],
			elementId : "NoneYet",
			growth : 2,
			onDiscard : (cards,ts)=>{
				cards.forEach(card => {
					ts.growth-=0.01;
				});
			},
			 
			onIndependent : (gI)=>{
				let tMult = gI.ts.growth;
				let returningData = {currentMultiplier: gI.currentMultiplier * tMult}
				return returningData;
			},
		},
		popcornJoker:{
			name : "Popcorn",
			description: "+20 Mult. -4 Mult per round",
			price: 4,
			quality:0,
			id : "149",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
			growth : 25,
	        onRoundStart : (ts)=>{
				try {
					ts.growth -= 5;
				} catch (error) {
					alert(error)
				}
			},
			onIndependent : (gI)=>{
				let addMult = gI.ts.growth;
				let returningData = {currentMultiplier: gI.currentMultiplier + addMult}
				return returningData;
			},
		},
		walkieTalkieJoker:{
			name : "Walkie-Talkie",
			description: "Played <u>10s or 4s</u> give <chips>+10</chips> Chips and <mult>+4</mult> Mult when scored",
			price: 3,
			quality:0,
			id : "156",
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
				if(givenInformation.card.rank == 10 || givenInformation.card.rank == 4){
					acesCounted++
				}

				let returningData = {
					currentMultiplier: givenInformation.currentMultiplier + (acesCounted * 4),
					currentChips : givenInformation.currentChips + (acesCounted * 10)
				}
				return returningData;   
			},
		},
		squareJoker:{
			name : "Square Joker",
			description: "Played <u>9s or 4s</u> give <chips>x1.5</chips> chips when scored. If scoring cards's rank add up to a perfect square, or chips are a perfect square, <chips>x1.5</chips> Chips (stackable). <u>(By Martinez)</u>",
			price: 4,
			quality:1,
			id : "117",
			hooks : [
				{
					in:"onScored", 
					out:["currentChips"]
				},
				{
					in:"onIndependent", 
					out:["currentChips"]
				},
			],
			elementId : "NoneYet",
          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips} 
			onScored : (givenInformation)=>{
				let acesCounted = 1
				if(givenInformation.card.rank == 9 || givenInformation.card.rank == 4){
					acesCounted+=0.5;
				}

				let returningData = {
					currentChips : givenInformation.currentChips * (acesCounted)
				}
				return returningData;   
			},
			onIndependent : (gI)=>{
				let timesMult = 1;
				let rankAdd = 0;
				gI.handType.scoringCards.forEach(card => {
					rankAdd+=card.rank;
				});
				if((Math.sqrt(rankAdd) == Math.round(Math.sqrt(rankAdd)))){
					timesMult+=0.5;
				}
				if((Math.sqrt(gI.currentChips) == Math.round(Math.sqrt(gI.currentChips)))){
					timesMult+=0.5;
				}
				let returningData = {currentChips: gI.currentChips * timesMult}
				return returningData;
			},
		},
		fortuneTellerJoker:{
			name : "Fortune Teller",
			description: "<mult>+1</mult> Mult per tarot card used this run",
			price: 6,
			quality:1,
			id : "057",
			hooks : [
				{
					in:"onIndependent", 
					out:["currentMultiplier"]
				},
			],
			elementId : "NoneYet",
	          //givenInformation = {handType, gameObject, deck, stationaryHand, card (onScored), currentMultiplier, currentChips}  
			onIndependent : (gI)=>{
				let growth = game.player.tarotsUsed; 

				let returningData = {currentMultiplier: gI.currentMultiplier + growth}
				return returningData;
			},
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
	rngWeights : {
		booster : {
			key : [
				"standardNormal",
				"standardJumbo",
				"standardMega",

				"arcanaNormal",
				"arcanaJumbo",
				"arcanaMega",

				"celestialNormal",
				"celestialJumbo",
				"celestialMega",

				"buffoonNormal",
				"buffoonJumbo",
				"buffoonMega",

				// "SpectralNormal",
				// "spectralJumbo",
				// "spectralMega",
			],
			value : [
				4,
				2,
				0.5,

				4,
				2,
				0.5,

				4,
				2,
				0.5,

				1.2,
				0.6,
				0.15
			]
			// standard : {
			// 	normal: 4,
			// 	jumbo : 2,
			// 	mega  : 0.5,
			// },
			// arcana : this.standard,
			// celestial : this.standard,
			// buffoon : {
			// 	normal: 1.2,
			// 	jumbo : 0.6,
			// 	mega  : 0.15,
			// },
			// spectral : {
			// 	normal: 0.6,
			// 	jumbo : 0.3,
			// 	mega  : 0.07,
			// },
		}
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
			description : "Gives a free Mega Standard Pack",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{buyPack(RULEBOOK.boosters.standard[7]);},
		},
		charmTag : {
			name : "Charm Tag",
			description : "Gives a free Mega Arcana Pack",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{buyPack();},
		},
		meteorTag : {
			name : "Meteor Tag",
			description : "Gives a free Mega Celestial Pack",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{buyPack(RULEBOOK.boosters.celestial[7]);},
		},
		buffoonTag : {
			name : "Buffoon Tag",
			description : "Gives a free Mega Buffoon Pack",
			hookOnto : "onAcquire",
			onAcquire : (tagInformation)=>{buyPack(RULEBOOK.boosters.buffoon[3])},
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
			description : "+3 hand size next round",
			hookOnto : "onBlind",
			onBlind : (tagInformation)=>{
				game.player.tempHandSize += 3;
			},
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
			// theFool : {
			// 	name : "The Fool",
			// 	description : "Temporary",
			// 	id : "00",
			// 	selectionMaximum : -1,
			// 	use : (tarotInformation)=>{},
			// },
			theMagician : {
				name : "The Magician",
				description : "Enhances up to 2 cards into lucky cards.",
				id : "01",
				selectionMaximum : 2,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.enhancement = RULEBOOK.enhancements.lucky;
						card.showCard();
					});
				},
			},
			// theHighPriestess : {
			// 	name : "The High Priestess",
			// 	description : "Temporary",
			// 	id : "02",
			// 	selectionMaximum : -1,
			// 	use : (tarotInformation)=>{},
			// },
			theEmpress : {
				name : "The Empress",
				description : "Enhances up to 2 cards into Mult cards",
				id : "03",
				selectionMaximum : 2,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.enhancement = RULEBOOK.enhancements.mult;
						card.showCard();
					});
				},
			},
			// theEmperor : {
			// 	name : "The Emperor",
			// 	description : "Temporary",
			// 	id : "04",
			// 	selectionMaximum : -1,
			// 	use : (tarotInformation)=>{},
			// },
			theHierophant : {
				name : "The Hierophant",
				description : "Enhances up to 2 cards into Bonus cards.",
				id : "05",
				selectionMaximum : 2,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.enhancement = RULEBOOK.enhancements.bonus;
						card.showCard();
					});
				},
			},
			// theLovers : {
			// 	name : "The Lovers",
			// 	description : "Temporary",
			// 	id : "06",
			// 	selectionMaximum : 1,
			// 	use : (tarotInformation)=>{},
			// },
			theChariot : {
				name : "The Chariot",
				description : "Enhances 1 card into a Steel card",
				id : "07",
				selectionMaximum : 1,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.enhancement = RULEBOOK.enhancements.steel;
						card.showCard();
					});
				},
			},
			theJustice : {
				name : "Justice",
				description : "Enhances 1 card into glass",
				id : "08",
				selectionMaximum : 1,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.enhancement = RULEBOOK.enhancements.glass;
						card.showCard();
					});
				},
			},
			theHermit : {
				name : "The Hermit",
				description : "Doubles your money",
				id : "09",
				selectionMaximum : -1,
				use : (tarotInformation)=>{game.player.money *= 2;},
			},
			// theWheelOfFortune : {
			// 	name : "The Wheel Of Fortune",
			// 	description : "WHEEL OF FORTUNE!!",
			// 	id : "10",
			// 	selectionMaximum : -1,
			// 	use : (tarotInformation)=>{},
			// },
			theStrength : {
				name : "Strength",
				description : "Increases up to 2 card's rank.",
				id : "11",
				selectionMaximum : 2,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.rank++;
						if(card.rank == 14) card.rank = 1
						card.showCard();
					});
				},
			},
			// theHangedMan : {
			// 	name : "The Hanged Man",
			// 	description : "Temporary",
			// 	id : "12",
			// 	selectionMaximum : 2,
			// 	use : (tarotInformation)=>{

			// 	},
			// },
			// theDeath : {
			// 	name : "Death",
			// 	description : "Transforms your first selected card into your second selected card.",
			// 	id : "13",
			// 	selectionMaximum : 2,
			// 	use : (tarotInformation)=>{
			// 		tarotInformation.selected[0] = tarotInformation.selected[1];
			// 		tarotInformation.selected[0].showCard();
			// 	},
			// },
			// theTemperance : {
			// 	name : "Temperance",
			// 	description : "Temporary",
			// 	id : "14",
			// 	selectionMaximum : -1,
			// 	use : (tarotInformation)=>{},
			// },
			theDevil : {
				name : "The Devil",
				description : "Enhances 1 card into Gold",
				id : "15",
				selectionMaximum : 1,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.enhancement = RULEBOOK.enhancements.gold;
						card.showCard();
					});
				},
			},
			// theTower : {
			// 	name : "The Tower",
			// 	description : "Temporary",
			// 	id : "16",
			// 	selectionMaximum : 1,
			// 	use : (tarotInformation)=>{},
			// },
			theStar : {
				name : "The Star",
				description : "Changes up to 3 card's suit into diamonds",
				id : "17",
				selectionMaximum : 3,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.suit = "d";
						card.showCard();
					});
				},
			},
			theMoon : {
				name : "The Moon",
				description : "Changes up to 3 card's suit into clubs",
				id : "18",
				selectionMaximum : 3,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.suit = "c";
						card.showCard();
					});
				},
			},
			theSun : {
				name : "The Sun",
				description : "Changes up to 3 card's suit into hearts",
				id : "19",
				selectionMaximum : 3,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.suit = "h";
						card.showCard();
					});
				},
			},
			// theJudgement : {
			// 	name : "Judgement",
			// 	description : "Temporary",
			// 	id : "20",
			// 	selectionMaximum : -1,
			// 	use : (tarotInformation)=>{},
			// },
			theWorld : {
				name : "The World",
				description : "Changes up to 3 card's suit into spades",
				id : "21",
				selectionMaximum : 3,
				use : (tarotInformation)=>{
					tarotInformation.selected.forEach(card => {
						card.suit = "s";
						card.showCard();
					});
				},
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