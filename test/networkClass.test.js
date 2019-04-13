import Network from '../src/network.js';

describe('IPv4 test ALL network methods for 192.168.114.42', () => {
    const net = new Network('192.168.114.42', 24);

    test('test _checkPrefix method', () => {
        expect(net).toEqual({"address": "192.168.114.42", "integer": 0, "prefix": BigInt('24'), "short": 0, "version": 4});
    });

    test('test maskToInteger method', () => {
        expect(net.maskToInteger()).toBe(BigInt('4294967040'));
    });

    test('test networkToInteger method', () => {
        expect(net.networkToInteger()).toBe(BigInt('3232264704'));
    });

    test('test getNetwork method', () => {
        expect(net.getNetwork()).toBe('192.168.114.0');
    });

    test('test broadcastToLong method', () => {
        expect(net.broadcastToLong()).toBe(BigInt('3232264959'));
    });

    test('test getBroadcast method', () => {
        expect(net.getBroadcast()).toBe('192.168.114.255');
    });
});

describe('IPv6 test ALL network methods for FE80:0000:0000:0000:0202:B3FF:FE1E:8329', () => {
    const net = new Network('FE80:0000:0000:0000:0202:B3FF:FE1E:8329', 42);

    test('test _checkPrefix method', () => {
        expect(net).toEqual({"address": "FE80:0000:0000:0000:0202:B3FF:FE1E:8329", "integer": 0, "prefix": BigInt('42'), "short": 0, "version": 6});
    });

    test('test maskToInteger method', () => {
        expect(net.maskToInteger()).toBe(BigInt('340282366920861092210919271164587016192'));
    });

    test('test networkToInteger method', () => {
        expect(net.networkToInteger()).toBe(BigInt('338288524927261089654018896841347694592'));
    });

    test('test getNetwork method', () => {
        expect(net.getNetwork()).toBe('fe80:0000:0000:0000:0000:0000:0000:0000');
    });

    test('test broadcastToLong method', () => {
        expect(net.broadcastToLong()).toBe(BigInt('338288524927338460906474233108528889855'));
    });
});
