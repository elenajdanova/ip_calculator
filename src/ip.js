import { IPv4MAX, IPv6MAX } from '../index.js';

/**
* Represents a single IP address v4 or v6.
* @class IP
* @param {string} address
* host = new IP("184.170.96.196");
* @return {object} -> IP{address:"184.170.96.196", version: 4, integer: 0, short: 0}
*/

export default class IP {
    /**
    * @constructor
    */
    constructor (address) {
        this.integer = 0;
        this.short = 0;
        this.version = this._checkVersion(address);
        this.address = this._checkAddress(address, this.version);
    }

    // Public methods

    /**
    * printInfo - Shows IANA allocation information for the current IP address.
    * @return {string} ->LOOPBACK
    */
    printInfo () {
        return;
    }

    /**
    * toInteger - Converts dotquad or hextet IP to integer
    * @return {BigInt} -> 2130706432
    */
    toInteger () {
        let bigInt;
        if (this.version === 4) {
            let splittedAddr = this.address.split('.').reverse();
            bigInt = splittedAddr.reduce(function (bigInt, octet, index) {
                return (octet * Math.pow(256, index) + bigInt
                )}, 0);
        } else {
            let joinedAddr = this.address.split(':').join('');
            bigInt = BigInt('0x' + joinedAddr);
        }
        this.integer = bigInt;
        return bigInt;
    }

    /**
    * toDottedNotation - Converts big integer IP to full dotquad or hextet representation
    * @param {bigint} bigInt
    * @return {string} -> "184.170.96.196"
    */
    toDottedNotation(bigInt) {
        if (this.version === 4) {
            return (
                [ (bigInt>>>24), (bigInt>>16 & 255), (bigInt>>8 & 255),
                    (bigInt & 255)
                ].join('.')
            );
        } else {
            let hex = bigInt.toString(16);
            let groups = [];
            while (hex.length < 32) { hex = '0' + hex; }
            for (let i = 0; i < 8; i++) {
                groups.push(hex.slice(i * 4, (i + 1) * 4));
            }
            return groups.join(':');
        }
    }

    /**
    * toBinary - Converts decimal IP to full-length binary representation.
    * @return {string} -> 01111111000000000000000000000001
    */
    toBinary() {
        if (this.integer === 0) {
            this.toInteger();
        }
        let binary = this.integer.toString(2);
        let v = this.version;
        let marks = { 4: 32, 6: 128 };

        if ( binary.length < marks[v] ) {
            while (binary.length < marks[v]) {
                binary = '0' + binary;
            }
        }
        return binary;
    }

    /**
    * toHEX - Converts both IP versions to hexadecimal representation.
    * @return {string} -> 7f000001
    */
    toHEX() {
        if (this.integer === 0) {
            this.toInteger();
        }
        return this.integer.toString(16);
    }

    /**
    * toCompressed - Compress an IP address to its shortest possible form.
    * IP('127.1.0.0').toCompressed
    * @return {string} -> "127.1"
    */
    toCompressed() {
        if (this.version === 4) {
            let splittedAddr = this.address.split('.');
            let sRange = [[1, 3], [2, 2], [3, 1], [0,0]];

            for (let i = splittedAddr.length-1; i>=0; i--) {
                if (splittedAddr[i] === '0') {
                    continue;
                } else {
                    splittedAddr.splice(sRange[i][0], sRange[i][1]);
                    this.short = splittedAddr.join('.');
                    return this.short;
                }
            }
        } else {
            let splitted = this.address.split(':');
            // removing longest zero group
            let [startOfLongest, longestLength] = longestZerosGroup(splitted);
            let last = startOfLongest + longestLength;
            if ( last === 7) {
                longestLength++;
                splitted.push('');
            }
            splitted.splice(startOfLongest, longestLength, '');
            if (startOfLongest === 0) { splitted.unshift(''); }

            // removing leading zeros
            loopHex:
            for (let i = 0; i < splitted.length; i++) {
                if (splitted[i] === '0000') {
                    splitted.splice(i, 1, '0');
                    i++;
                }
                loopStr:
                for (let j = 0; j < splitted[i].length; j++) {
                    if (splitted[i][j] === '0') {
                        splitted[i] = splitted[i].substring(j+1);
                        j--;
                        continue;
                    } else {
                        break loopStr;
                    }
                }
            }
            this.short = splitted.join(':');
            return this.short;
        }
    }

    // Private methods

    /**
    * checkVersion - Determins this IP version.
    * @private
    * @param {string} addr
    * @return {number}  -> 4 or 6
    */
    _checkVersion (addr) {
        //matches all possible chars in both versions of IP
        const reGen = /^[0-9a-fn.:]+$/i;
        if ( reGen.test(addr) ) {
            //checks if there is .. and more or whole IP is just a dot
            const reDots = /\.{2,}|^\.{1}$/;
            //checks if there is ::: and more or whole IP is just a colon
            const reColon = /:{3,}|^:{1}$/;
            //checks if there is only digits and n in bigInt IP
            const reNum = /^[0-9n]+$/;

            if ( reNum.test(addr) ) {
                if (addr > IPv6MAX || addr <= 0) {
                    throw new Error('Tips: IP address cant be bigger than 2 to the 128-th power or negative number');
                } else if (addr <= IPv4MAX) {
                    return 4;
                } else if (addr > IPv4MAX) {
                    return 6; }
            } else if ( addr.includes('.') && !reDots.test(addr) ) {
                return 4;
            } else if ( addr.includes(':') && !reColon.test(addr) ) {
                return 6;
            }
        }
        throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0", long integer, short or long IPv6)');
    }

