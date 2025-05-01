// Enable or disable immediate mode for rendering
const immediateMode = false;
const info = document.getElementById("Info");
const storeTopShelf = document.getElementById("upper-shelf");
const storeBottomShelf = document.getElementById("lower-shelf");

const showFullyCalculatedHand = false;
const alwaysShowShop = false;
const deckURL = localStorage.getItem('deckURL') || "img/BalatroCards_Free.png";
var countingScore = false;
var dealing = false;
var sv_cheats = 0;
if(sv_cheats == 1) {$("#peppino").show()};
var playSounds = true;

var pixelSize = 920.0;
var backgroundColors = [
	[0.171, 0.367, 0.131],
	[0.0, 0.42, 0.26],
	[0.086, 0.137, 0.045],
];
backgroundColors = RULEBOOK.blinds.small.colors;


// Game state and configuration
const game = {
	gamestate: "None",
	inShop: false,
	alive: true,
	round: 0,
	ante: 0,
	level: 0,
	blind: {
		minimum: 300,
		currentScore: 0,
		hands: 4,
		discards: 4,
		payout: 3,
		name: "Small Blind",
		inPlay: false,
		color: "#50846e",

	},
	anteBlinds: [],
	player: {
		initialHands: 4,
		initialDiscards: 4,
		_handSize: 8,
		get handSize() {
			return this._handSize + this.tempHandSize - (game.blind.name == "The Manacle" ? 1 : 0);
		},
		set handSize(val) {
			this._handSize = val;
		},
		tempHandSize: 0,
		money: 4,
		topShelfMax: 2,
		bottomShelfMax: 2,
		jokers: [],
		tags: [],
		timesPokerHandPlayed: {
			"Full House": 0
		},
		jokersMaximum: 5,
		addJoker: function (joker) {
			if (this.jokers.length < this.jokersMaximum || joker.edition == RULEBOOK.editions.negative) {

				if (joker.edition == RULEBOOK.editions.negative) game.player.jokersMaximum++;

				// Create the new joker span element

				const jokerEl = document.createElement('span');
				jokerEl.classList.add('joker', 'in-play');
				jokerEl.id = joker.id + Date.now();
				jokerEl.title = joker.name;
				joker.elementId = jokerEl.id;

				// Create the img element for the joker image
				const jokerImg = document.createElement('img');
				jokerImg.src = `img/Jokers/joker_${joker.id}.png`;
				jokerEl.appendChild(jokerImg);
				jokerEl.classList.add(joker.edition);
				jokerEl.onmousemove = hoverCard;
				jokerEl.onmouseout = noHoverCard;

				// Create the tooltip span
				const tooltipText = document.createElement('span');
				tooltipText.classList.add('tooltiptext');
				tooltipText.innerHTML = `${joker.description} <br> [Selling for $${Math.ceil(joker.price / 2)}]`;
				jokerEl.appendChild(tooltipText);

				// Attach the click event listener
				jokerEl.addEventListener('click', () => {
					jokerClick(`${joker.elementId}`, joker);
				});

				// Append the new joker element to the container
				document.getElementById('jokers').appendChild(jokerEl);

				// Add the joker to the player's collection
				this.jokers.push(joker);
			} else {
				alert("No space to add joker! Current maximum is: " + this.jokersMaximum);
			}
		}
	}
};

// Initialize card library
cards.init({ table: '#card-table', cardsUrl: deckURL, type: STANDARD, cardback: "blue", RULEBOOK: RULEBOOK, acesHigh: true, immediateMode: immediateMode });

// Create deck and adjust position
const deck = new cards.Deck();
deck.x += 260;
// deck.y += 140;

deck.addCards(cards.all);
deck.render({ immediate: true });

// Create player hands and discard pile
const upperhand = new cards.Hand({ faceUp: true, y: 0 });
const lowerhand = new cards.Hand({ faceUp: true, y: 250 });
var packHand = new cards.Hand({ faceUp: true, y: 250 });
const discardPile = new cards.Deck({ faceUp: true });
discardPile.x += 360;

$('#deal').hide();
let jokerKeys = Object.keys(RULEBOOK.jokers);
let bosses = RULEBOOK.blinds.boss.length;
document.querySelector("footer").innerHTML += `  | AutoUpdate info: [ ${jokerKeys.length}/150 jokers (<u> ${100 * (jokerKeys.length / 150)}% </u>) | ${bosses}/30 blinds (<u> ${100 * (bosses / 30)}% </u>) ]`


if (!alwaysShowShop) {
	document.getElementById('store-box').hidden = true;
}
// Start a blind
function startBlind() {
	$('#blindName').text(game.blind.name)
	splitElement("#blindName");

	game.player.tempHandSize = 0;

	game.player.tags.slice().reverse().forEach(tag => {
		if (tag.hookOnto == "onBlind") {
			tag.onBlind({});
			game.player.tags.splice(game.player.tags.findIndex((t) => { return t == tag }), 1);

		}
	});

	cards.shuffle(deck);

	let timing = 100;
	// if(game.round == 0) timing = 0;

	$(":root").css({ "--dyn-ui-blind": game.blind.color ? game.blind.color : "#FE5F55" });
	$(":root").css({ "--dyn-ui-blind-dark": game.blind.color ? pSBC(-0.5, game.blind.color) : "#ec1d0e" });

	$("#blind-selection").animate({ bottom: "-50vh" }, timing, "swing", () => {

		if (!alwaysShowShop) {
			$('#store-box').hide()
		}
		$('#game-box').show();
		$('#card-table').show();
		$("#ante-box").hide();

		$('#discard').show();
		$("#controls").show();
		game.inShop = false;

		deck.deal(Math.max(0, game.player.handSize - lowerhand.length), [lowerhand], 100, () => {
			game.blind.inPlay = true;
			document.getElementById("play").innerText = "Play";
			setupShop();
			sortHand();
			if (game.blind.description) {
				alert(game.blind.description);
			}
			cards.all.forEach(card => {
				doesntViolateBlind(card);
			});
		}, game.blind);


	});
}

function showShop() {
	if (!alwaysShowShop) {
		$('#card-table').hide();
		$('#store-box').show();
	}
	game.inShop = true;
	$(":root").css({ "--dyn-ui-blind": "#D8D8D8" });
	$(":root").css({ "--dyn-ui-blind-dark": "#4F6367" });
	$('#discard').hide();
}

function jokerClick(id, joker) {
	try {
		// alert(id)
		let jokerEl = document.getElementById(id);
		if (confirm(`Are you sure you wish to sell ${joker.name} for $${Math.ceil(joker.price / 2)}?`)) {
			game.player.jokers.splice(game.player.jokers.findIndex((ea) => { return ea == joker }), 1);
			jokerEl.outerHTML = '';
			game.player.money += Math.ceil(joker.price / 2);
			if (joker.edition == RULEBOOK.editions.negative) game.player.jokersMaximum--;
		}
	} catch (err) {
		alert(err)
	}
}

// Move to next blind
function nextBlind() {
	game.level = (game.level === 2) ? 0 : game.level + 1;
	if (game.level === 0) {
		game.ante++;
		setupBlindSelection();
	}
	if (game.ante === 8) alert("-=YOU WON!=-")
	game.round++;
	selectBlind();
	// game.inShop = true;
}

function showAnte() {
	$('#store-box').hide()
	$('#controls').hide()
	$('#ante-box').show()
	$("#blind-selection").animate({ bottom: "0" }, 100);
	updateBlindSelection();
}

function selectBlind() {
	game.blind = game.anteBlinds[game.level];
	Object.assign(game.blind, {
		hands: game.player.initialHands,
		discards: game.player.initialDiscards,
		currentScore: 0,
		inPlay: false
	});
	$('#blindName').text(game.blind.name);
	backgroundColors = game.blind.colors;
}

function setupBlindSelection() {
	for (let index = 0; index < 3; index++) {
		game.anteBlinds[index] = RULEBOOK.buildBlind(game.level + index, game.ante);
		$(`#blind-${index} h3 m`).text(game.anteBlinds[index].minimum);
		$(`#blind-${index} [skip]`).text(`Skip for ${game.anteBlinds[index].tag.name}`);
		$(`#blind-${index} [skip]`).prop("title", `${game.anteBlinds[index].tag.description}`);
		if (index == 2) { $(`#blind-2 h2`).text(game.anteBlinds[2].name) };
	}
	updateBlindSelection();
}

