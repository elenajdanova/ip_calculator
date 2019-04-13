import IP from './ip.js';
import { IPv4MAX, IPv6MAX } from '../index.js';

/**
* Network slice calculations.
* @class Network
* @param {string} address
* @param {integer} prefix
* host = new IP("127.128.99.3",8)
* @return {object} -> IP{address:"127.128.99.3", prefix: 8}
*/

export default class Network extends IP {
    /**
    * Extends IP class. Calls the parent class IP with the parameters passed to Network.
    * @constructor
    */
    constructor (address, prefix) {
        super(address);
        this.prefix = this._checkPrefix(prefix);
    }

    /**
    * _checkPrefix - Returns this IP prefix and validates it
    * @return {integer} -> prefix: 25n
    */
    _checkPrefix (prefix) {
        if (this.version === 4) {
            if (prefix > 0 && prefix <= 32) {
                return BigInt(prefix);
            }
        } else {
            if (prefix > 0 && prefix <= 128) {
                return BigInt(prefix);
            }
        }
        throw new Error('Tips: Invalid prefix');
    }

    /**
    * maskToInteger - Returns network mask as bigInt
    * @return {BigInt} -> 4278190080n
    */
    maskToInteger () {
        if (this.version == 4) {
            return (IPv4MAX >> (32n - this.prefix)) << (32n - this.prefix);
        }
        else {
            return (IPv6MAX >> (128n - this.prefix)) << (128n - this.prefix);
        }
    }

    /**
    * networkToInteger - Returns network as bigInt.
    * @return {BigInt} -> 21307064320
    */
    networkToInteger () {
        return this.toInteger() & this.maskToInteger();
    }

    /**
    * getNetwork - Returns network part of the address
    * @return {string} -> 127
    */
    getNetwork () {
        let network = this.toDottedNotation(this.networkToInteger());
        return this.toCompressed(network, this.version);
    }

    /**
    * getBroadcast - Calculates broadcast.IPv6 doesn't have a broadcast address, but it's used for other calculations such as Network.hostLast.
    * @return {string} -> 127.255.255.255
    */
    getBroadcast () {
        return this.toDottedNotation(this.broadcastToLong());
    }

    /**
    * broadcastToLong - Returns broadcast as long.
    * @return {BigInt} ->2147483647
    */
    broadcastToLong () {
        if (this.version === 4) {
            return this.networkToInteger() | (IPv4MAX - this.maskToInteger());
        } else {
            return this.networkToInteger() | (IPv6MAX - this.maskToInteger());
        }
    }

    /**
    * hostFirst - Calculates first available host in this subnet.
    * @return {string} ->127.0.0.1
    */
    hostFirst () {
        let isSmall4 = this.version === 4 && this.prefix > 30;
        let isSmall6 = this.version === 6 && this.prefix > 126;
        if (isSmall4 || isSmall6) {
            return this.address;
        } else {
            let host = this.toDottedNotation(this.networkToInteger() + 1n);
            return this.toCompressed (host, this.version);
        }
    }

    /**
    * hostLast - Calculates last available host in this subnet.
    * @return {string} ->127.255.255.255
    */
    hostLast () {
        let isLast4 = this.version === 4 && this.prefix === 32;
        let isLast6 = this.version === 6 && this.prefix === 128;
        let isPrev4 = this.version === 4 && this.prefix === 31;
        let isPrev6 = this.version === 6 && this.prefix === 127;

        if (isLast4 || isLast6) {
            return this.address;
        } else if (isPrev4 || isPrev6) {
            return this.toDottedNotation(this.toInteger + 1n);
        } else if (this.version === 4) {
            return this.toDottedNotation(this.broadcastToLong() - 1n);
        } else {
            return this.toDottedNotation(this.broadcastToLong());
        }
    }

    /**
    * contains - Check if the given otherIP is part of the network
    * @param {IP} thisIP
    * @param {Network} otherIP
    * @return {boolean}
    */
    contains (thisIP, otherIP) {
        return;
    }

    /**
    * hostRange - Generates a range of usable host IP addresses within the network.
    * @return {array} -> ['127.0.0.1','127.255.255.255']
    */
    hostRange () {
        let range = [];
        range.push(this.hostFirst());
        range.push(this.hostLast());
        return range;
    }

    /**
    * networkSize - Returns number of ips within the network.
    * @return {number} -> 16777214
    */
    networkSize () {
        let marks = {4: 32n, 6: 128n};
        let size = 2n ** (marks[this.version] - this.prefix);
        return (this.version === 4) ? size - 2n : size;

    }
} // end Network class