    /**
    * checkAddress - Validates this IP address.
    * @private
    * @return {string} as a valid address
    */
    _checkAddress (addr, v) {
        const reNum = /^[0-9]+$/;
        if ( reNum.test(addr) ) {
            this.integer = addr;
            return this.toDottedNotation(addr);
        }

        const marks = {
            4: ['.', this._isIPv4, 4],
            6: [':', this._isIPv6, 8]
        };
        let splittedAddr = addr.split( marks[v][0] );
        if ( marks[v][1].call(this, splittedAddr) ) { //TODO: make ifs more readable
            if (splittedAddr.length === marks[v][2] && this.short === 0) {
                return addr;
            } else {
                return this._toRepresentation(splittedAddr);
            }
        } else {
            throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0", long integer, short or long IPv6)');
        }
    }

    /**
    * _isIPv6 - Validates IPv6.
    * @private
    * @return {boolean} whether splitted address is valid IPv6 or not
    */
    _isIPv6 (splittedAddr) {
        if (splittedAddr.length <= 8) {
            let checked = false;
            let [isShort, cleanedAddr] = this._isShort(splittedAddr);

            const regex = /^[0-9a-f]{1,4}$/i;
            const isValid = function (hextet) {
                return regex.test(hextet);
            };
            checked = cleanedAddr.every(isValid);

            if (checked && isShort) { this.short = splittedAddr.join(':');}
            return checked;
        } else {
            throw new Error('Tips: IPv6 cannot contain more than 8 bytes');
        }
    }

    /**
    * _isIPv4 - Validates IPv4.
    * @private
    * @return {boolean} whether splitted address is valid IPv4 or not
    */
    _isIPv4 (splittedAddr) {
        if (splittedAddr.length <= 4) {
            if (splittedAddr.length < 4) { this.short = splittedAddr.join('.');}
            const isValid = function (octet) {
                return ( (octet <= 255 && octet >= 0) ? true : false );
            };
            return splittedAddr.every(isValid);
        } else {
            throw new Error('Tips: IPv4 cannot contain more than 4 bytes');
        }
    }

    /**
     * _isShort - checks if IPv6 addres was compressed like this "234:f:34:34:1:1:2:2" or like "1234::1234:1234" and removes empty strings for future validation
     * @private
     * @param  {array} splittedAddr
     * @return {array} with both results boolean and cleaned array
     */
    _isShort (splittedAddr) {
        let isShort = false;
        let cleanedAddr = [...splittedAddr];
        for (let i=0; i < cleanedAddr.length; i++) {
            if (cleanedAddr[i].length === 0) {
                cleanedAddr.splice(i, 1);
                isShort = true;
                i--; //code  chunk similar to toCompressed method
                // for addr '::1' can happen that there are 2 empty strings
                // together, so by i-- we check every el of array but not next but one
            } else if (cleanedAddr[i].length < 4) {
                isShort = true;
            }
        }
        return [isShort, cleanedAddr];
    }

    /**
    * toRepresentation - Converts short version to canonical representation of IP.
    * IP('::1').address
    * @private
    * @param  {array} splittedAddr
    * @return {string} -> "0000:0000:0000:0000:0000:0000:0000:0001"
    */
    _toRepresentation(splittedAddr) {
        if ( this.version === 4 ) {
            for (let i = 0; i <= 4; i++) {
                if (splittedAddr[i] === '') {
                    let missOcts = 5 - splittedAddr.length;
                    let flag = true;
                    while (missOcts > 0) {
                        if (flag) {
                            splittedAddr.splice(i, 1, '0');
                            missOcts--;
                            flag = false;
                        } else {
                            splittedAddr.splice(i, 0, '0');
                            missOcts--;
                        }
                    }
                }
            }
            while (splittedAddr.length < 4) {
                splittedAddr.push('0');
            }
            return splittedAddr.join('.');
        } else {
            for (let i = 0; i <= 8; i++) {
                if (splittedAddr[i] === '') {
                    let missHex = 9 - splittedAddr.length;
                    let flag = true;
                    while (missHex > 0) {
                        if (flag) {
                            splittedAddr.splice(i, 1, '0000');
                            missHex--;
                            flag = false;
                        } else {
                            splittedAddr.splice(i, 0, '0000');
                            missHex--;
                        }
                    }
                }
            }
            for (let i = 0; i < splittedAddr.length; i++) {
                if (splittedAddr[i].length < 4) {
                    let missNum = 4 - splittedAddr[i].length;
                    while (missNum > 0) {
                        splittedAddr[i] = '0' + splittedAddr[i];
                        missNum--;
                    }
                }
            }
        }
        return splittedAddr.join(':');
    }


}//IP class end


/**
 * longestZerosGroup - Helper fn counting longest consecutive zeros for shortening IPv6
 * "0000:0000:0000:0000:0000:0000:0000:0001"
 * @private
 * @param  {array} zeros
 * @return {array} -> [0, 7]
 */
const longestZerosGroup = (splittedAddr) => {
    let current = 0;
    let currentLongest = 0;
    let startOfLongest = 0;
    while (current < splittedAddr.length - 2) {
        let startOfRun = current;
        while (current < splittedAddr.length - 1 &&
              splittedAddr[current] === '0000') {
            current++;
        }
        if (current - startOfRun > currentLongest) {
            startOfLongest = startOfRun;
            currentLongest = current - startOfRun;
        }
        current++;
    }
    return [startOfLongest, currentLongest];
};


// console.log( ip = new IP('2002:babe::abc:2:3') );
// console.log(ip.toInteger());