function updateBlindSelection() {
	for (let index = 0; index < 3; index++) {
		$(`#blind-${index} button`).prop("disabled", index != game.level)
	}
}

$("[enter]").on("click", () => { startBlind() });
$("[skip]").on("click", () => {
	if (game.anteBlinds[game.level].tag.hookOnto == "onAcquire") {
		game.anteBlinds[game.level].tag.onAcquire({});
	} else {
		game.player.tags.push(game.anteBlinds[game.level].tag);
	}
	nextBlind();
	updateBlindSelection();
})
setupBlindSelection();
updateBlindSelection();

var rerollIncrease = 0;
function setupShop() {
	rerollIncrease = 0;
	fillShopUpperDeck()
	fillShopLowerDeck()
}

function fillShopUpperDeck() {
	storeTopShelf.innerHTML = "";

	$("#reroll").text(`Reroll ($${rerollIncrease + 5})`);

	//Top Shelf
	let topShelfChoices = [];
	topShelfChoices = topShelfChoices.concat(Object.keys(RULEBOOK.jokers));

	game.player.jokers.forEach(joker => {
		topShelfChoices.splice(topShelfChoices.findIndex((ea) => { return RULEBOOK.jokers[ea].name == joker.name }), 1);
	});

	for (let index = 0; index < game.player.topShelfMax; index++) {

		//Random
		let randomChoiceID = Math.floor(Math.random() * topShelfChoices.length)
		let randomChoice = topShelfChoices[randomChoiceID];
		let uid = Math.floor(Math.random() * 10000);

		topShelfChoices.splice(randomChoiceID, 1);


		let editions = [RULEBOOK.editions.foil, RULEBOOK.editions.polychrome, RULEBOOK.editions.holographic, RULEBOOK.editions.negative];
		let edition = Math.random() < 0.2 ? editions[Math.floor(Math.random() * editions.length)] : RULEBOOK.editions.base;
		//edition = RULEBOOK.editions.polychrome;


		//Deep copy the joker.
		let merchandiseObject = JSON.parse(JSON.stringify(RULEBOOK.jokers[randomChoice]));
		merchandiseObject.hooks.forEach(hook => {
			//Stringify removes methods, this adds them back
			merchandiseObject[hook.in] = RULEBOOK.jokers[randomChoice][hook.in];
		});
		merchandiseObject.edition = edition;


		//Price
		let modifiedPrice = RULEBOOK.jokers[randomChoice].price;
		if (edition != RULEBOOK.editions.base) {
			modifiedPrice += 3;
			merchandiseObject.description += `<br> Edition: <u>${edition}</u>`;
		}
		merchandiseObject.price = modifiedPrice;

		//.html(`<button class="joker in-shop" title="${RULEBOOK.jokers[randomChoice].name}" onclick="buy('${randomChoice}','store${uid}')" id="store${uid}"><span class="price">$${RULEBOOK.jokers[randomChoice].price}</span><img style="animation-delay: ${Math.random()*3}ms;animation-direction: ${Math.random()>0.50?"alternate-reverse":"alternate"};" src='img/Jokers/joker_${RULEBOOK.jokers[randomChoice].id}.png'><span class="tooltiptext">${RULEBOOK.jokers[randomChoice].description}</span></button>`);
		let newShopItem = $("<button></button>");
		newShopItem.addClass("joker in-shop");
		newShopItem.prop("title", RULEBOOK.jokers[randomChoice].name);
		newShopItem.prop("id", `store${uid}`);
		newShopItem.click(() => {
			buy(merchandiseObject, uid);

		});

		//<span class="price">$${RULEBOOK.jokers[randomChoice].price}</span>
		let price = $("<span></span>");
		price.addClass("price");
		price.text("$" + modifiedPrice);
		newShopItem.append(price);

		let jokerImage = $('<img>');
		jokerImage.css({ animationDelay: Math.random() * 3 + "ms", animationDirection: Math.random() > 0.5 ? "alternate-reverse" : "alternate" });
		jokerImage.prop("src", `img/Jokers/joker_${RULEBOOK.jokers[randomChoice].id}.png`);
		newShopItem.addClass(edition);
		newShopItem.append(jokerImage);

		//<span class="tooltiptext">${RULEBOOK.jokers[randomChoice].description}</span>
		let tooltip = $("<span></span>");
		tooltip.addClass("tooltiptext");
		tooltip.html(merchandiseObject.description);
		newShopItem.append(tooltip);

		$(storeTopShelf).append(newShopItem);
	}
}
function fillShopLowerDeck() {
	try {
		storeBottomShelf.innerHTML = "";
		for (let index = 0; index < game.player.bottomShelfMax; index++) {

			let packOptions = ["standard", "celestial", "arcana", "buffoon", "arcana"];
			let packType = packOptions[Math.floor(Math.random() * packOptions.length)];

			let bottomShelfChoices = RULEBOOK.boosters[packType];

			let randomChoiceID = Math.ceil(Math.random() * (bottomShelfChoices.length - 1))
			let randomChoice = bottomShelfChoices[randomChoiceID];
			let uid = Math.floor(Math.random() * 10000);

			let price = 4;
			if (randomChoice.options > 3) {
				price = 6;
			}
			if (randomChoice.pick == 2) {
				price = 8;
			}


			//.html(`<button class="joker in-shop" title="${RULEBOOK.jokers[randomChoice].name}" onclick="buy('${randomChoice}','store${uid}')" id="store${uid}"><span class="price">$${RULEBOOK.jokers[randomChoice].price}</span><img style="animation-delay: ${Math.random()*3}ms;animation-direction: ${Math.random()>0.50?"alternate-reverse":"alternate"};" src='img/Jokers/joker_${RULEBOOK.jokers[randomChoice].id}.png'><span class="tooltiptext">${RULEBOOK.jokers[randomChoice].description}</span></button>`);
			let newShopItem = $("<button></button>");
			newShopItem.addClass("joker in-shop");
			newShopItem.prop("title", randomChoice.type);
			newShopItem.prop("id", `store${uid}`);
			newShopItem.click(() => {
				buyPack(randomChoice, uid, price)
			});

			//<span class="price">$${RULEBOOK.jokers[randomChoice].price}</span>
			let aprice = $("<span></span>");
			aprice.addClass("price");
			aprice.text("$" + price);
			newShopItem.append(aprice);

			let jokerImage = $('<img>');
			jokerImage.css({ animationDelay: Math.random() * 3 + "ms", animationDirection: Math.random() > 0.5 ? "alternate-reverse" : "alternate" });
			jokerImage.prop("src", `img/Packs/pack_${randomChoice.id}.png`);
			newShopItem.append(jokerImage);

			//<span class="tooltiptext">${RULEBOOK.jokers[randomChoice].description}</span>
			let tooltip = $("<span></span>");
			tooltip.addClass("tooltiptext");
			tooltip.html(`Choose ${randomChoice.pick} of ${randomChoice.options} ${randomChoice.type} cards.`);
			newShopItem.append(tooltip);

			$(storeBottomShelf).append(newShopItem);
		}
	} catch (error) {
		alert(error)
	}
}

$("#reroll").click(() => {
	if (game.player.money < (rerollIncrease + 5)) {
		alert("Not enough money!");
		return;
	}
	if (playSounds) {
		new Audio('snd/coin1.ogg').play();
	}
	game.player.money -= rerollIncrease + 5;

	rerollIncrease += 1;
	fillShopUpperDeck();
});

$('[dismiss]').on("click", function () {
	try {
		document.getElementById($(this).attr('dismiss')).close();
		if (game.gamestate == "Arcana") {
			for (let index = packHand.length - 1; index >= 0; index--) {
				const card = packHand[index];
				$(card.el).appendTo("#card-table");
				$(card.el).removeClass("selected");
				deck.addCard(card);
			}

			cards.all.forEach(card => {
				$(card.el).appendTo("#card-table");
			});
			deck.render();
		}

		game.gamestate = "None";
	} catch (error) {
		alert(error)
	}

})

