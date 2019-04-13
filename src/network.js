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
            if (prefix > 0 && prefix < 32) {
                return BigInt(prefix);
            }
        } else {
            if (prefix > 0 && prefix < 128) {
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
    * @return {string} -> 127.0.0.0
    */
    getNetwork () {
        return this.toDottedNotation(this.networkToInteger());
    }

    /**
    * getBroadcast - Calculates broadcast.IPv6 doesn't have a broadcast address, but it's used for other calculations such as Network.hostLast.
    * @return {string} -> 127.255.255.255
    */
    getBroadcast () {
        return;
    }

    /**
    * broadcastToLong - Returns broadcast as long.
    * @return {integer} ->2147483647
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
        return;
    }

    /**
    * hostLast - Calculates last available host in this subnet.
    * @return {string} ->127.255.255.255
    */
    hostLast () {
        return;
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
        return;
    }

    /**
    * networkSize - Returns number of ips within the network.
    * @return {integer} -> 16777214
    */
    networkSize () {
        return;
    }
}// end Network class
