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
        let octs = this.address.split('.').reverse();
        let long = octs.reduce(function (long, octet, index) {
            return (octet * Math.pow(256, index) + long
            )}, 0);
        return long;
    }

    /**
    * toDottedNotation - Converts long IP to dotquad or hextet representation
    * @param {integer} long
    * @return {string} -> "184.170.96.196"
    */
    toDottedNotation(long) {
        return (
            [ (long>>>24),
              (long>>16 & 255),
              (long>>8 & 255),
              (long & 255)
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
    * checkAddress - Validates this IP address.
    * @private
    * @return {string} as a valid address
    */
    _checkAddress (addr, ver) {
        if (typeof addr === 'number') {
            return this.toDottedNotation(addr);
        }

        const marks = {
            4: ['.', this._isIPv4, 4],
            6: [':', this._isIPv6, 8]
        };
        let splittedAddr = addr.split( marks[ver][0] );
        if ( marks[ver][1](splittedAddr) ) {
            if (splittedAddr.length === marks[ver][2]) {
                return addr;
            } else {
                return this.toRepresentation(addr, ver);
            }
        } else {
            throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0" OR compressed version OR 3098173636 OR "2001:0db8:0000:0000:0000:ff00:0042:8329")');
        }
    }

    /**
    * checkVersion - Determins this IP version.
    * @private
    * @param {string} addr
    * @return {number}  -> 4 or 6
    */
    _checkVersion (addr) {
        if (typeof addr === 'number') { // have an issue if number is inside quotes
            if (addr > IPv6MAX) {
                throw new Error('Tips: IP address cant be bigger than 2 to the 128-th power');
            } else if (addr <= IPv4MAX) {
                return 4;
            } else if (addr > IPv4MAX) { // !!!! not valid condition
                return 6; }
        } else if ( addr.includes('.') ) {
            return 4;
        } else if ( addr.includes(':') ) {
            return 6;
        } else {
            throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0" OR compressed version OR 3098173636 OR "2001:0db8:0000:0000:0000:ff00:0042:8329")');
        }
    }

    /**
    * _isIPv6 - Validates IPv6.
    * @private
    * @return {boolean} whether splitted address is valid IPv6 or not
    */
    _isIPv6 (splittedAddr) {
        if (splittedAddr.length <= 8) {
            const regex = /^[0-9a-f]{1,4}$/i;
            const isValid = function (hextet) {
                return regex.test(hextet);
            };
            return splittedAddr.every(isValid);
        } else {
            throw new Error('Tips: IPv6 cannot contain more than 8 bites');
        }
    }

    /**
    * _isIPv4 - Validates IPv4.
    * @private
    * @return {boolean} whether splitted address is valid IPv4 or not
    */
    _isIPv4 (splittedAddr) {
        if (splittedAddr.length <= 4) {
            const isValid = function (octet) {
                return ( (octet <= 255 && octet >= 0) ? true : false );
            };
            return splittedAddr.every(isValid);
        } else {
            throw new Error('Tips: IPv4 cannot contain more than 4 bites');
        }
    }
}//IP class end





let test = new IP('2001:db8l:ff00:42:8329');
console.log(test);
//console.log(test.toLong());
//console.log(test.toDottedNotation(test.toLong()));
