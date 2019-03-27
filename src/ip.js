const IPv4MAX = Math.pow(2, 32) - 1;
const IPv6MAX = Math.pow(2, 128) - 1;

/**
* Represents a single IP address v4 or v6.
* @class IP
* @param {string} address
* @param {number} [version = NaN]
* @param {boolean} [isValid = null]
*
* host = new IP("184.170.96.196");
* @return {object} -> IP{address:"184.170.96.196", version: 4}
*/

class IP {
    /**
    * Represents an IP address.
    * @constructor
    */
    constructor (address, version = NaN, isValid = null ) {
        if (isValid === true) {
            this.address = address;
            this.version = version;
            this.isValid = isValid;
        } else {
            this.version = _parseVersion(address);
            this.address = _parseAddress(address, this.version);
        }

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
    toDottedNotation(long, ver) {
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
} //IP class end



// Private methods


/**
* parseAddress - Validates this IP address.
* @private
* @return {string} as a valid address
*/
const _parseAddress = (addr, ver) => {
    if (typeof addr === 'number') {
        let ip = new IP(addr, ver, true);
        //console.log(ip instanceof IP);
        return ip.toDottedNotation(addr, ver);
    }

    const marks = {
        4: ['.', _isIPv4, 4],
        6: [':', _isIPv6, 8]
    };
    let splittedAddr = addr.split( marks[ver][0] );
    if ( marks[ver][1](splittedAddr) ) {
        if (splittedAddr.length === marks[ver][2]) {
            return addr;
        } else {
            let ip = new IP(addr, ver, true);
            return ip.toRepresentation(addr, ver);
        }
    } else {
        throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0" OR compressed version OR 3098173636 OR "2001:0db8:0000:0000:0000:ff00:0042:8329")');
    }
};

/**
* parseVersion - Determins this IP version.
* @private
* @return {number}  -> 4 or 6
*/
const _parseVersion = (addr) => {
    if (typeof addr === 'number') { // have an issue if number is inside quotes
        if (addr > IPv6MAX) {
            throw new Error('Tips: IP address cant be bigger than 2 to the 128-th power');
        } else if (addr <= IPv4MAX) {
            return 4;
        } else if (addr > IPv4MAX) {
            return 6; }
    } else if ( addr.includes('.') ) {
        return 4;
    } else if ( addr.includes(':') ) {
        return 6;
    } else {
        throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0" OR compressed version OR 3098173636 OR "2001:0db8:0000:0000:0000:ff00:0042:8329")');
    }
};

/**
* _isIPv6 - Validates IPv6.
* @private
* @return {boolean} whether splitted address is valid IPv6 or not
*/
const _isIPv6 = (splittedAddr) => {
    if (splittedAddr.length <= 8) {
        const regex = /^[0-9a-f]{4}$/i; //regex is not valid for compressed notation
        const isValid = function (hextet) {
            return regex.test(hextet);
        };
        return splittedAddr.every(isValid);
    } else {
        throw new Error('Tips: IPv6 cannot contain more than 8 bites');
    }
};

/**
* _isIPv4 - Validates IPv4.
* @private
* @return {boolean} whether splitted address is valid IPv4 or not
*/
const _isIPv4 = (splittedAddr) => {
    if (splittedAddr.length <= 4) {
        const isValid = function (octet) {
            return ( (octet <= 255 && octet >= 0) ? true : false );
        };
        return splittedAddr.every(isValid);
    } else {
        throw new Error('Tips: IPv4 cannot contain more than 4 bites');
    }
};




let test = new IP('3006:1547:0888:90ef:abcd');
console.log(test);
//console.log(test.toLong());
//console.log(test.toDottedNotation(ip.toLong()));
