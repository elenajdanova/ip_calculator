/**
* Represents a single IP address v4 or v6.
* @class IP
* @param {string} address
*
* host = new IP("184.170.96.196");
* @return {object} -> IP{address:"184.170.96.196", version: 4}
*/

export class IP {
    /**
    * Represents an IP address.
    * @constructor
    */
    constructor (address) {
        this.address = address;
        this.version = NaN;
        this.isValid = parseInput();
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

    }

    /**
    * toDottedNotation - Converts long IP to dotquad or hextet representation
    * @param {integer} long
    * @return {string} -> "184.170.96.196"
    */
    toDottedNotation(long) {

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
}//IP class end


// Private methods


/**
* parseInput - Validates user input.
* @return {boolean} whether input is valid or not
*/
const parseInput = () => {
    return 'Hi';
};



let ip = new IP('123.7.56.9');
