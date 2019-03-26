const IPv4MAX = Math.pow(2, 32) - 1;
const IPv6MAX = Math.pow(2, 128) - 1;

/**
* Represents a single IP address v4 or v6.
* @class IP
* @param {string} address
*
* host = new IP("184.170.96.196");
* @return {object} -> IP{address:"184.170.96.196", version: 4}
*/

class IP {
    /**
    * Represents an IP address.
    * @constructor
    */
    constructor (address) {
        this.address = _parseAddress(address, this.version);
        //this.address = address;
        this.version = _parseVersion(address);
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
} //IP class end



// Private methods


/**
* parseAddress - Validates this IP address.
* @private
* @return {string} as a valid address
*/
const _parseAddress = (addr, ver) => {
    // let splittedAddr = this.address.split('.');
    // if (splittedAddr.length <= 4 && _isOctet(splittedAddr)) {
    //     this.version = 4;
    // } else {
    //     throw new Error('Tips: Please, enter a valid IP address');
    // }

    return addr;
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
        throw new Error('Tips: Please, enter a valid IP address ("127.1.0.0" OR "127.1" OR 3098173636 OR "2001:0db8:0000:0000:0000:ff00:0042:8329" OR "2001:db8:0:0:0:ff00:42:8329")');
    }
};

/**
* _isHextet - Validates hextets.
* @private
* @return {boolean} whether splitted address contains just hextets or not
*/
const _isHextet = (splittedAddr) => {
    const regex = /^[0-9a-f]{4}$/i;
    const isValid = function (hextet) {
        return regex.test(hextet);
    };
    return splittedAddr.every(isValid);
};

/**
* _isOctet - Validates octets.
* @private
* @return {boolean} whether splitted address contains just octets or not
*/
const _isOctet = (splittedAddr) => {
    const isValid = function (octet) {
        return ( (octet <= 255 && octet >= 0) ? true : false );

    };
    return splittedAddr.every(isValid);
};




let ip = new IP("fnjdsakil6");
console.log(ip);
//console.log(ip.toLong());
//console.log(ip.toDottedNotation(ip.toLong()));
