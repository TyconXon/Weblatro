
var cards = (function() {
	//The global options
	var opt = {
		cardSize: {
			width: 71,
			height: 95,
			padding: 50
		},
		animationSpeed: 500,
		table: 'body',
		cardback: 'red',
		acesHigh: true,
		cardsUrl: 'img/BalatroCards_Free.png',
		blackJoker: false,
		redJoker: false,
		type: STANDARD,
		loop: 1,
		immediateMode: false,
		RULEBOOK : {}
	};
	var zIndexCounter = 1;
	var all = []; //All the cards created.
	var start = 1;
	var end = start + 12;

	function mouseEvent(ev) {
		var card = $(this).data('card');
		document.querySelector("h1").innerText = `${card}`

		if (card.container) {
			var handler = card.container._click;
			if (handler) {
				handler.func.call(handler.context || window, card, ev);
			}
		}
	}

	function init(options) {
		if (options) {
			for (var i in options) {
				if (opt.hasOwnProperty(i)) {
					opt[i] = options[i];
				}
			}
		}
		switch (opt.type) {
			case STANDARD:
				opt.acesHigh = false;
				start = opt.acesHigh ? 2 : 1;
				end = start + 12;
				break;
			case EUCHRE:
				start = 9;
				end = start + 5;
				break;
			case PINOCHLE:
				start = 9;
				end = start + 5;
				opt.loop = 2;
				break;
		}

		$(":root").css({"--deck-url" : `url(${opt.cardsUrl})`});

		opt.table = $(opt.table)[0];
		if ($(opt.table).css('position') == 'static') {
			$(opt.table).css('position', 'relative');
		}
		for (let l = 0; l < opt.loop; l++)
			for (var i = start; i <= end; i++) {
				all.push(new Card('h', i, opt.table));
				all.push(new Card('s', i, opt.table));
				all.push(new Card('d', i, opt.table));
				all.push(new Card('c', i, opt.table));
			}
		if (opt.blackJoker) {
			all.push(new Card('bj', 0, opt.table));
		}
		if (opt.redJoker) {
			all.push(new Card('rj', 0, opt.table));
		}

		$('.card').click(mouseEvent);
		shuffle(all);
	}

	function shuffle(deck) {
		//Fisher yates shuffle
		var i = deck.length;
		if (i == 0) return;
		while (--i) {
			var j = Math.floor(Math.random() * (i + 1));
			var tempi = deck[i];
			var tempj = deck[j];
			deck[i] = tempj;
			deck[j] = tempi;
		}
	}

	function Card(suit, rank, table) {
		this.init(suit, rank, table);
	}

	Card.prototype = {
		init: function(suit, rank, table) {
			this.shortName = suit + rank;
			this.suit = suit;
			this.rank = rank;
			this.name = suit.toUpperCase() + rank;
			this.faceUp = false;
			this.faceDownBLIND = false;

			//Balatro specific
			this.enhancement = opt.RULEBOOK.enhancements.none;
			this.seal = opt.RULEBOOK.seals.none;
			this.edition = opt.RULEBOOK.editions.base;
			this.niceName = suit.replaceAll('h','♥').replaceAll('c','♣').replaceAll('d','♦').replaceAll('s','♠') + rank;
			this.temporaryRetriggers = [];
			this.permanentRetriggers = 0;

			this.chipBonus = 0; //Permanent chip bonus gained by Hiker jokers

			this.el = $('<div/>').css({
				width: opt.cardSize.width,
				height: opt.cardSize.height,
				"background-image": 'var(--deck-url), url(img/BaltroBacks.png)',
				position: 'absolute',
				cursor: 'pointer',
				animationDirection: `${Math.random()>0.50?"alternate-reverse":"alternate"}`
			}).addClass('card').data('card', this).appendTo($(table));

			$(this.el)[0].onmousemove = hoverCard;
			$(this.el)[0].onmouseout = noHoverCard;
			
			this.showCard();
			this.moveToFront();
		},

		toString: function() {
			return this.name;
		},

		moveTo: function(x, y, speed, callback) {
			var props = {
				top: y - (opt.cardSize.height / 2),
				left: x - (opt.cardSize.width / 2)
			};
			$(this.el).animate(props, speed || opt.animationSpeed, callback);
		},

		rotate: function(angle) {
			$(this.el)
				.css('-webkit-transform', 'rotate(' + angle + 'deg)')
				.css('-moz-transform', 'rotate(' + angle + 'deg)')
				.css('-ms-transform', 'rotate(' + angle + 'deg)')
				.css('transform', 'rotate(' + angle + 'deg)')
				.css('-o-transform', 'rotate(' + angle + 'deg)');
		},

		showCard: function() {
			if (this.faceDownBLIND){
				this.hideCard();
				return false;
			}
			var offsets = {
				"c": 1,
				"d": 2,
				"h": 0,
				"s": 3,
				"rj": 2,
				"bj": 3
			};
			var xpos, ypos;
			var rank = this.rank;
			if (rank == 14) {
				rank = 1; //Aces high must work as well.
			}
			xpos = -rank * opt.cardSize.width;
			ypos = -offsets[this.suit] * opt.cardSize.height;
			this.rotate(0);

			//balatro specific
			var enhancementXpos, enhancementYpos;
			switch(this.enhancement){
				case opt.RULEBOOK.enhancements.none:
					enhancementXpos = opt.cardSize.width;
					enhancementYpos = 0;
					break;
				case opt.RULEBOOK.enhancements.bonus:
					enhancementXpos = opt.cardSize.width;
					enhancementYpos = opt.cardSize.height;
					break;
				case opt.RULEBOOK.enhancements.mult:
					enhancementXpos = 2 * opt.cardSize.width;
					enhancementYpos = opt.cardSize.height;
					break;
				case opt.RULEBOOK.enhancements.glass:
					enhancementXpos = 5 * opt.cardSize.width;
					enhancementYpos = opt.cardSize.height;
					break;
				case opt.RULEBOOK.enhancements.steel:
						enhancementXpos = 6 * opt.cardSize.width;
						enhancementYpos = opt.cardSize.height;
					break;
				case opt.RULEBOOK.enhancements.gold:
						enhancementXpos = 6 * opt.cardSize.width;
						enhancementYpos = 0;
					break;
				case opt.RULEBOOK.enhancements.lucky:
						enhancementXpos = 4 * opt.cardSize.width;
						enhancementYpos = opt.cardSize.height;
					break;
				case opt.RULEBOOK.enhancements.stone:
						enhancementXpos = 5 * opt.cardSize.width;
						enhancementYpos = 0;
					break;
				case opt.RULEBOOK.enhancements.wild:
						enhancementXpos = 3 * opt.cardSize.width;
						enhancementYpos = opt.cardSize.height;
					break;
			}

			this.el.attr('title', `${this.niceName} (${this.enhancement} | ${this.seal} | ${this.edition} | +${this.chipBonus}c )`)
			this.el.attr('faceDown', 'false');
			$(this.el).css('background-position', xpos + 'px ' + ypos + 'px, ' + `-${enhancementXpos}px -${enhancementYpos}px`);
		},

		hideCard: function(position) {
			var y = opt.cardback == 'red' ? 0 * opt.cardSize.height : -1 * opt.cardSize.height;
			$(this.el).css('background-position', '0px ' + y + 'px');
			this.rotate(0);
			this.el.attr('title', `Face down!`);
			this.el.attr('faceDown', 'true');
		},

		moveToFront: function() {
			$(this.el).css('z-index', zIndexCounter++);
		},

		destroy: function(){
			// alert("d")
			$(this.el).remove();
			$(this.el).empty();
			this.el.attr('title', `Dead?`);
			// this 
		},

		break: function(){
			// this.faceDownBLIND = true;
			this.showCard();
			console.log("Card broke!");
			all.splice(all.findIndex((chs)=>{return chs == this}),1);
			// this.destroy();
		}
	};

	function Container() {

	}

	Container.prototype = new Array();
	Container.prototype.extend = function(obj) {
		for (var prop in obj) {
			this[prop] = obj[prop];
		}
	}
	Container.prototype.extend({
		addCard: function(card) {
			this.addCards([card]);
		},

		addCards: function(cards) {
			cards = cards.slice()
			for (var i = 0; i < cards.length; i++) {
				var card = cards[i];
				if (card.container) {
					card.container.removeCard(card);
				}
				this.push(card);
				card.el.attr('insideType', this.toString());
				card.container = this;
			}
		},

		removeCard: function(card) {
			for (var i = 0; i < this.length; i++) {
				if (this[i] == card) {
					this.splice(i, 1);
					return true;
				}
			}
			return false;
		},

		init: function(options) {
			options = options || {};
			this.x = options.x || $(opt.table).width() / 2;
			this.y = options.y || $(opt.table).height() / 2;
			this.faceUp = options.faceUp;
		},

		click: function(func, context) {
			this._click = {
				func: func,
				context: context
			};
		},

		mousedown: function(func, context) {
			this._mousedown = {
				func: func,
				context: context
			};
		},

		mouseup: function(func, context) {
			this._mouseup = {
				func: func,
				context: context
			};
		},

		render: function(options) {
			options = options || {};
			var speed = options.speed || opt.animationSpeed;
			this.calcPosition(options);
			for (var i = 0; i < this.length; i++) {
				var card = this[i];
				zIndexCounter++;
				card.moveToFront();
				var top = parseInt($(card.el).css('top'));
				var left = parseInt($(card.el).css('left'));
				if (top != card.targetTop || left != card.targetLeft) {
					var props = {
						top: card.targetTop,
						left: card.targetLeft,
						queue: false
					};
					if (options.immediate || opt.immediateMode) {
						$(card.el).css(props);
					} else {
						$(card.el).animate(props, speed);
					}
				}
			}
			var me = this;
			var flip = function() {
				for (var i = 0; i < me.length; i++) {
					if (me.faceUp && !me[i].faceDownBLIND) {
						me[i].showCard();
					} else {
						me[i].hideCard();
					}
				}
			}
			if (true||options.immediate) {
				flip();
			} else {
				setTimeout(flip, speed / 2);
			}

			if (options.callback) {
				setTimeout(options.callback, speed);
			}
		},

		topCard: function() {
			return this[this.length - 1];
		},

		toString: function() {
			return 'Container';
		}
	});

	function Deck(options) {
		this.init(options);
	}

	Deck.prototype = new Container();
	Deck.prototype.extend({
		calcPosition: function(options) {
			options = options || {};
			var left = Math.round(this.x - opt.cardSize.width / 2, 0);
			var top = Math.round(this.y - opt.cardSize.height / 2, 0);
			var condenseCount = 6;
			for (var i = 0; i < this.length; i++) {
				if (i > 0 && i % condenseCount == 0) {
					top -= 1;
					left += 1;
				}
				this[i].targetTop = top;
				this[i].targetLeft = left;
			}
		},

		toString: function() {
			return 'Deck';
		},

		deal: function(count, hands, speed, callback, blind) {
			var me = this;
			var i = 0;
			if(blind.name == "The Serpent" && blind.inPlay){
				count = 3;
			}

			var totalCount = count * hands.length;

			function dealOne() {
				if (me.length == 0 || i == totalCount) {
					if (callback) {
						callback();
					}
					return;
				}
				if( playSounds ){
					let cardSound = new Audio("snd/card1.ogg");
					cardSound.preservesPitch = false;
					cardSound.preload = 'auto';
					cardSound.playbackRate = 0.85 + (i * 0.05);
					cardSound.play();
				}
				// if (blind && blind.drawCardHook){
				//   blind.drawCardHook(me.topCard());
				// }
				hands[i % hands.length].addCard(me.topCard());
				hands[i % hands.length].render({
					callback: dealOne,
					speed: speed / ( 1 + ( i * 0.1 ) )
				});
				//Balatro specific
				
				i++;
			}
			dealOne();
		}
	});

	function Hand(options) {
		this.init(options);
	}
	Hand.prototype = new Container();
	Hand.prototype.extend({
		calcPosition: function(options) {
			options = options || {};
			var width = opt.cardSize.width + (this.length - 1) * opt.cardSize.padding;
			var left = Math.round(this.x - width / 2);
			var top = Math.round(this.y - opt.cardSize.height / 2, 0);
			for (var i = 0; i < this.length; i++) {
				this[i].targetTop = top;
				this[i].targetLeft = left + i * opt.cardSize.padding;
			}
		},

		toString: function() {
			return 'Hand';
		}
	});

	function Pile(options) {
		this.init(options);
	}

	Pile.prototype = new Container();
	Pile.prototype.extend({
		calcPosition: function(options) {
			options = options || {};
		},

		toString: function() {
			return 'Pile';
		},

		deal: function(count, hands) {
			if (!this.dealCounter) {
				this.dealCounter = count * hands.length;
			}
		}
	});


	return {
		init: init,
		all: all,
		options: opt,
		SIZE: opt.cardSize,
		Card: Card,
		Container: Container,
		Deck: Deck,
		Hand: Hand,
		Pile: Pile,
		shuffle: shuffle
	};
})();

if (typeof module !== 'undefined') {
	module.exports = cards;
}