function buy(merchandiseObject, uid) {
	if (game.player.money >= merchandiseObject.price) {
		if (game.player.jokers.length < game.player.jokersMaximum || merchandiseObject.edition == RULEBOOK.editions.negative) {

			if (playSounds) { new Audio('snd/coin1.ogg').play(); }
			game.player.money -= merchandiseObject.price;
			game.player.addJoker(merchandiseObject);

			document.getElementById(`store` + uid).innerHTML = "SOLD OUT!";
			document.getElementById(`store` + uid).disabled = true;
			$(`#store${uid}`).removeClass("Polychrome Foil Negative Holographic");
		} else {
			alert("No space to add joker! Current maximum is: " + game.player.jokersMaximum);
		}
	} else {
		alert("Not enough money!");
	}
}

function buyPack(pack = RULEBOOK.boosters.arcana[6], uid = 0, price = 0) {
	if (uid && price) {
		if (game.player.money >= price) {
			if (playSounds) { new Audio('snd/coin1.ogg').play(); }
			game.player.money -= price;
			document.getElementById(`store` + uid).innerHTML = "SOLD OUT!";
			document.getElementById(`store` + uid).disabled = true;
		} else { return; }
	}

	//Clear booster pack window from previous packs
	packHand.forEach(card => {
		card.destroy();
	});
	packHand = new cards.Hand({ faceUp: true, y: 300 });
	cards.shuffle(deck);

	$("#boosterPackText").text(`Choose ${pack.pick}`);
	$("#boosterPack").html(" ");


	$("#boosterPackWindow").removeClass();
	if (packShader) $("#boosterPackWindow").addClass(pack.type);

	//Pack window

	boosterPackWindow.showModal();
	try {
		switch (pack.type) {
			case "Standard":
				_TEMP_incantation(pack.pick, pack.options)
				break;
			case "Celestial":
				celestialPack(pack);
				break;
			case "Arcana":
				arcanaPack(pack)
				break;
			case "Buffoon":
				buffoonPack(pack);
				break;
			case "Spectral":
				break;
		}
	} catch (error) {
		alert(error)
	}
}

function _TEMP_incantation(maxTake = 1, choices = 5) {
	try {
		packHand.click(card => {
			$(card.el).appendTo("#card-table");
			cards.all.push(card);
			// alert(`${card} added!`)
			transferCard(card, packHand, deck);
			maxTake--;
			$("#boosterPackText").text(`Choose ${maxTake}`);
			if (maxTake == 0) {
				document.getElementById("boosterPackWindow").close()
			}
		});


		for (let index = 0; index < choices; index++) {
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

			let card = new cards.Card(chosenSuit, Math.ceil(Math.random() * 13), '#boosterPack');
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
				case 5:
					card.enhancement = RULEBOOK.enhancements.glass;
					break;
				case 6:
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
			// cards.all.push(card);
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
			packHand.addCard(card);
			packHand.render({ immediate: true });
			// cards.shuffle(deck);
			// deck.render({immediate:true});

		}
	} catch (error) {
		alert(error)
	}
}

function arcanaPack(pack) {
	let tarots = Object.keys(RULEBOOK.consumables.tarot);
	let maxTake = pack.pick;
	let selectedCards = [];

	game.gamestate = "Arcana";

	packHand.click(card => {
		if (selectedCards.indexOf(card) != -1) {
			selectedCards.splice(selectedCards.indexOf(card), 1);
		} else if (selectedCards.length < 5) {
			selectedCards.push(card);
		}

		packHand.forEach((carder) => {
			$(carder.el).removeClass("selected");
			if (selectedCards.indexOf(carder) != -1) {
				$(carder.el).addClass("selected");
			}
		});
	});

	deck.deal(game.player.handSize, [packHand], 100, () => {
		packHand.forEach((card) => {
			$(card.el).appendTo("#boosterPackWindow");
		});
	}, undefined, (cardr) => { $(cardr.el).appendTo("#boosterPackWindow"); });

	for (let index = 0; index < pack.options; index++) {
		let rng = Math.floor(Math.random() * tarots.length);
		// alert( tarots[ rng ]);
		let chosenTarot = RULEBOOK.consumables.tarot[tarots[rng]];
		tarots.splice(rng, 1);

		let newPlanetElement = $("<button></button>");
		newPlanetElement.addClass("joker in-shop");
		newPlanetElement.prop("title", chosenTarot.name);
		newPlanetElement.click(() => {

			if (chosenTarot.selectionMaximum == -1 || (chosenTarot.selectionMaximum >= selectedCards.length && selectedCards.length != 0)) {
				let tarotInformation = { selected: selectedCards, packHand: packHand };
				chosenTarot.use(tarotInformation);

				selectedCards.forEach(cardil => {
					$(cardil.el).removeClass("selected");
				})
				selectedCards = [];

				newPlanetElement.hide();
				maxTake--;
				$("#boosterPackText").text(`Choose ${maxTake}`);
				if (maxTake == 0) {
					$('[dismiss]').click()
				}
			}
		});

		let jokerImage = $('<img>');
		jokerImage.css({ animationDelay: Math.random() * 3 + "ms", animationDirection: Math.random() > 0.5 ? "alternate-reverse" : "alternate" });
		jokerImage.prop("src", `img/Usables/usable_${chosenTarot.id}.png`);
		newPlanetElement.append(jokerImage);

		//<span class="tooltiptext">${RULEBOOK.jokers[randomChoice].description}</span>
		let tooltip = $("<span></span>");
		tooltip.addClass("tooltiptext");
		tooltip.html(chosenTarot.description);
		newPlanetElement.append(tooltip);

		$("#boosterPack").append(newPlanetElement);
	}
}

function celestialPack(pack) {
	let planets = Object.keys(RULEBOOK.basePokerHands);
	let maxTake = pack.pick;

	for (let index = 0; index < pack.options; index++) {
		let rng = Math.floor(Math.random() * planets.length);
		let chosenPlanet = planets[rng];
		let randomPlanet = RULEBOOK.basePokerHands[chosenPlanet];
		planets.splice(rng, 1);

		let newPlanetElement = $("<button></button>");
		newPlanetElement.addClass("joker in-shop");
		newPlanetElement.prop("title", chosenPlanet);
		newPlanetElement.click(() => {
			upgradePokerHand(chosenPlanet);
			newPlanetElement.hide();
			maxTake--;
			$("#boosterPackText").text(`Choose ${maxTake}`);
			if (maxTake == 0) {
				document.getElementById("boosterPackWindow").close()
			}
		});

		let jokerImage = $('<img>');
		jokerImage.css({ animationDelay: Math.random() * 3 + "ms", animationDirection: Math.random() > 0.5 ? "alternate-reverse" : "alternate" });
		jokerImage.prop("src", `img/Usables/usable_${randomPlanet.id}.png`);
		newPlanetElement.append(jokerImage);

		//<span class="tooltiptext">${RULEBOOK.jokers[randomChoice].description}</span>
		let tooltip = $("<span></span>");
		tooltip.addClass("tooltiptext");
		tooltip.html(`Upgrade <u>${chosenPlanet}</u> to level ${randomPlanet.level + 1}:</br> <chips> + ${randomPlanet.upgrade[0]} </chips> x <mult> + ${randomPlanet.upgrade[1]} </mult>`);
		newPlanetElement.append(tooltip);

		$("#boosterPack").append(newPlanetElement);
	}
}

function buffoonPack(pack) {
	let maxTake = pack.pick;

	let jokerChoices = [];
	jokerChoices = jokerChoices.concat(Object.keys(RULEBOOK.jokers));

	game.player.jokers.forEach(joker => {
		jokerChoices.splice(jokerChoices.findIndex((ea) => { return RULEBOOK.jokers[ea].name == joker.name }), 1);
	});

	for (let index = 0; index < pack.options; index++) {
		let rng = Math.floor(Math.random() * jokerChoices.length);
		let chosenPlanet = jokerChoices[rng];
		let randomPlanet = RULEBOOK.jokers[chosenPlanet];
		jokerChoices.splice(rng, 1);

		let newPlanetElement = $("<button></button>");
		newPlanetElement.addClass("joker in-shop");
		newPlanetElement.prop("title", chosenPlanet);
		newPlanetElement.click(() => {
			game.player.addJoker(randomPlanet);
			newPlanetElement.hide();
			maxTake--;
			$("#boosterPackText").text(`Choose ${maxTake}`);
			if (maxTake == 0) {
				document.getElementById("boosterPackWindow").close();
			}
		});

		let jokerImage = $('<img>');
		jokerImage.css({ animationDelay: Math.random() * 3 + "ms", animationDirection: Math.random() > 0.5 ? "alternate-reverse" : "alternate" });
		jokerImage.prop("src", `img/Jokers/joker_${randomPlanet.id}.png`);
		newPlanetElement.append(jokerImage);

		//<span class="tooltiptext">${RULEBOOK.jokers[randomChoice].description}</span>
		let tooltip = $("<span></span>");
		tooltip.addClass("tooltiptext");
		tooltip.html(randomPlanet.description);
		newPlanetElement.append(tooltip);

		$("#boosterPack").append(newPlanetElement);
	}
}


