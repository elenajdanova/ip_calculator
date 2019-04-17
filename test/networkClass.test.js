import Network from '../src/network.js';

describe('IPv4 test ALL network methods for 192.168.114.42', () => {
    const net = new Network('192.168.114.42', 24);

    test('test _checkPrefix method', () => {
        expect(net).toEqual({'address': '192.168.114.42', 'integer': 0, 'prefix': BigInt('24'), 'short': 0, 'version': 4});
    });

    test('test maskToInteger method', () => {
        expect(net.maskToInteger()).toBe(BigInt('4294967040'));
    });

    test('test networkToInteger method', () => {
        expect(net.networkToInteger()).toBe(BigInt('3232264704'));
    });

    test('test getNetwork method', () => {
        expect(net.getNetwork()).toBe('192.168.114');
    });

    test('test broadcastToLong method', () => {
        expect(net.broadcastToLong()).toBe(BigInt('3232264959'));
    });

    test('test getBroadcast method', () => {
        expect(net.getBroadcast()).toBe('192.168.114.255');
    });

    test('test hostFirst method', () => {
        expect(net.hostFirst()).toBe('192.168.114.1');
    });

    test('test hostLast method', () => {
        expect(net.hostLast()).toBe('192.168.114.254');
    });

    test('test hostRange method', () => {
        expect(net.hostRange()).toEqual(['192.168.114.1', '192.168.114.254']);
    });

    test('test networkSize method', () => {
        expect(net.networkSize()).toBe(BigInt('254'));
    });

    test('test contains method true', () => {
        expect(net.contains(net.address, '192.168.114.106', 24)).toBeTruthy();
    });

    test('test contains method false', () => {
        expect(net.contains(net.address, '205.16.114.106', 18)).toBeFalsy();
    });

    test('test printInfo method', () => {
        expect(net.printInfo()).toEqual('Private-Use');
    });
});

describe('Valid, test _checkPrefix method', () => {
    test.each`
    address                                      | prefix  | expected
    ${'192.168.98.2'}                            | ${1}    | ${{'address': '192.168.98.2', 'integer': 0, 'prefix': BigInt('1'), 'short': 0, 'version': 4}}
    ${'255.168.114.128'}                         | ${32}   | ${{'address': '255.168.114.128', 'integer': 0, 'prefix': BigInt('32'), 'short': 0, 'version': 4}}
    ${'10.'}                                     | ${18}   | ${{'address': '10.0.0.0', 'integer': 0, 'prefix': BigInt('18'), 'short': '10.', 'version': 4}}
    ${BigInt('1707620608')}                      | ${9}   | ${{'address': '101.200.57.0', 'integer': BigInt('1707620608'), 'prefix': BigInt('9'), 'short': 0, 'version': 4}}
    ${'2001:dead:beef:0051:c01d:c01a:abcd:0987'} | ${3}    | ${{'address': '2001:dead:beef:0051:c01d:c01a:abcd:0987', 'integer': 0, 'prefix': BigInt('3'), 'short': 0, 'version': 6}}
    ${'2002:babe::47b3:0:2:3'}                   | ${128}    | ${{'address': '2002:babe:0000:0000:47b3:0000:0002:0003', 'integer': 0, 'prefix': BigInt('128'), 'short': '2002:babe::47b3:0:2:3', 'version': 6}}
    ${'7201:dead:beef:4ac1:c01e:c01f:ffff:0fab'} | ${24}    | ${{'address': '7201:dead:beef:4ac1:c01e:c01f:ffff:0fab', 'integer': 0, 'prefix': BigInt('24'), 'short': 0, 'version': 6}}

    `('returns $expected validation for $prefix',({address, prefix, expected}) => {
    const net = new Network(address, prefix);
    expect(net).toEqual(expected);
});
});

describe('INvalid, test _checkPrefix method', () => {
    test.each`
    address                                       | prefix
    ${'192.168.98.2'}                             | ${0}
    ${'192.168.0.1'}                              | ${52}
    ${'255.168.114.128'}                          | ${-7}
    ${'10.'}                                      | ${103}
    ${'7201:dead:beef:4ac1:c01e:c01f:ffff:0fab'}  | ${203}
    ${'7201:dead:beef:4ac1:c01e:c01f:ffff:0fab'}  | ${0}
    `('returns $expected validation for $prefix',({address, prefix}) => {
    function prefixError() {
        const net = new Network(address, prefix);
        net;
    }
    expect(prefixError).toThrowError('Tips');
});
});

// //doesn't work with bigint
// describe('Valid, test maskToInteger method', () => {
//     test.each`
//     address                           | prefix  | expected
//     ${'192.168.98.2'}                 | ${6}    | ${BigInt('4227858432')}
//     ${'255.168.114.128'}              | ${17}   | ${BigInt('4294934528')}
//     ${'2001:dead:beef:0051::0987'}    | ${99}   | ${BigInt('42545004622471055030244605799126007808')}
//     ${'2002:babe::47b3:0:2:3'}        | ${70}   | ${BigInt('42549468040371534514001800278298329088')}
//
//     `('returns $expected int for $prefix',({address, prefix, expected}) => {
//     const net = new Network(address, prefix);
//     expect(net.maskToInteger()).toBe(expected);
// });
// });

describe('IPv6 test ALL network methods for FE80:0000:0000:0000:0202:B3FF:FE1E:8329', () => {
    const net = new Network('FE80:0000:0000:0000:0202:B3FF:FE1E:8329', 42);

    test('test _checkPrefix method', () => {
        expect(net).toEqual({'address': 'FE80:0000:0000:0000:0202:B3FF:FE1E:8329', 'integer': 0, 'prefix': BigInt('42'), 'short': 0, 'version': 6});
    });

    test('test maskToInteger method', () => {
        expect(net.maskToInteger()).toBe(BigInt('340282366920861092210919271164587016192'));
    });

    test('test networkToInteger method', () => {
        expect(net.networkToInteger()).toBe(BigInt('338288524927261089654018896841347694592'));
    });

    test('test getNetwork method', () => {
        expect(net.getNetwork()).toBe('fe80::');
    });

    test('test broadcastToLong method', () => {
        expect(net.broadcastToLong()).toBe(BigInt('338288524927338460906474233108528889855'));
    });

    test('test hostFirst method', () => {
        expect(net.hostFirst()).toBe('fe80::1');
    });

    test('test hostLast method', () => {
        expect(net.hostLast()).toBe('fe80:0000:003f:ffff:ffff:ffff:ffff:ffff');
    });

    test('test hostRange method', () => {
        expect(net.hostRange()).toEqual(['fe80::1', 'fe80:0000:003f:ffff:ffff:ffff:ffff:ffff']);
    });

    test('test networkSize method', () => {
        expect(net.networkSize()).toBe(BigInt('77371252455336267181195264'));
    });

    test('test contains method true', () => {
        expect(net.contains(net.address, 'fe80:0000:003f::cafe:00a5', 42)).toBeTruthy();
    });

    test('test contains method false', () => {
        expect(net.contains(net.address, '::beff:acff:dff5', 120)).toBeFalsy();
    });

    test('test printInfo method', () => {
        expect(net.printInfo()).toEqual('Link-Local Unicast');
    });
});
