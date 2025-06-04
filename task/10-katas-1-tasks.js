'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 },
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    const sides = ['N', 'E', 'S', 'W'];
    const points = [];
    const steps = [0, 11.25, 22.5, 33.75];
    const names = [
        ['', 'b', '', 'b'],
        ['N', 'N', 'NE', 'E'],
        ['E', 'N', 'E', 'E'],
        ['S', 'S', 'SE', 'E'],
        ['W', 'S', 'W', 'W']
    ];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const idx = i * 4 + j;
            points[idx] = {
                abbreviation: names[0][j] + names[i + 1][j],
                azimuth: idx * 11.25
            };
        }
    }

    points[4].abbreviation = 'E';
    points[12].abbreviation = 'S';
    points[20].abbreviation = 'W';

    return points;
}

/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    function parse(str, pos) {
        let result = [''];
        while (pos < str.length) {
            if (str[pos] === '{') {
                const [options, newPos] = parseOptions(str, pos + 1);
                result = result.flatMap(prefix => options.map(opt => prefix + opt));
                pos = newPos;
            } else if (str[pos] === '\\') {
                pos++;
                result = result.map(prefix => prefix + (str[pos] || ''));
                pos++;
            } else {
                result = result.map(prefix => prefix + str[pos]);
                pos++;
            }
        }
        return result;
    }

    function parseOptions(str, pos) {
        let options = [''];
        let current = '';
        let braceLevel = 0;

        while (pos < str.length) {
            if (str[pos] === '{') {
                braceLevel++;
                current += str[pos];
            } else if (str[pos] === '}') {
                if (braceLevel > 0) {
                    braceLevel--;
                    current += str[pos];
                } else {
                    options = options.map(prefix => prefix + current);
                    return [options, pos + 1];
                }
            } else if (str[pos] === ',' && braceLevel === 0) {
                options = options.map(prefix => prefix + current);
                current = '';
            } else if (str[pos] === '\\') {
                pos++;
                current += str[pos] || '';
            } else {
                current += str[pos];
            }
            pos++;
        }
        options = options.map(prefix => prefix + current);
        return [options, pos];
    }

    for (const expanded of parse(str, 0)) {
        yield expanded;
    }
}

/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    let value = 0;
    let i = 0, j = 0;
    let up = true;

    while (value < n * n) {
        matrix[i][j] = value++;
        if (up) {
            if (j === n - 1) {
                i++;
                up = false;
            } else if (i === 0) {
                j++;
                up = false;
            } else {
                i--;
                j++;
            }
        } else {
            if (i === n - 1) {
                j++;
                up = true;
            } else if (j === 0) {
                i++;
                up = true;
            } else {
                i++;
                j--;
            }
        }
    }

    return matrix;
}

/**
 * Returns true if specified subset of dominoes can be placed in a row according to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    if (!dominoes.length) return true;

    function tryChain(used, current, target) {
        if (used.length === dominoes.length) return true;
        for (let i = 0; i < dominoes.length; i++) {
            if (!used.includes(i)) {
                const [a, b] = dominoes[i];
                if (current === a && tryChain([...used, i], b, target)) return true;
                if (current === b && tryChain([...used, i], a, target)) return true;
            }
        }
        return false;
    }

    for (let i = 0; i < dominoes.length; i++) {
        const [a, b] = dominoes[i];
        if (tryChain([i], b, a) || tryChain([i], a, b)) return true;
    }

    return false;
}

/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    if (!nums.length) return '';

    const result = [];
    let start = nums[0];
    let prev = nums[0];

    for (let i = 1; i <= nums.length; i++) {
        if (i === nums.length || nums[i] !== prev + 1) {
            if (start === prev) {
                result.push(`${start}`);
            } else if (prev - start === 1) {
                result.push(`${start},${prev}`);
            } else {
                result.push(`${start}-${prev}`);
            }
            if (i < nums.length) {
                start = nums[i];
                prev = nums[i];
            }
        } else {
            prev = nums[i];
        }
    }

    return result.join(',');
}

module.exports = {
    createCompassPoints,
    expandBraces,
    getZigZagMatrix,
    canDominoesMakeRow,
    extractRanges
};