function upgradePokerHand(hand, times = 1) {
	// saidHand = RULEBOOK.basePokerHands[hand];
	// saidHand.level += times;
	// saidHand.chips += (times * saidHand.upgrade[0]);
	// saidHand.mult += (times * saidHand.upgrade[1]);
	// alert(`Upgraded ${hand}!`)
	RULEBOOK.upgradePokerHand(hand, times);
}


// Handle card movement between hands
upperhand.click(card => transferCard(card, upperhand, lowerhand));
lowerhand.click(card => {
	if (upperhand.length < 5) transferCard(card, lowerhand, upperhand);
});

function transferCard(card, fromHand, toHand) {
	if (countingScore) { return; }
	toHand.addCard(card);
	// card.destroy();
	fromHand.render({ immediate: true });
	toHand.render({ immediate: true });
	if (fromHand == lowerhand) {
		if (playSounds) { new Audio('snd/cardSlide1.ogg').play(); }
	} else {
		if (playSounds) { new Audio('snd/cardSlide2.ogg').play(); }
	}
}

// Keybindings for gameplay actions
document.addEventListener("keydown", ev => {
	const keyActions = {
		'a': () => $("#play").click(),
		'd': () => $('#discard').click(),
		'z': () => alert(detectPokerHand(upperhand)),
		'Enter': () => $("#play").click(),
		'Backspace': () => deselectCardByPlacement(0),
		'k': sortHand,
		't': () => { if (sv_cheats) { winBlind(); } },
		'y': () => { if (sv_cheats) { game.blind.minimum = 1; } },
		'u': () => { if (sv_cheats) { game.player.money += 999; } },
		'i': () => { if (sv_cheats) { game.player.addJoker(RULEBOOK.jokers[prompt("joker property")]) } },
		'o': () => { if (sv_cheats) { game.blind.hands += 10; game.blind.discards += 10; } },
		'p': () => { if (sv_cheats) { buyPack() } },
	};
	if (keyActions[ev.key]) keyActions[ev.key]();
	if (ev.ctrlKey) ev.preventDefault();
	if (!isNaN(ev.key)) ev.ctrlKey ? deselectCardByPlacement(ev.key - 1) : selectCardByPlacement(ev.key - 1);
});

// Card selection/deselection functions
function selectCardByPlacement(id) {
	if (upperhand.length < 5) transferCard(lowerhand[id], lowerhand, upperhand);
}

function deselectCardByPlacement(id) {
	transferCard(upperhand[id], upperhand, lowerhand);
}

function sortHand(instant = false) {
	lowerhand.sort((a, b) => b.rank - a.rank); lowerhand.render({ immediate: instant })
}


// Button click events
$('#play').click(() => { if (!countingScore) { game.blind.inPlay ? Playhand() : showAnte() } });
$('#discard').click(() => {
	if (game.blind.discards <= 0) return alert("You don't have any discards left!");
	discardSelected();
	game.blind.discards--;
});
$("button:not(.card,.joker,#controls *,#closingPop)").on("click", () => {
	if (playSounds) { new Audio("snd/button.ogg").play(); }
});

function countCards(countFrom, stringOfContainer) {
	let outputtingString = `${stringOfContainer}: \n`;
	outputtingString += "♥: " + countFrom.filter((card) => { return card.suit == "h" }).toSorted((a, b) => b.rank - a.rank).join(', ').replaceAll("H", "") + "\n";
	outputtingString += "♣: " + countFrom.filter((card) => { return card.suit == "c" }).toSorted((a, b) => b.rank - a.rank).join(', ').replaceAll("C", "") + "\n";
	outputtingString += "♦:  " + countFrom.filter((card) => { return card.suit == "d" }).toSorted((a, b) => b.rank - a.rank).join(', ').replaceAll("D", "") + "\n";
	outputtingString += "♠:  " + countFrom.filter((card) => { return card.suit == "s" }).toSorted((a, b) => b.rank - a.rank).join(', ').replaceAll("S", "") + "\n";
	outputtingString = outputtingString.replaceAll("11", "J")
	outputtingString = outputtingString.replaceAll("12", "Q")
	outputtingString = outputtingString.replaceAll("13", "K")
	outputtingString = outputtingString.replaceAll("1\n", "A\n")
	outputtingString = outputtingString.replaceAll("1,", "A,")
	return outputtingString;
}

$("#deck-count").click(() => {
	alert(countCards(cards.all, "All cards in play"));
});
deck.click(() => {
	alert(countCards(deck, "All cards left in deck"));
});

// Gameplay mechanics
async function Playhand() {
	if (upperhand.length === 0) return;

	let handType = detectPokerHand(upperhand);
	game.blind.hands--;
	game.blind.currentScore += await calculateScore(handType, true);
	// upgradePokerHand(handType.hand)

	if (isNaN(game.player.timesPokerHandPlayed[handType.hand])) {
		game.player.timesPokerHandPlayed[handType.hand] = 1;
	} else {
		game.player.timesPokerHandPlayed[handType.hand] += 1;
	}

	if (game.blind.hooks) {
		if (game.blind.hooks.includes('afterPlayHook')) {
			countingScore = true;
			game.blind.afterPlayHook();
			await delay(300);
			countingScore = false;
		}
	}


	if (!(game.blind.currentScore >= game.blind.minimum)) {
		discardSelected();
	}

	if (game.blind.currentScore >= game.blind.minimum) {
		winBlind();
	} else if (game.blind.hands == 0) {
		game.alive = false;
		// info.innerHTML  = `<h1>You failed!</h1> No hands left. Score: ${game.blind.currentScore} / ${game.blind.minimum} <br> <button href="javascript();" onclick="location.reload()">Play again?</button>`
		document.querySelector("h1").innerHTML = `You failed! <button href="javascript();" onclick="location.reload()">Play again?</button>`;
		document.querySelector("h1").hidden = false
		// splitElement("h1");
		$('#game-box').hide()
		$('#controls').hide()

	}
}

function winBlind() {
	let newMoney = game.blind.payout
	lowerhand.forEach(card => {
		if (card.enhancement == RULEBOOK.enhancements.gold) {
			game.player.money += 3;
		}
	});
	newMoney += game.blind.hands;
	game.player.money += newMoney;
	//alert(`${game.blind.name} won! ${newMoney} dollars awarded. Finishing score: ${game.blind.currentScore} / ${game.blind.minimum}`)
	$('#controls').hide();


	let firstLine = `${game.blind.name}: Scored atleast ${game.blind.minimum.toLocaleString()} <right>${dollarify(game.blind.payout)}</right>`;
	let secondLine = `${game.blind.hands} Remaining Hands ($1 each) <right>${dollarify(game.blind.hands)}</right>`
	$('#popoverText').html(
		`${firstLine} <br> ${secondLine} <br> <money>${newMoney} dollars awarded.</money>`
	);

	deck.addCards(cards.all);
	deck.render({
		callback: () => {
			document.getElementById("mydiv").showModal();
			$('#mydiv').css({ top: "1000px", opacity: 0 });
			$('#mydiv').animate({ top: "0px", opacity: 1 }, 250)
		}
	});
	document.getElementById("play").innerText = "Next";
}

$('#closingPop').click(() => {
	if (playSounds) { new Audio('snd/coin1.ogg').play(); }
	$('#mydiv').animate({ top: "1000px", opacity: 0 }, 250, "swing", () => {
		nextBlind();
		showShop();

		$('#controls').show();
		document.getElementById("mydiv").close()
		$("#store-box").css({ opacity: 0 });
		$("#store-box").animate({ opacity: 1 }, 250);

	});

});

