const IPv4MAX = Math.pow(2, 32) - 1;
const IPv6MAX = Math.pow(2, 128) - 1;

/**
* Represents a single IP address v4 or v6.
* @class IP
* @param {string} address
* host = new IP("184.170.96.196");
* @return {object} -> IP{address:"184.170.96.196", version: 4}
*/

class IP {
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
        if (this.version === 4) {
            let splittedAddr = this.address.split('.').reverse();
            let long = splittedAddr.reduce(function (long, octet, index) {
                return (octet * Math.pow(256, index) + long
                )}, 0);
            return long;
        } else {
            let splittedAddr = this.address.split(':');
            console.log(splittedAddr);
            let long = 0;
            for (let i = 0; i < splittedAddr.length; i++){
                //console.log( parseInt(splittedAddr[i], 16) );
                long = parseInt(splittedAddr[i], 16) + long;

            }
            console.log(long);
            return long;
        }
    }

    /**
    * toDottedNotation - Converts long IP to dotquad or hextet representation
    * @param {integer} long
    * @return {string} -> "184.170.96.196"
    */
    toDottedNotation(long) {
        return (
            [ (long>>>24), (long>>16 & 255), (long>>8 & 255),(long & 255)
            ].join('.')
        );
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
    * toRepresentation - Converts shortened version to canonical representation of the IP.
    * IP('::1').toRepresentation
    * @return {string} -> "fe80:0000:0000:0000:abde:3eff:ffab:0012/64"
    */
    toRepresentation() {
        return 'to representation';
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
        if (typeof addr === 'number') { // have an issue if number is inside quotes
            if (addr > IPv6MAX || addr < 0) {
                throw new Error('Tips: IP address cant be bigger than 2 to the 128-th power or negative number');
            } else if (addr <= IPv4MAX) {
                return 4;
            } else if (addr > IPv4MAX) {
                return 6; }
        } else if ( addr.includes('.') ) {
            return 4;
        } else if ( addr.includes(':') ) {
            return 6;
        } else {
            throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0", long integer, short or long IPv6)');
        }
    }

    /**
    * checkAddress - Validates this IP address.
    * @private
    * @return {string} as a valid address
    */
    _checkAddress (addr, ver) {
        if (typeof addr === 'number') {
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
                return addr; //this.toRepresentation(addr, ver);
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
            if (splittedAddr.length < 4) { this.short = splittedAddr.join('.'); }
            const isValid = function (octet) {
                return ( (octet <= 255 && octet >= 0) ? true : false );
            };

            return splittedAddr.every(isValid);
        } else {
            throw new Error('Tips: IPv4 cannot contain more than 4 bytes');
        }
    }

    /**
     * _isShort - checks if IPv6 addres was compressed and removes empty strings for future validation
     *
     * @param  {array} splittedAddr
     * @return {array} with both results boolean and cleaned array
     */
    _isShort (splittedAddr) {
        let isShort = false;
        let cleanedAddr = [...splittedAddr];
        for (let i=0; i < cleanedAddr.length; i++) {
            //removes empty strings in case of compressed notation "1234::1234:1234 and marks addr was shortened"
            if (cleanedAddr[i].length === 0) {
                cleanedAddr.splice(i, 1);
                isShort = true;
            } else if (cleanedAddr[i].length < 4) {
                //checks if IP was
                // compressed by removing leading zeros like "234:f:34:34"
                isShort = true;
            }
        }
        return [isShort, cleanedAddr];
    }

}//IP class end





let test = new IP("2001:0db8:0000:0000:0000:ff00:0042:8329");
console.log(test);
console.log(test.toLong());
//console.log(test.toDottedNotation(test.toLong()));
// 536936448 + 230162432 + 4278190080 + 4325376 + 2200502272
