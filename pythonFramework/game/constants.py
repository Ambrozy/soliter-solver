HEARTS = 'c'
CROSSES = 'k'
SPADES = 'p'
DIAMONDS = 'b'
EMPTY = ''
PLACE_INDEXES = [0, 1, 2, 3]
HEARTS_INDEX = 4
CROSSES_INDEX = 5
SPADES_INDEX = 6
DIAMONDS_INDEX = 7
BIN_INDEXES = [HEARTS_INDEX, CROSSES_INDEX, SPADES_INDEX, DIAMONDS_INDEX]
NONE_MOVE = 'None'
CARDS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']
DECK = list()

for card in CARDS:
    DECK.append(str(card) + HEARTS)
    DECK.append(str(card) + CROSSES)
    DECK.append(str(card) + SPADES)
    DECK.append(str(card) + DIAMONDS)

UNKNOWN_CARD = 'u'
