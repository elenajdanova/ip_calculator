const IPv4MAX = Math.pow(2, 32) - 1;
const IPv6MAXbig = (2n ** 128n) - 1n;

/**
* Represents a single IP address v4 or v6.
* @class IP
* @param {string} address
* host = new IP("184.170.96.196");
* @return {object} -> IP{address:"184.170.96.196", version: 4}
*/

export default class IP {
    /**
    * @constructor
    */
    constructor (address) {
        this.long = 0;
        this.short = 0;
        this.version = this._checkVersion(address);
        this.address = this._checkAddress(address, this.version);
    }


    // Public methods

    /**
    * printVersion - Prints this IP version.
    * @return {integer} -> version: 4
    */
    printVersion () {
        return this.version;
    }

    /**
    * printInfo - Shows IANA allocation information for the current IP address.
    * @return {string} ->LOOPBACK
    */
    printInfo () {
        return;
    }

    /**
    * toLong - Converts dotquad or hextet IP to long
    * @return {integer} -> 2130706432
    */
    toLong () {
        let long;
        if (this.version === 4) {
            let splittedAddr = this.address.split('.').reverse();
            long = splittedAddr.reduce(function (long, octet, index) {
                return (octet * Math.pow(256, index) + long
                )}, 0);
        } else {
            let joinedAddr = this.address.split(':').join('');
            long = parseInt(joinedAddr, 16);
        }
        return long;
    }


    /**
    * toDottedNotation - Converts big integer IP to full dotquad or hextet representation
    * @param {integer} bigInt
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
    * @return {string} -> 01111111.00000000.00000000.00000001
    */
    toBinary() {
        return;
    }

    /**
    * toHEX - Converts decimal IP to full-length binary representation.
    * @return {string} -> 7f000001
    */
    toHEX() {
        return;
    }

    /**
    * toCompressed - Compress an IP address to its shortest possible form.
    * IP('127.0.0.1').toCompressed
    * @return {string} -> "127.1"
    */
    toCompressed() {
        return;
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
                if (addr > IPv6MAXbig || addr <= 0) {
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
    _checkAddress (addr, ver) {
        const reNum = /^[0-9]+$/;
        if ( reNum.test(addr) ) {
            this.long = addr;
            return this.toDottedNotation(addr);
        }

        const marks = {
            4: ['.', this._isIPv4, 4],
            6: [':', this._isIPv6, 8]
        };
        let splittedAddr = addr.split( marks[ver][0] );
        if ( marks[ver][1].call(this, splittedAddr) ) {
            if (splittedAddr.length === marks[ver][2] && this.short === 0) {
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
                i--;
                // for addr '::1' can happen that there are 2 empty strings
                // together, so by i-- we check every el of array but not next but one
            } else if (cleanedAddr[i].length < 4) {
                isShort = true;
            }
        }
        return [isShort, cleanedAddr];
    }

    /**
    * toRepresentation - Converts shortened version to canonical representation of the IP.
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





//let test = new IP("0.0.0.0");
//console.log(test);
//console.log(test.toLong());
//console.log(test.toDottedNotation(test.toLong()));
// 536936448 + 230162432 + 4278190080 + 4325376 + 2200502272
