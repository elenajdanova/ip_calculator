import IP from './ip.js';
import { IPv4MAX, IPv6MAXbig } from '../index.js';

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
    * @return {integer} -> prefix: 25
    */
    _checkPrefix (prefix) {
        if (this.version === 4) {
            if (prefix > 0 && prefix < 32) {
                return prefix;
            }
        } else {
            if (prefix > 0 && prefix < 128) {
                return prefix;
            }
        }
        throw new Error('Tips: Invalid prefix');
    }

    /**
    * getMask - Returns network mask from the prefix
    * @return {string} -> 255.0.0.0
    */
    getMask () {
        return;
    }

    /**
    * getNetwork - Returns network part of the address
    * @return {string} -> 127.0.0.0
    */
    getNetwork () {
        return;
    }

    /**
    * networkToLong - Returns network as long.
    * @return {integer} -> 2130706432
    */
    networkToLong () {
        return;
    }

    /**
    * computeBroadcast - Calculates broadcast.IPv6 doesn't have a broadcast address, but it's used for other calculations such as Network.hostLast.
    * @return {string} -> 127.255.255.255
    */
    computeBroadcast () {
        return;
    }

    /**
    * broadcastToLong - Returns broadcast as long.
    * @return {integer} ->2147483647
    */
    broadcastToLong () {
        return;
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
