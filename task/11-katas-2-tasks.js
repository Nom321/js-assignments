'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    const digitPatterns = [
        ' _ | ||_|', // 0
        '   |  | ', // 1
        ' _  _||_ ', // 2
        ' _  _| _|', // 3
        '   |_|  |', // 4
        ' _ |_| _|', // 5
        ' _ |_|_| ', // 6
        ' _   |  |', // 7
        ' _ |_||_|', // 8
        ' _ |_| _|'  // 9
    ];

    const lines = bankAccount.trim().split('\n');
    let result = '';

    for (let i = 0; i < 9; i++) {
        const digit = lines.map(line => line.slice(i * 3, i * 3 + 3)).join('');
        const digitIndex = digitPatterns.indexOf(digit);
        result += digitIndex !== -1 ? digitIndex : '?';
    }

    return parseInt(result);
}

/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    const words = text.split(' ');
    let currentLine = '';

    for (const word of words) {
        if (currentLine.length + word.length + (currentLine ? 1 : 0) <= columns) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            if (currentLine) yield currentLine;
            currentLine = word.length <= columns ? word : '';
        }
    }

    if (currentLine) yield currentLine;
}

/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    const ranks = hand.map(card => card.slice(0, -1));
    const suits = hand.map(card => card.slice(-1));
    const rankCount = {};
    ranks.forEach(rank => rankCount[rank] = (rankCount[rank] || 0) + 1);

    const values = ranks.map(r => '23456789TJQKA'.indexOf(r) || (r === 'A' ? 13 : parseInt(r) - 1));
    values.sort((a, b) => a - b);
    const isFlush = suits.every(suit => suit === suits[0]);
    const isStraight = values.every((v, i) => i === 0 || v === values[i - 1] + 1) ||
        (values[0] === 0 && values.slice(1).every((v, i) => v === i + 1) && values[4] === 12);

    const counts = Object.values(rankCount);
    const maxCount = Math.max(...counts);

    if (isFlush && isStraight) return PokerRank.StraightFlush;
    if (maxCount === 4) return PokerRank.FourOfKind;
    if (maxCount === 3 && counts.includes(2)) return PokerRank.FullHouse;
    if (isFlush) return PokerRank.Flush;
    if (isStraight) return PokerRank.Straight;
    if (maxCount === 3) return PokerRank.ThreeOfKind;
    if (counts.filter(c => c === 2).length === 2) return PokerRank.TwoPairs;
    if (maxCount === 2) return PokerRank.OnePair;
    return PokerRank.HighCard;
}

/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    const lines = figure.trim().split('\n');
    const height = lines.length;
    const width = lines[0].length;
    const used = Array(height).fill().map(() => Array(width).fill(false));

    function isRectangle(x1, y1, x2, y2) {
        if (x2 >= width || y2 >= height) return false;
        if (lines[y1][x1] !== '+' || lines[y1][x2] !== '+' ||
            lines[y2][x1] !== '+' || lines[y2][x2] !== '+') return false;

        for (let x = x1 + 1; x < x2; x++) {
            if (lines[y1][x] !== '-' || lines[y2][x] !== '-') return false;
        }

        for (let y = y1 + 1; y < y2; y++) {
            if (lines[y][x1] !== '|' || lines[y][x2] !== '|') return false;
        }

        return true;
    }

    function markUsed(x1, y1, x2, y2) {
        for (let x = x1; x <= x2; x++) {
            used[y1][x] = used[y2][x] = true;
        }
        for (let y = y1; y <= y2; y++) {
            used[y][x1] = used[y][x2] = true;
        }
    }

    function getRectangleString(x1, y1, x2, y2) {
        let result = [];
        for (let y = y1; y <= y2; y++) {
            let line = '';
            for (let x = x1; x <= x2; x++) {
                line += lines[y][x];
            }
            result.push(line);
        }
        return result.join('\n') + '\n';
    }

    for (let y1 = 0; y1 < height; y1++) {
        for (let x1 = 0; x1 < width; x1++) {
            if (lines[y1][x1] !== '+' || used[y1][x1]) continue;
            for (let y2 = y1 + 2; y2 < height; y2++) {
                for (let x2 = x1 + 2; x2 < width; x2++) {
                    if (isRectangle(x1, y1, x2, y2)) {
                        yield getRectangleString(x1, y1, x2, y2);
                        markUsed(x1, y1, x2, y2);
                    }
                }
            }
        }
    }
}

module.exports = {
    parseBankAccount: parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};