function dollarify(number) {
	let progressString = "";
	for (let index = 0; index < number; index++) {
		progressString += "$"
	}
	return progressString;
}







//  SETTINGS

$("#noCRT").prop('checked', eval(localStorage.getItem("#noCRT")));
$("#noCRT").on("change", () => {
	localStorage.setItem("#noCRT", $("#noCRT").prop('checked'));
	if ($("#noCRT").prop('checked')) {
		$(".crt").hide();
	} else {
		$(".crt").show();
	}
}).trigger("change");

$("#noBackground").prop('checked', eval(localStorage.getItem("#noBackground")));
$("#noBackground").on("change", () => {
	localStorage.setItem("#noBackground", $("#noBackground").prop('checked'));
	if ($("#noBackground").prop('checked')) {
		$("#glCanvas").hide();
	} else {
		$("#glCanvas").show();
	}
}).trigger("change");


$("#noFooter").prop('checked', eval(localStorage.getItem("#noFooter")));
$("#noFooter").on("change", () => {
	localStorage.setItem("#noFooter", $("#noFooter").prop('checked'));
	if ($("#noFooter").prop('checked')) {
		$("footer, [href='https://www.playbalatro.com']").hide();
	} else {
		$("footer, [href='https://www.playbalatro.com']").show();
	}
}).trigger("change");


$("#noBuldge").prop('checked', eval(localStorage.getItem("#noBuldge")));
$("#noBuldge").on("change", () => {
	localStorage.setItem("#noBuldge", $("#noBuldge").prop('checked'));
	if ($("#noBuldge").prop('checked')) {
		$("#Info").removeClass("shouldBuldge");
	} else {
		$("#Info").addClass("shouldBuldge");
	}
}).trigger("change");


$("#noBlocky").prop('checked', eval(localStorage.getItem("#noBlocky")));
$("#noBlocky").on("change", () => {
	localStorage.setItem("#noBlocky", $("#noBlocky").prop('checked'));
	if ($("#noBlocky").prop('checked')) {
		$("blindInfo, #blindName, playingHand, #blindDescription").removeClass("blocky");
	} else {
		$("blindInfo, #blindName, playingHand, #blindDescription").addClass("blocky");
	}
}).trigger("change");

let bigCardAddedCSS = $("<style></style>").appendTo($("body"));

$("#bigCards").prop('checked', eval(localStorage.getItem("#bigCards")));
$("#bigCards").on("change", () => {
	localStorage.setItem("#bigCards", $("#bigCards").prop('checked'));
	if ($("#bigCards").prop('checked')) {
		bigCardAddedCSS.html(".card{scale: 1.25 !important;}");
	} else {
		bigCardAddedCSS.html("");
	}
}).trigger("change");

let noShadowsCSS = $("<style></style>").appendTo($("body"));

$("#noShadows").prop('checked', eval(localStorage.getItem("#noShadows")));
$("#noShadows").on("change", () => {
	localStorage.setItem("#noShadows", $("#noShadows").prop('checked'));
	if ($("#noShadows").prop('checked')) {
		noShadowsCSS.html("*{box-shadow: none !important; text-shadow: none !important;}");
	} else {
		noShadowsCSS.html("");
	}
}).trigger("change");

let altStyleCSS = $("<style></style>").appendTo($("body"));

$("#altEditions").prop('checked', eval(localStorage.getItem("#altEditions")));
$("#altEditions").on("change", () => {
	localStorage.setItem("#altEditions", $("#altEditions").prop('checked'));
	if ($("#altEditions").prop('checked')) {
		altStyleCSS.html(".Holographic{filter: url(#duotone);} .Foil{filter: url(#foil);}");
	} else {
		altStyleCSS.html("");
	}
}).trigger("change");


$("#noSound").prop('checked', eval(localStorage.getItem("#noSound")));
$("#noSound").on("change", () => {
	localStorage.setItem("#noSound", $("#noSound").prop('checked'));
	if ($("#noSound").prop('checked')) {
		playSounds = false;
	} else {
		playSounds = true;
	}
}).trigger("change");

var packShader = true;
$("#noPackShader").prop('checked', eval(localStorage.getItem("#noPackShader")));
$("#noPackShader").on("change", () => {
	localStorage.setItem("#noPackShader", $("#noPackShader").prop('checked'));
	if ($("#noPackShader").prop('checked')) {
		packShader = false;
	} else {
		packShader = true;
	}
}).trigger("change");


let curve = document.getElementById("curve");
// function updateCircles()
// {

// 	let n = document.querySelectorAll("[insideType='Hand'].card");
// 	   // Find the curve path element
// 	   // Get the total length of the path
// 	   let curveLength = curve.getTotalLength();
// 	   // Calculate the spacing between the circles
// 	   let spacing = curveLength / (n.length - 1);

// 	   // Add the n new circles
// 	   for (var i = 0; i < n.length; i++)
// 	   {
// 	      // Get the x,y position of a point x along the path
// 	      let coords = curve.getPointAtLength(i * spacing);
// 	      let element = n[i];
// 	      element.style.left = `${coords.x}px`;
// 	      element.style.top = `${coords.y}px`;
// 	   }
// }
// updateCircles();



async function sh() {
	// await delay(200);
	// sortHand();
}

function discardSelected() {
	if (game.blind.currentScore < game.blind.minimum) {
		deck.deal(Math.max(0, game.player.handSize - lowerhand.length), [lowerhand], 100, () => { sh() }, game.blind);
		// deck.deal(Math.max(0, 999), [lowerhand], 100, ()=>{}, game.blind);
	}
	discardPile.addCards(upperhand);
	discardPile.render();
	upperhand.render();
	lowerhand.render();
}

function pokerHandsInfo() {

}

// Game information updater
setInterval(updateInfo, 50);
function updateInfo() {
	if (!game.alive) return pixelSize = 125.0;
	$('#discard').prop("disabled", (game.blind.discards <= 0 || !game.blind.inPlay));

	document.getElementById('deck-count').innerText = `${deck.length} / ${cards.all.length}`

	let handType = detectPokerHand(upperhand);
	// updateCircles();


	// document.querySelector('#blindName').innerText = game.blind.name
	if (!game.inShop) {
		document.querySelector('#blindDescription').innerHTML = `Score at least: <b>${(game.blind.minimum).toLocaleString()}</b>`
	} else {
		document.querySelector('#blindDescription').innerHTML = `<img src="img/ShopSignAnimation.gif">`
	}
	if (!countingScore) document.querySelector('#roundScore').innerText = (game.blind.currentScore).toLocaleString()
	document.querySelector('#infoRound').innerText = game.round + 1
	document.querySelector('#infoAnte').innerText = game.ante + 1 + "/8"

	if (document.querySelector('#infoDiscards').innerText != game.blind.discards) document.querySelector('#infoDiscards').innerText = game.blind.discards
	if (document.querySelector('#infoHands').innerText != game.blind.hands) document.querySelector('#infoHands').innerText = game.blind.hands
	if (document.querySelector('#infoMoney').innerText != (game.player.money).toLocaleString()) document.querySelector('#infoMoney').innerText = (game.player.money).toLocaleString()

	document.querySelector('#shopText').innerHTML = `Shop ( $${game.player.money} )`;




	// if (game.inShop) {
	// 	pixelSize = 325.0;
	// } else {
	// 	pixelSize = 750.0;
	// }

	// info.innerHTML = `{ <money>$${game.player.money}</money> | Ante ${game.ante} | Round ${game.round} } </br> ( <hands>${game.blind.hands} Hands</hands> | <discards>${game.blind.discards} Discards</discards> ) </br> ${game.blind.name} : [${game.blind.currentScore} / <b>${game.blind.minimum}</b>] </br> `;
	if (!countingScore) {
		if (upperhand.length > 0) {

			if (document.getElementById('playingHandName').textContent != handType.hand) {
				document.getElementById('playingHandName').innerHTML = handType.hand;
				splitElement("#playingHandName");
				document.getElementById('playingHandLevel').innerHTML = `lvl. ${RULEBOOK.basePokerHands[handType.hand].level}`;
				document.getElementById('playingHandLevel').style.color = `var(--hand-level-${Math.min(RULEBOOK.basePokerHands[handType.hand].level, 7)})`;
			}

			if (!showFullyCalculatedHand) {
				document.getElementById('playingHandChips').innerHTML = (RULEBOOK.basePokerHands[handType.hand].chips).toLocaleString()
				document.getElementById('playingHandMult').innerHTML = (RULEBOOK.basePokerHands[handType.hand].mult).toLocaleString()
			}


			// info.innerHTML += `${handType.hand} (lvl. ${RULEBOOK.basePokerHands[handType.hand].level}): <chips>${calculateChips(handType, mult, chips)}</chips> x <mult>${calculateMultiplier(handType, mult, chips)}</mult>`;
		} else {
			if (document.getElementById('playingHandName').innerHTML != '‎') {
				document.getElementById('playingHandName').innerHTML = '‎'
				document.getElementById('playingHandLevel').innerHTML = '‎'
			}
			document.getElementById('playingHandChips').innerHTML = 0
			document.getElementById('playingHandMult').innerHTML = 0
		}
	}
}

