import IP from './ip.js';
import { IPv4MAX, IPv6MAX } from '../index.js';


//IP range specific information, see IANA allocations.
// http://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml
let _ipv4Registry = new Map([
    ['0.0.0.0', [8, 'This host on this network']],
    ['10.0.0.0', [8, 'Private-Use']],
    ['100.64.0.0', [10, 'Shared Address Space']],
    ['127.0.0.0', [8, 'Loopback']],
    ['169.254.0.0', [16, 'Link Local']],
    ['172.16.0.0', [12, 'Private-Use']],
    ['192.0.0.0', [24, 'IETF Protocol Assignments']],
    ['192.0.0.0', [29, 'IPv4 Service Continuity Prefix']],
    ['192.0.0.8', [32, 'IPv4 dummy address']],
    ['192.0.0.9', [32, 'Port Control Protocol Anycast']],
    ['192.0.0.10', [32, 'Traversal Using Relays around NAT Anycast']],
    ['192.0.0.170', [32, 'NAT64/DNS64 Discovery']],
    ['192.0.0.171', [32, 'NAT64/DNS64 Discovery']],
    ['192.0.2.0', [24, 'Documentation (TEST-NET-1)']],
    ['192.31.196.0', [24, 'AS112-v4']],
    ['192.52.193.0', [24, 'AMT']],
    ['192.88.99.0', [24, 'Deprecated (6to4 Relay Anycast)']],
    ['192.168.0.0', [16, 'Private-Use']],
    ['192.175.48.0', [24, 'Direct Delegation AS112 Service']],
    ['198.18.0.0', [15, 'Benchmarking']],
    ['198.51.100.0', [24, 'Documentation (TEST-NET-2)']],
    ['203.0.113.0', [24, 'Documentation (TEST-NET-3)']],
    ['240.0.0.0', [4, 'Reserved']],
    ['255.255.255.255', [32, 'Limited Broadcast']]
  ]);

//https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml
let _ipv6Registry = new Map([
    ['255.255.255.255', [32, 'Limited Broadcast']],
    ['::1', [128, 'Loopback Address']],
    ['::', [128, 'Unspecified Address']],
    ['::', [128, 'Unspecified Address']],
    ['::ffff:0:0', [98, 'IPv4-mapped Address']],
    ['64:ff9b::', [96, 'IPv4-IPv6 Translat.']],
    ['64:ff9b:1::', [48, 'IPv4-IPv6 Translat.']],
    ['100::', [64, 'Discard-Only Address Block']],
    ['2001::', [23, 'IETF Protocol Assignments']],
    ['2001::', [32, 'TEREDO']],
    ['2001:1::1', [128, 'Port Control Protocol Anycast']],
    ['2001:1::2', [128, 'Traversal Using Relays around NAT Anycast']],
    ['2001:2::', [48, 'Benchmarking']],
    ['2001:3::', [32, 'AMT']],
    ['2001:4:112::', [48, 'AS112-v6']],
    ['2001:5::', [32, 'EID Space for LISP (Managed by RIPE NCC)']],
    ['2001:10::', [28, 'Deprecated (previously ORCHID)']],
    ['2001:20::', [28, 'ORCHIDv2']],
    ['2001:db8::', [32, 'Documentation']],
    ['2002::', [16, '6to4']],
    ['2620:4f:8000::', [48, 'Direct Delegation AS112 Service']],
    ['fc00::', [7, 'Unique-Local']],
    ['fe80::', [10, 'Link-Local Unicast']]
]);

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

    // Private methods

    /**
    * _checkPrefix - Returns this IP prefix and validates it
    * @private
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

      // Public methods

    /**
    * printInfo - Shows IANA allocation information for the current IP address.
    * @return {string} ->LOOPBACK
    */
    printInfo () {
      let registry = {4: _ipv4Registry, 6: _ipv6Registry}
      for (let [addr, info] of registry[this.version].entries()) {
          let found = this.contains(this.address, addr, info[0]);
          if (found) { return info[1]; }
      }
      return 'UNKNOWN';
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
    * getBroadcast - Calculates broadcast.IPv6 doesn't have a broadcast
    * address, but it's used for other calculations such as Network.hostLast.
    * @return {string} -> 127.255.255.255
    */
    getBroadcast () {
        return this.version === 4 ?
        this.toDottedNotation(this.broadcastToLong()) :
        'IPv6 doesnt have broadcast address';
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
    * contains - Check if thisIP is part of the network
    * @param {string} thisIP
    * @param {string} otherIP
    * @param {number} prefix
    * @return {boolean}
    */
    contains (thisIP, otherIP, prefix) {
        let other = new Network(otherIP, prefix);
        let thisNetwork = this.networkToInteger();
        let otherNetwork = other.networkToInteger();
        let smaller = (thisNetwork <= otherNetwork) &&
            (otherNetwork <= this.broadcastToLong());
        let bigger = (otherNetwork <= thisNetwork) &&
            (thisNetwork <= other.broadcastToLong());
        return  smaller || bigger;
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
