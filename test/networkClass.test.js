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
        expect(net.printInfo()).toEqual('Private Use');
    });
});

describe('Valid, testing printInfo method', () => {
    test.each`
    address              |prefix   | expected
    ${'192.168.98.2'}    | ${15}   | ${'Private Use'}
    ${'255.168.114.128'} | ${17}   | ${'Reserved'}
    ${'1:dead::987'}     | ${99}   | ${'UNKNOWN'}
    ${'2:be::b3:0:2:3'}  | ${70}   | ${'UNKNOWN'}
    `('returns $expected network for ip $address',({address, prefix, expected}) => {
    const net = new Network(address, prefix);
    expect(net.printInfo()).toEqual(expected);
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

describe('Valid, test maskToInteger method', () => {
    const addr = ['192.168.98.2', '255.168.114.128', '1:dead::987', '2:be::b3:0:2:3'];
    const prefix = [6, 17, 99, 70];
    const expected = [ BigInt('4227858432'), BigInt('4294934528'), BigInt('340282366920938463463374607431231340544'), BigInt('340282366920938463463086377055616499712')];

    test(`returns ${expected[0]} integer for ${addr[0]}`, () => {
        const net = new Network(addr[0], prefix[0]);
        expect(net.maskToInteger()).toBe(expected[0]);
    });

    test(`returns ${expected[1]} integer for ${addr[1]}`, () => {
        const net = new Network(addr[1], prefix[1]);
        expect(net.maskToInteger()).toBe(expected[1]);
    });

    test(`returns ${expected[2]} integer for ${addr[2]}`, () => {
        const net = new Network(addr[2], prefix[2]);
        expect(net.maskToInteger()).toBe(expected[2]);
    });

    test(`returns ${expected[3]} integer for ${addr[3]}`, () => {
        const net = new Network(addr[3], prefix[3]);
        expect(net.maskToInteger()).toBe(expected[3]);
    });
});

describe('Valid, test networkToInteger method', () => {
    const addr = ['192.168.98.2', '255.168.114.128', '1:dead::987', '2:be::b3:0:2:3'];
    const prefix = [6, 17, 99, 70];
    const expected = [ BigInt('3221225472'), BigInt('4289200128'), BigInt('9708698262660466193050469218123776'), BigInt('10399647067947365481203766009004032')];

    test(`returns ${expected[0]} integer for ${addr[0]}`, () => {
        const net = new Network(addr[0], prefix[0]);
        expect(net.networkToInteger()).toBe(expected[0]);
    });

    test(`returns ${expected[1]} integer for ${addr[1]}`, () => {
        const net = new Network(addr[1], prefix[1]);
        expect(net.networkToInteger()).toBe(expected[1]);
    });

    test(`returns ${expected[2]} integer for ${addr[2]}`, () => {
        const net = new Network(addr[2], prefix[2]);
        expect(net.networkToInteger()).toBe(expected[2]);
    });

    test(`returns ${expected[3]} integer for ${addr[3]}`, () => {
        const net = new Network(addr[3], prefix[3]);
        expect(net.networkToInteger()).toBe(expected[3]);
    });
});

describe('Valid, testing getNetwork method', () => {
    test.each`
    address              |prefix   | expected
    ${'192.168.98.2'}    | ${6}    | ${'192'}
    ${'255.168.114.128'} | ${17}   | ${'255.168'}
    ${'1:dead::987'}     | ${99}   | ${'1:dead::'}
    ${'2:be::b3:0:2:3'}  | ${70}   | ${'2:be::'}
    `('returns $expected network for ip $address',({address, prefix, expected}) => {
    const net = new Network(address, prefix);
    expect(net.getNetwork()).toBe(expected);
});
});

describe('Valid, test broadcastToLong method', () => {
    const addr = ['192.168.98.2', '255.168.114.128', '1:dead::987', '2:be::b3:0:2:3'];
    const prefix = [6, 17, 99, 70];
    const expected = [ BigInt('3288334335'), BigInt('4289232895'), BigInt('9708698262660466193050469754994687'), BigInt('10399647067947365769434142160715775')];

    test(`returns ${expected[0]} integer for ${addr[0]}`, () => {
        const net = new Network(addr[0], prefix[0]);
        expect(net.broadcastToLong()).toBe(expected[0]);
    });

    test(`returns ${expected[1]} integer for ${addr[1]}`, () => {
        const net = new Network(addr[1], prefix[1]);
        expect(net.broadcastToLong()).toBe(expected[1]);
    });

    test(`returns ${expected[2]} integer for ${addr[2]}`, () => {
        const net = new Network(addr[2], prefix[2]);
        expect(net.broadcastToLong()).toBe(expected[2]);
    });

    test(`returns ${expected[3]} integer for ${addr[3]}`, () => {
        const net = new Network(addr[3], prefix[3]);
        expect(net.broadcastToLong()).toBe(expected[3]);
    });
});

describe('Valid, testing getBroadcast method', () => {
    test.each`
    address              |prefix   | expected
    ${'192.168.98.2'}    | ${6}    | ${'195.255.255.255'}
    ${'255.168.114.128'} | ${17}   | ${'255.168.127.255'}
    ${'10.0.0.1'}        | ${28}   | ${'10.0.0.15'}
    ${'2:be::b3:0:2:3'}  | ${70}   | ${'IPv6 doesnt have broadcast address'}
    `('returns $expected broadcast for ip $address',({address, prefix, expected}) => {
    const net = new Network(address, prefix);
    expect(net.getBroadcast()).toBe(expected);
});
});

describe('Valid, testing hostFirst method', () => {
    test.each`
    address              |prefix   | expected
    ${'192.168.98.2'}    | ${6}    | ${'192.0.0.1'}
    ${'255.168.114.128'} | ${17}   | ${'255.168.0.1'}
    ${'1:dead::987'}     | ${99}   | ${'1:dead::1'}
    ${'2:be::b3:0:2:3'}  | ${70}   | ${'2:be::1'}
    `('returns $expected first host for ip $address',({address, prefix, expected}) => {
    const net = new Network(address, prefix);
    expect(net.hostFirst()).toBe(expected);
});
});

describe('Valid, testing hostLast method', () => {
    test.each`
    address              |prefix   | expected
    ${'192.168.98.2'}    | ${6}    | ${'195.255.255.254'}
    ${'255.168.114.128'} | ${17}   | ${'255.168.127.254'}
    ${'1:dead::987'}     | ${99}   | ${'0001:dead:0000:0000:0000:0000:1fff:ffff'}
    ${'2:be::b3:0:2:3'}  | ${70}   | ${'0002:00be:0000:0000:03ff:ffff:ffff:ffff'}
    `('returns $expected last host for ip $address',({address, prefix, expected}) => {
    const net = new Network(address, prefix);
    expect(net.hostLast()).toBe(expected);
});
});

describe('Valid, testing hostRange method', () => {
    test.each`
    address              | prefix   | expected
    ${'192.168.98.2'}    | ${6}    | ${['192.0.0.1', '195.255.255.254']}
    ${'255.168.114.128'} | ${17}   | ${['255.168.0.1', '255.168.127.254']}
    ${'1:dead::987'}     | ${99}   | ${['1:dead::1', '0001:dead:0000:0000:0000:0000:1fff:ffff']}
    ${'2:be::b3:0:2:3'}  | ${70}   | ${['2:be::1', '0002:00be:0000:0000:03ff:ffff:ffff:ffff']}
    `('returns $expected host range for ip $address',({address, prefix,
    expected}) => {
    const net = new Network(address, prefix);
    expect(net.hostRange()).toEqual(expected);
});
});

describe('Valid, testing contains method to be true', () => {
    test.each`
    thisAddr             | otherAddr                                    | prefix
    ${'192.168.98.2'}    | ${'193.100.5.4'}                             | ${7}
    ${'255.168.114.128'} | ${'255.168.114.131'}                         | ${29}
    ${'1:dead::987'}     | ${'0001:dead:0000:0000:0000:a123:ffff:ffff'} | ${64}
    ${'2:be::b3:0:2:3'}  | ${'0002:00be:0000:0000:00b3:0000:0000:005f'} | ${101}
    `('returns $thisAddr is inside of network $otherAddr/$prefix',({thisAddr,
    otherAddr, prefix}) => {
    const net = new Network(thisAddr, prefix);
    expect(net.contains(net.address, otherAddr, prefix)).toBeTruthy();
});
});

describe('Valid, testing contains method to be false', () => {
    test.each`
    thisAddr             | otherAddr                      | prefix
    ${'192.168.98.2'}    | ${'192.175.48.0'}              | ${24}
    ${'255.168.114.128'} | ${'255.168.11.131'}            | ${29}
    ${'1:dead::987'}     | ${'2001:dead::a123:cfff:dfff'} | ${64}
    ${'2:be::b3:0:2:3'}  | ${'3002:be:001e:0:00b3::5f'}   | ${101}
    `('returns $thisAddr is inside of network $otherAddr/$prefix',({thisAddr,
    otherAddr, prefix}) => {
    const net = new Network(thisAddr, prefix);
    expect(net.contains(net.address, otherAddr, prefix)).toBeFalsy();
});
});

describe('Valid, test networkSize method', () => {
    const addr = ['192.168.98.2', '255.168.114.128', '1:dead::987',
        '2:be::b3:0:2:3'];
    const prefix = [6, 17, 99, 70];
    const expected = [ BigInt('67108862'), BigInt('32766'),
        BigInt('536870912'), BigInt('288230376151711744')];

    test(`returns ${expected[0]} nr of hosts for ${addr[0]}`, () => {
        const net = new Network(addr[0], prefix[0]);
        expect(net.networkSize()).toBe(expected[0]);
    });

    test(`returns ${expected[1]} nr of hosts for ${addr[1]}`, () => {
        const net = new Network(addr[1], prefix[1]);
        expect(net.networkSize()).toBe(expected[1]);
    });

    test(`returns ${expected[2]} nr of hosts for ${addr[2]}`, () => {
        const net = new Network(addr[2], prefix[2]);
        expect(net.networkSize()).toBe(expected[2]);
    });

    test(`returns ${expected[3]} nr of hosts for ${addr[3]}`, () => {
        const net = new Network(addr[3], prefix[3]);
        expect(net.networkSize()).toBe(expected[3]);
    });
});

describe('IPv6 test ALL network methods for FE80:0000:0000:0000:0202:B3FF:FE1E:8329', () => {
    const net = new Network('FE80:0000:0000:0000:0202:B3FF:FE1E:8329', 42);

    test('test _checkPrefix method', () => {
        expect(net).toEqual({'address':
        'FE80:0000:0000:0000:0202:B3FF:FE1E:8329', 'integer': 0,
        'prefix': BigInt('42'), 'short': 0, 'version': 6});
    });

    test('test maskToInteger method', () => {
        expect(net.maskToInteger()).toBe(
            BigInt('340282366920861092210919271164587016192'));
    });

    test('test networkToInteger method', () => {
        expect(net.networkToInteger()).toBe(
            BigInt('338288524927261089654018896841347694592'));
    });

    test('test getNetwork method', () => {
        expect(net.getNetwork()).toBe('fe80::');
    });

    test('test broadcastToLong method', () => {
        expect(net.broadcastToLong()).toBe(
            BigInt('338288524927338460906474233108528889855'));
    });

    test('test hostFirst method', () => {
        expect(net.hostFirst()).toBe('fe80::1');
    });

    test('test hostLast method', () => {
        expect(net.hostLast()).toBe('fe80:0000:003f:ffff:ffff:ffff:ffff:ffff');
    });

    test('test hostRange method', () => {
        expect(net.hostRange()).toEqual(['fe80::1',
            'fe80:0000:003f:ffff:ffff:ffff:ffff:ffff']);
    });

    test('test networkSize method', () => {
        expect(net.networkSize()).toBe(BigInt('77371252455336267181195264'));
    });

    test('test contains method true', () => {
        expect(net.contains(net.address, 'fe80:0000:003f::cafe:00a5',
            42)).toBeTruthy();
    });

    test('test contains method false', () => {
        expect(net.contains(net.address, '::beff:acff:dff5', 120)).toBeFalsy();
    });

    test('test printInfo method', () => {
        expect(net.printInfo()).toEqual('Link-Local Unicast');
    });
});