const satisfyingWrapper = document.getElementById('satisfactionWrapper');
const satisfyingElement = document.getElementById('satisfaction');
async function satisfactionTextUpdate(text, element, color) {
	try {
		satisfyingElement.innerText = text;
		satisfyingWrapper.style.backgroundColor = `var(--${color})`;
		let toLeft = getOffset(element).left + (Number(element.style.width.slice(0, -2)) / 4)
		let toRight = getOffset(element).top + (Number(element.style.height.slice(0, -2)) / 4)

		$(element).css({ scale: 1.25 });
		$(element).animate({ scale: 1 }, { duration: 250, queue: false });

		$(satisfyingWrapper).css({ left: toLeft + "px", top: toRight + "px", opacity: 0.1, apple: 0.1, "--scale": 0.1 });
		// satisfyingWrapper.style.setProperty("--degree", `${45 * Math.ceil(Math.random()*8)}deg`)
		$(satisfyingWrapper).animate({ opacity: 1, apple: 1 }, {
			duration: 400, step: () => {
				satisfyingWrapper.style.setProperty("--scale", satisfyingWrapper.style.opacity);
			}
		});

		shake()

	} catch (error) {
		//Ignoring errors for now, jokers error this seemingly randomly...
		console.log("STU " + error)
	}

}

function shake() {
	$("html").removeClass("softShake");
	document.querySelector("html").offsetHeight;
	$("html").addClass("softShake");
}

function doesntViolateBlind(card) {
	if (game.blind.cardCheckHook) {
		if (!game.blind.cardCheckHook(card)) {
			card.el[0].classList.add('debuffed');
		} else {
			card.el[0].classList.remove('debuffed');
		}
		return game.blind.cardCheckHook(card);
	} else {
		card.el[0].classList.remove('debuffed');
		return true
	}
}

var Gi = 0;

async function getPreplayCombinedExportOfCards(scoringCards, base, chips, animated = false, handType) {
	var mult = base;

	assignRetriggers(scoringCards);
	Gi = 0;

	for (let card of scoringCards) {
		// for (let retriggerInstance = 0; retriggerInstance < ( 1 + card.temporaryRetriggers.length + card.permanentRetriggers); retriggerInstance++) {
		card.temporaryRetriggers.unshift("falser");

		for (let index = 0; index < card.permanentRetriggers; index++) {
			card.temporaryRetriggers.push(false);
		}

		for (let retriggerInstance of card.temporaryRetriggers) {
			let beforeMult = mult;
			let beforeChips = chips;

			if (doesntViolateBlind(card)) {

				// alert(retriggerInstance)
				if (animated && (retriggerInstance != false && retriggerInstance != "falser")) {
					satisfactionTextUpdate(`Again!`, document.getElementById(retriggerInstance), "orange");
					Gi++;
					await delay(550 / (1 + (Gi * 0.1)));
				}

				//CHIPS
				if (card.rank == 1) {
					chips += 13
				}
				if (card.enhancement == RULEBOOK.enhancements.bonus) {
					chips += 50
				}
				chips += card.rank;
				chips += card.chipBonus;

				if (animated) {
					satisfactionTextUpdate(`+ ${(chips - beforeChips).toLocaleString()}`, card.el[0], "blue");
					let playingHandChips = document.getElementById('playingHandChips');
					playingHandChips.innerText = (chips).toLocaleString();

					if (playSounds) {
						let cardSound = new Audio("snd/chips1.ogg")
						cardSound.preservesPitch = false;
						cardSound.playbackRate = 0.85 + (Gi * 0.025);
						cardSound.play();
					}

					Gi++;
					await delay(550 / (1 + (Gi * 0.1)));
				}



				//MULT
				switch (card.enhancement) {
					case RULEBOOK.enhancements.mult:
						mult += 4;
						break;
					case RULEBOOK.enhancements.glass:
						mult *= 2;
						break;
					case RULEBOOK.enhancements.lucky:
						if (Math.random() < 0.2) mult += 20;
						if (Math.random() < 0.06 && animated) {
							game.player.money += 20;
							satisfactionTextUpdate(`+ $20`, card.el[0], 'gold');
							await delay(550 / (1 + (Gi * 0.1)));
						}
						break;

				}

				if (animated && (mult != beforeMult)) {
					satisfactionTextUpdate(`+ ${(mult - beforeMult).toLocaleString()}`, card.el[0], 'red');
					let playingHandText = document.getElementById('playingHandMult');
					playingHandText.innerText = (mult).toLocaleString();

					if (playSounds) {
						let cardSound = new Audio("snd/multhit1.ogg")
						cardSound.preservesPitch = false;
						cardSound.playbackRate = 0.85 + (Gi * 0.05);
						cardSound.play();
					}

					Gi++;
					await delay(550 / (1 + (Gi * 0.1)));
					//if(card.enhancement == RULEBOOK.enhancements.glass && Math.random() < 0.25 && animated) card.break();
				}

				let updatedGiven = await executeOnScoreJokers(handType, mult, chips, card, Gi);
				mult = updatedGiven.currentMultiplier;
				chips = updatedGiven.currentChips;


			} else if (animated) {
				satisfactionTextUpdate(`Debuffed!`, card.el[0], "black");
				await delay(550);
			}
		}
		card.temporaryRetriggers = [];
	}
	for (let card of lowerhand) {
		if (doesntViolateBlind(card)) {
			if (card.enhancement == RULEBOOK.enhancements.steel) {
				mult *= 1.5;
				if (animated) {
					satisfactionTextUpdate(`* 1.5`, card.el[0], 'red');
					let playingHandText = document.getElementById('playingHandMult');
					playingHandText.innerText = (mult).toLocaleString();
					await delay(550 / (1 + (Gi * 0.1)));
				}
			}
		} else if (animated && card.enhancement == RULEBOOK.enhancements.steel) {
			satisfactionTextUpdate(`Debuffed!`, card.el[0], "black");
			await delay(550 / (1 + (Gi * 0.1)));
		}
	}

	return [chips, mult];
}

async function executeOnScoreJokers(handType, mult, chips, card, i) {
	var givenInformation = { card: card, handType: handType, gameObject: game, deck: cards.all, stationaryHand: lowerhand, currentMultiplier: mult, currentChips: chips }
	for (joker of game.player.jokers) {
		for (jHooks of joker.hooks) {
			if (jHooks.in == "onScored") {
				var jokerHookOutput = joker.onScored(givenInformation)
				for (output of jHooks.out) {
					if (givenInformation[output] != jokerHookOutput[output]) {
						let sColor = "blue";
						if (output == "currentMultiplier") {
							let playingHandText = document.getElementById('playingHandMult');
							playingHandText.innerText = jokerHookOutput[output].toLocaleString();
							sColor = "red";

							if (playSounds) {
								let cardSound = new Audio("snd/multhit1.ogg")
								cardSound.preservesPitch = false;
								cardSound.playbackRate = 0.85 + (i * 0.05);
								cardSound.play();
							}
							i++;

						} else {
							let playingHandText = document.getElementById('playingHandChips');
							playingHandText.innerText = jokerHookOutput[output].toLocaleString();

							if (playSounds) {
								let cardSound = new Audio("snd/chips1.ogg")
								cardSound.preservesPitch = false;
								cardSound.playbackRate = 0.85 + (i * 0.025);
								cardSound.play();
							}
							i++;
						}

						satisfactionTextUpdate(`+ ${(jokerHookOutput[output] - givenInformation[output]).toLocaleString()}`, document.getElementById(joker.elementId), sColor);
						givenInformation[output] = jokerHookOutput[output];

						await delay(550 / (1 + (i * 0.1)));
					}
					//givenInformation = {handType:handType, gameObject:game, deck:cards.all, stationaryHand:lowerhand, currentMultiplier:mult, currentChips:chips}
				}
			}
		}
	}
	return givenInformation;
}

