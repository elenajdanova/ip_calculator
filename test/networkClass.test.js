import Network from '../src/network.js';

describe('IPv4 test ALL network methods for 192.168.114.42', () => {
    const net = new Network('192.168.114.42', 24);

    test('test _checkPrefix method', () => {
        expect(net).toEqual({"address": "192.168.114.42", "integer": 0, "prefix": BigInt('24'), "short": 0, "version": 4});
    });

    test('test maskToInteger method', () => {
        expect(net.maskToInteger()).toBe(BigInt('4294967040'));
    });

    test('test getNetwork method', () => {
        expect(net.getNetwork()).toBe('192.168.114.0');
    });

});
