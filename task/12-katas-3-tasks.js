'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    const rows = puzzle.length;
    const cols = puzzle[0].length;
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));

    function dfs(row, col, index) {
        if (index === searchStr.length) return true;
        if (row < 0 || row >= rows || col < 0 || col >= cols || visited[row][col]) return false;
        if (puzzle[row][col] !== searchStr[index]) return false;

        visited[row][col] = true;
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
        for (const [dr, dc] of directions) {
            if (dfs(row + dr, col + dc, index + 1)) return true;
        }
        visited[row][col] = false;
        return false;
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (dfs(i, j, 0)) return true;
        }
    }
    return false;
}

/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    function permute(str, prefix = '') {
        if (str.length === 0) yield prefix;
        for (let i = 0; i < str.length; i++) {
            const curr = str[i];
            const remaining = str.slice(0, i) + str.slice(i + 1);
            yield * permute(remaining, prefix + curr);
        }
    }
    yield* permute(chars);
}

/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let profit = 0;
    let buySum = 0;
    let buyCount = 0;
    let maxPrice = 0;

    for (let i = quotes.length - 1; i >= 0; i--) {
        if (quotes[i] > maxPrice) {
            profit += buyCount * (quotes[i] - maxPrice);
            maxPrice = quotes[i];
            buySum = 0;
            buyCount = 0;
        } else {
            buySum += quotes[i];
            buyCount++;
            profit += maxPrice - quotes[i];
        }
    }

    return profit;
}

/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789-_.~!*'();:@&=+$,/?#[]";
    this.base = this.urlAllowedChars.length;
}

UrlShortener.prototype = {
    encode: function (url) {
        let num = 0n;
        for (let i = 0; i < url.length; i++) {
            num = num * BigInt(this.base) + BigInt(this.urlAllowedChars.indexOf(url[i]));
        }

        let short = '';
        while (num > 0) {
            short = this.urlAllowedChars[Number(num % BigInt(this.base))] + short;
            num = num / BigInt(this.base);
        }
        return short || this.urlAllowedChars[0];
    },

    decode: function (code) {
        let num = 0n;
        for (let i = 0; i < code.length; i++) {
            num = num * BigInt(this.base) + BigInt(this.urlAllowedChars.indexOf(code[i]));
        }

        let url = '';
        while (num > 0) {
            url = this.urlAllowedChars[Number(num % BigInt(this.base))] + url;
            num = num / BigInt(this.base);
        }
        return url;
    }
};

module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};