function assignRetriggers(scoringCards) {
	for (joker of game.player.jokers) {
		for (jHooks of joker.hooks) {
			if (jHooks.in == "onAssignRetriggers") {
				joker.onAssignRetriggers(scoringCards, joker);
			}
		}
	}
}

async function calculateMultiplier(handType, mult, chips, animated = false) {
	var givenInformation = { handType: handType, gameObject: game, deck: cards.all, stationaryHand: lowerhand, currentMultiplier: mult, currentChips: chips }
	let playingHandText = document.getElementById('playingHandMult');

	for (joker of game.player.jokers) {
		if (joker.edition == RULEBOOK.editions.holographic) {
			givenInformation.currentMultiplier += 10;
			if (animated) {
				satisfactionTextUpdate(`+ 10`, document.getElementById(joker.elementId), 'red');
				await delay(550 / (1 + (Gi * 0.1)));
			}
		}
		if (joker.edition == RULEBOOK.editions.polychrome) {
			givenInformation.currentMultiplier *= 1.5;
			if (animated) {
				satisfactionTextUpdate(`* 1.5`, document.getElementById(joker.elementId), 'red');
				await delay(550 / (1 + (Gi * 0.1)));
			}
		}

		for (jHooks of joker.hooks) {
			if (jHooks.in == "onIndependent") {
				var jokerHookOutput = joker.onIndependent(givenInformation)
				if (jHooks.out.includes("currentMultiplier")) {
					if (animated && mult != jokerHookOutput.currentMultiplier) {
						satisfactionTextUpdate(`+ ${jokerHookOutput.currentMultiplier - mult}`, document.getElementById(joker.elementId), 'red');
						playingHandText.innerText = jokerHookOutput.currentMultiplier.toLocaleString();
						if (playSounds) { new Audio("snd/multhit1.ogg").play(); }
						await delay(550 / (1 + (Gi * 0.1)));
					}
					mult = jokerHookOutput.currentMultiplier
					givenInformation = { handType: handType, gameObject: game, deck: cards.all, stationaryHand: lowerhand, currentMultiplier: mult, currentChips: chips }
				}
			}
		}
	}
	mult = givenInformation.currentMultiplier;
	playingHandText.innerText = mult.toLocaleString();
	return mult;
}

async function calculateChips(handType, mult, chips, animated = false) {
	// alert('a')
	let givenInformation = { handType: handType, gameObject: game, deck: cards.all, stationaryHand: lowerhand, currentMultiplier: mult, currentChips: chips }
	let playingHandText = document.getElementById('playingHandChips');

	for (joker of game.player.jokers) {
		if (joker.edition == RULEBOOK.editions.foil) {
			givenInformation.currentChips += 100;
			if (animated) {
				satisfactionTextUpdate(`+ 100`, document.getElementById(joker.elementId), 'blue');
				await delay(550 / (1 + (Gi * 0.1)));
			}
		}

		for (jHooks of joker.hooks) {
			if (jHooks.in == "onIndependent") {
				var jokerHookOutput = joker.onIndependent(givenInformation)
				if (jHooks.out.includes("currentChips")) {
					if (animated) {
						satisfactionTextUpdate(`+ ${jokerHookOutput.currentChips - chips}`, document.getElementById(joker.elementId), 'blue');
						playingHandText.innerText = jokerHookOutput.currentChips.toLocaleString();
						await delay(550 / (1 + (Gi * 0.1)));
					}
					chips = jokerHookOutput.currentChips
					givenInformation = { handType: handType, gameObject: game, deck: cards.all, stationaryHand: lowerhand, currentMultiplier: mult, currentChips: chips }
				}
			}
		}

	}
	chips = givenInformation.currentChips;
	playingHandText.innerText = chips.toLocaleString();
	return chips;
}

satisfyingWrapper.style.display = 'none';

async function calculateScore(handType, animated = false) {
	try {

		//Lock constant info update and player interactions
		countingScore = true;

		for (let zjoker of game.player.jokers) {
			if (zjoker.onPlayed) {

				zjoker.onPlayed({ handType: handType });
				document.getElementById('playingHandChips').innerHTML = RULEBOOK.basePokerHands[handType.hand].chips.toLocaleString()
				document.getElementById('playingHandMult').innerHTML = RULEBOOK.basePokerHands[handType.hand].mult.toLocaleString()
				document.getElementById('playingHandLevel').innerHTML = `lvl. ${RULEBOOK.basePokerHands[handType.hand].level}`
			}
		}

		if (game.blind.beforeScoring) {
			game.blind.beforeScoring({ handType: handType })
		}

		//Show which cards score
		let i = 0;
		for (let card of handType.scoringCards) {
			card.el[0].classList.add('scoringCard');

			if (playSounds) {
				let cardSound = new Audio("snd/cardSlide1.ogg")
				cardSound.preservesPitch = false;
				cardSound.playbackRate = 0.85 + (i * 0.05);
				cardSound.play();
			}

			i++;
			await delay(150);
		}
		await delay(250);

		// for (let zjoker of game.player.jokers) {
		// 	if (zjoker.onPlayed){zjoker.onPlayed({handType:handType})}
		// }

		satisfyingWrapper.style.display = 'inline-block';

		//Calculate
		// var chips = await getPreplayScoreOfCards(handType.scoringCards, RULEBOOK.basePokerHands[handType.hand].chips, animated)
		// var mult = await getPreplayMultOfCards(handType.scoringCards,RULEBOOK.basePokerHands[handType.hand].mult, animated)
		var chipsMult = await getPreplayCombinedExportOfCards(handType.scoringCards, RULEBOOK.basePokerHands[handType.hand].mult, RULEBOOK.basePokerHands[handType.hand].chips, animated, handType);

		let finalChips = Math.floor(await calculateChips(handType, chipsMult[1], chipsMult[0], animated));
		let finalMult = Math.floor(await calculateMultiplier(handType, chipsMult[1], chipsMult[0], animated));

		for (const card of handType.scoringCards) {
			if ((card.enhancement == RULEBOOK.enhancements.glass) && Math.random() < 0.25) {
				card.break();
				discardPile.addCard(card);
				discardPile.render();
				satisfactionTextUpdate(`Broken!`, card.el[0], "black");
				await delay(400);
			}
		}

		if (playSounds) {
			let nextS = new Audio("snd/button.ogg");
			nextS.preservesPitch = false;
			nextS.playbackRate = 0.85;
			nextS.play();
		}

		document.getElementById("playingHandName").innerText = (finalChips * finalMult).toLocaleString();
		let speed = 10;
		if ((finalChips * finalMult) < 1000) speed += 20;
		await delay(500);

		if (playSounds) { new Audio("snd/chips2.ogg").play(); }

		document.getElementById("playingHandLevel").innerText = '';
		await Promise.all([countScore("roundScore", game.blind.currentScore + (finalChips * finalMult), speed), countScore("playingHandName", 0, speed)]);



		await delay(400);

		//Finished - unlock update and controls, reset played card animations.
		countingScore = false;
		satisfyingWrapper.style.display = 'none';
		for (let card of handType.scoringCards) {
			card.el[0].classList.remove('scoringCard');
		}


		return finalChips * finalMult;
	} catch (error) {
		alert("Calc : " + error)
	}
}

