import IP from '../src/ip.js';

  // 47898909

describe('IPv4, valid full dotted ip, testing validation methods', () => {
    const testAddr = ['192.168.114.42', '192.168.0.1', '255.168.114.128', '10.0.0.1', '0.0.0.0'];
    for (let i = 0; i < testAddr.length; i++) {
        const ip = new IP(testAddr[i]);

        test(`version returns 4 for address ${testAddr[i]}`, () => {
            expect(ip.version).toBe(4);
        });

        test('addres returns valid address', () => {
            expect(ip.address).toBe(testAddr[i]);
        });

        test('short returns 0', () => {
            expect(ip.short).toBe(0);
        });
    }
});

describe('IPv4, valid short notation, testing toRepresentation method', () => {
    test.each`
    address             | expected
    ${'101.200.57'}     | ${'101.200.57.0'}
    ${'255.255'}        | ${'255.255.0.0'}
    ${'.1'}             | ${'0.0.0.1'}
    ${'5.'}             | ${'5.0.0.0'}

    `('returns $expected representational version for ip $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.address).toBe(expected);
});
});

describe('IPv4, testing toLong method', () => {
    test.each`
    address              | expected
    ${'101.200.57'}      | ${1707620608}
    ${'255.255'}         | ${4294901760}
    ${'192.168.114.42'}  | ${3232264746}
    ${'192.168.0.1'}     | ${3232235521}
    ${'255.168.114.128'} | ${4289229440}
    ${'10.0.0.1'}        | ${167772161}
    ${'0.0.0.0'}         | ${0}
    `('returns $expected for ip $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.toLong()).toBe(expected);
});
});

describe('Invalid IPv4, testing validation methods', () => {
    const testAddr = ['1920.168.114.42', 'def.', '...', '.', '192.168..', 'hello there!'];
    for (let i = 0; i < testAddr.length; i++) {
        test(`${testAddr[i]} throws error`, () => {
            function addressError() {
                let ip = new IP(testAddr[i]);
                ip.address;
            }
            expect(addressError).toThrowError('Tips');
        });
    }
});


describe('IPv6, valid full dotted ip, testing validation methods', () => {
    const testAddr = ['2001:dead:beef:0051:c01d:c01a:abcd:0987', '2002:babe:0000:0000:47b3:0000:0002:0003', '7201:dead:beef:4ac1:c01e:c01f:ffff:0fab'];
    for (let i = 0; i < testAddr.length; i++) {
        const ip = new IP(testAddr[i]);

        test(`version returns 6 for address ${testAddr[i]}`, () => {
            expect(ip.version).toBe(6);
        });

        test('addres returns address', () => {
            expect(ip.address).toBe(testAddr[i]);
        });

        test('short returns 0', () => {
            expect(ip.short).toBe(0);
        });
    }
});

describe('IPv6, valid short notation, testing toRepresentation method', () => {
    test.each`
    address                             | expected
    ${'2001:ead:beef:0:c01d:c01a::987'} | ${'2001:0ead:beef:0000:c01d:c01a:0000:0987'}
    ${'2002:babe::abc:2:3'}             | ${'2002:babe:0000:0000:0000:0abc:0002:0003'}
    ${'7201::4ac1:1e:1f:ffff:fab'}      | ${'7201:0000:0000:4ac1:001e:001f:ffff:0fab'}
    ${'::1'}                            | ${'0000:0000:0000:0000:0000:0000:0000:0001'}
    ${'1af0::'}                         | ${'1af0:0000:0000:0000:0000:0000:0000:0000'}

    `('returns $expected full version for $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.address).toBe(expected);
});
});

describe('Invalid IPv6, testing validation methods', () => {
    const testAddr = [':', 'fahy:0001', 'beef:::', undefined, null, ''];
    for (let i = 0; i < testAddr.length; i++) {
        test(`${testAddr[i]} throws error`, () => {
            function addressError() {
                let ip = new IP(testAddr[i]);
                ip.address;
            }
            expect(addressError).toThrowError('Tips');
        });
    }
});

describe('IPv4 valid integer, testing validation methods', () => {
    test.each`
  address                        | expected
  ${1707620608}                  | ${'101.200.57.0'}
  ${4294901760}                  | ${'255.255.0.0'}
  ${'192'}                       | ${'0.0.0.192'}
  ${'95465'}                     | ${'0.1.116.233'}
  `('returns $expected for ip $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.address).toBe(expected);
});
});

describe('IPv6, valid big integer, testing validation methods', () => {
    const addr = [ BigInt('340282366920938463463374'), BigInt('27028236938463463374')];
    const expected = ['0000:0000:0000:480e:be7b:9d58:566c:87ce', '0000:0000:0000:0001:7717:964b:3634:c7ce'];

    test(`returns ${expected[0]} for ip ${addr[0]}`, () => {
        const ip = new IP(addr[0]);
        expect(ip.address).toBe(expected[0]);
    });

    test(`returns ${expected[1]} for ip ${addr[1]}`, () => {
        const ip = new IP(addr[1]);
        expect(ip.address).toBe(expected[1]);
    });
});

describe('Invalid integer, testing validation methods', () => {
    const testAddr = ['-15', '0', 0, -130, 340282366920938463463374607431798211456n];
    for (let i = 0; i < testAddr.length; i++) {
        test(`${testAddr[i]} throws error`, () => {
            function addressError() {
                let ip = new IP(testAddr[i]);
                ip.address;
            }
            expect(addressError).toThrowError('Tips');
        });
    }
});