function detectPokerHand(cards) {
	if (cards.length == 0) return { hand: "Invalid hand", scoringCards: [] };

	let ranks = {}, suits = {};
	let rankValues = [];
	let rankMap = {};

	// Parse cards
	for (let card of cards) {
		let suit = card.name[0];
		let rank = parseInt(card.name.slice(1));

		ranks[rank] = (ranks[rank] || 0) + 1;
		suits[suit] = (suits[suit] || 0) + 1;
		rankValues.push(rank);
		rankMap[card] = rank;
	}

	let flushStraightMinimum = game.player.jokers.includes(RULEBOOK.jokers.fourFingersJoker) ? 4 : 5;

	rankValues.sort((a, b) => a - b);
	let uniqueRanks = Object.keys(ranks).length;
	let isFlush = cards.length >= flushStraightMinimum && Object.keys(suits).length === 1;
	let isStraight = uniqueRanks >= flushStraightMinimum && (rankValues[uniqueRanks - 1] - rankValues[0] === (uniqueRanks - 1) || rankValues.join() === "1,10,11,12,13");

	// Identify hands
	let rankCounts = Object.entries(ranks).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
	let hand = "High Card";
	let scoringRanks = new Set();

	// if (isFlush && isStraight && rankValues.includes(1)) {
	//     hand = "Royal Flush";
	//     scoringRanks = new Set(rankValues);
	// } else 
	if (isFlush && isStraight) {
		hand = "Straight Flush";
		scoringRanks = new Set(rankValues);
	} else if (rankCounts[0][1] === 4) {
		hand = "Four of a Kind";
		scoringRanks.add(parseInt(rankCounts[0][0]));
	} else if (rankCounts.length > 1 && rankCounts[0][1] === 3 && rankCounts[1][1] === 2) {
		hand = "Full House";
		scoringRanks.add(parseInt(rankCounts[0][0]));
		scoringRanks.add(parseInt(rankCounts[1][0]));
	} else if (isFlush) {
		hand = "Flush";
		scoringRanks = new Set(rankValues);
	} else if (isStraight) {
		hand = "Straight";
		scoringRanks = new Set(rankValues);
	} else if (rankCounts[0][1] === 3) {
		hand = "Three of a Kind";
		scoringRanks.add(parseInt(rankCounts[0][0]));
	} else if (rankCounts.length > 1 && rankCounts[0][1] === 2 && rankCounts[1][1] === 2) {
		hand = "Two Pair";
		scoringRanks.add(parseInt(rankCounts[0][0]));
		scoringRanks.add(parseInt(rankCounts[1][0]));
	} else if (rankCounts[0][1] === 2) {
		hand = "One Pair";
		scoringRanks.add(parseInt(rankCounts[0][0]));
	} else {
		scoringRanks.add(parseInt(rankValues[0]))
	}

	let scoringCards = cards.filter(card => scoringRanks.has(rankMap[card]));

	if (game.player.jokers.includes(RULEBOOK.jokers.splashJoker)) {
		scoringCards = cards;
	}

	return { hand, scoringCards };
}

function getOffset(el) {
	const rect = el.getBoundingClientRect();
	return {
		left: rect.left + window.scrollX,
		top: rect.top + window.scrollY
	};
}

function updateFireCheck() {
	if (($("#playingHandChips").text() * $("#playingHandMult").text()) > game.blind.minimum) {
		$("#playingHandChips").addClass("onFire");
		$("#playingHandMult").addClass("onFire");
	} else {
		$("#playingHandChips").removeClass("onFire");
		$("#playingHandMult").removeClass("onFire");
	}
}

async function countScore(elementId, target, speed) {
	let ele = document.getElementById(elementId)
	let difference = toNumber(ele.innerText) > target ? -1 : 1;
	let i = 0;


	while (toNumber(ele.innerText) != target) {
		let countingDivisor = 1;

		if (Math.abs(target - toNumber(ele.innerText)) > 100) countingDivisor = 50;
		if (Math.abs(target - toNumber(ele.innerText)) > 1000) countingDivisor = 500;
		if (Math.abs(target - toNumber(ele.innerText)) > 10000) countingDivisor = 5000;
		if (Math.abs(target - toNumber(ele.innerText)) > 100000) countingDivisor = 50000;


		if ($("#instantCount").prop('checked') || toNumber(ele.innerText) < 0 ||
			(toNumber(ele.innerText) > target && difference == 1) ||
			(toNumber(ele.innerText) < target && difference == -1)
		) {
			ele.innerText = target.toLocaleString();
			return;
		}

		ele.innerText = (toNumber(ele.innerText) + (difference * countingDivisor)).toLocaleString();
		if (i < 500 || (i > 500 && i % 5 != 0)) {
			await delay(speed / (1 + (i)));
		}
		i++;
	}
}

function toNumber(a) {
	if (typeof a == typeof 3) return a;
	return Number(a.replaceAll(",", ""))
}

let last = {};
var observerForAnimations = new MutationObserver(function (mutations) {
	// if(countingScore) {return};
	mutations.forEach(function (mutation) {
		let ele = document.getElementById(mutation.target.id);
		if (last[ele.id] && last[ele.id] == ele.innerText) return;
		last[ele.id] = ele.innerText;
		$(ele).css({ letterSpacing: "3px" });
		$(ele).animate({ letterSpacing: "1px" }, { duration: 250, queue: false });

		if (mutation.target.id == "playingHandChips" || mutation.target.id == "playingHandMult") {
			updateFireCheck();
		}

	});
});
function attachObserver(elementId) {
	observerForAnimations.observe(document.getElementById(elementId), { attributes: true, childList: true, characterData: true });
}
function attachObservers(elementIds) {
	elementIds.forEach(elementId => {
		attachObserver(elementId)
	});
}
attachObservers(["playingHandName", "playingHandChips", "playingHandLevel", "playingHandMult", "infoHands", "infoDiscards", "infoMoney"])

const splitElement = (querySel) => {
	const div = document.querySelector(querySel)
	div.innerHTML = div.textContent.split("").map((letter, index) => `<span style="--i:${index}" ${letter.trim() === "" ? "" : 'class="block"'}>${letter}</span>`).join("")
};

const delay = (delayInms) => {
	return new Promise(resolve => setTimeout(resolve, delayInms));
};

// const sample = async () => {
// 	alert('a');
// 	//console.log('waiting...')
// 	let delayres = await delay(3000);
// 	alert('b');
// };
//   sample();

$("#pkrHnd").click(() => {
	try {
		let infoArea = document.getElementById('pokerHandsInfo');
		infoArea.innerHTML = "<h2 style='text-align: center;'>Poker Hands</h2>";
		Object.entries(RULEBOOK.basePokerHands).forEach(handType => {
			let handDesignation = handType[1];
			infoArea.innerHTML += `<span title="${handType[1].description}">${handType[0]}</span>:  <span style="float:right"> [<chips>${handDesignation.chips}</chips> x <mult>${handDesignation.mult}</mult>] <u style="color: var(--hand-level-${Math.min(handDesignation.level, 7)});" >(lvl. ${handDesignation.level})</u> </span> <br>`;
		});
	} catch (error) {
		alert(error)
	}
});

// function extractContent(s) {
// 	var span = document.createElement('span');
// 	span.innerHTML = s;
// 	return span.textContent || span.innerText;
// };

// Auto-start game
window.addEventListener("load", () => {
	// game.player.addJoker(RULEBOOK.jokers.lustyJoker);
	// game.player.addJoker(RULEBOOK.jokers.gluttonousJoker);
	// game.player.addJoker(RULEBOOK.jokers.greedyJoker);

	// setTimeout(() => $('#deal').click(), 50);
});

function sv_enhanceAll(enhan) {
	cards.all.forEach((card) => { card.enhancement = enhan });
	return `All is ${enhan}...`
}

// Version 4.0
const pSBC = (p, c0, c1, l) => {
	let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
	if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
	if (!this.pSBCr) this.pSBCr = (d) => {
		let n = d.length, x = {};
		if (n > 9) {
			[r, g, b, a] = d = d.split(","), n = d.length;
			if (n < 3 || n > 4) return null;
			x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
		} else {
			if (n == 8 || n == 6 || n < 4) return null;
			if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
			d = i(d.slice(1), 16);
			if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
			else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
		} return x
	};
	h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
	if (!f || !t) return null;
	if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
	else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
	a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
	if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
	else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}

function randomOf(arrayOrObject, checkCondition = (a) => { return false; }) {
	let keys = [];
	let object = false;
	if (Array.isArray(arrayOrObject)) {
		keys = arrayOrObject;
	} else {
		keys = Object.keys(arrayOrObject);
		object = true;
	}
	// alert(JSON.stringify(keys));
	let choice;
	function again() {
		choice = keys[Math.floor(Math.random() * keys.length)];
		if (object) {
			choice = arrayOrObject[choice];
		}
	}
	again();

	while (checkCondition(choice)) {
		again();
	}

	return choice;
}