import IP from '../src/ip.js';

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

describe('IPv4, valid ip, testing toBimary method', () => {
    test.each`
    address                 | expected
    ${'192.168.114.42'}     | ${'11000000101010000111001000101010'}
    ${'192.168.0.1'}        | ${'11000000101010000000000000000001'}
    ${'255.168.114.128'}    | ${'11111111101010000111001010000000'}
    ${'10.0.0.1'}           | ${'00001010000000000000000000000001'}

    `('returns $expected binary version for $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.toBinary()).toBe(expected);
});
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

describe('IPv4, testing toInteger method', () => {
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
    expect(ip.toInteger()).toBe(expected);
});
});

describe('IPv4, testing toHex method', () => {
    test.each`
    address              | expected
    ${'101.200.57'}      | ${'65c83900'}
    ${'255.255'}         | ${'ffff0000'}
    ${'192.168.114.42'}  | ${'c0a8722a'}
    ${'192.168.0.1'}     | ${'c0a80001'}
    ${'255.168.114.128'} | ${'ffa87280'}
    ${'10.0.0.1'}        | ${'a000001'}
    `('returns $expected hex for ip $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.toHEX()).toBe(expected);
});
});

describe('IPv4, testing toCompressed method', () => {
    test.each`
    address             | expected
    ${'101.200.57.0'}   | ${'101.200.57'}
    ${'255.255.0.0'}    | ${'255.255'}
    ${'192.168.114.42'} | ${'192.168.114.42'}
    ${'197.0.0.3'}      | ${'197.0.0.3'}
    ${'5.0.0.0'}        | ${'5'}
    `('returns $expected short representation of $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.toCompressed()).toBe(expected);
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

        test('ip.addres returns address', () => {
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

describe('IPv6, testing toCompressed method', () => {
    test.each`
    address                                      | expected
    ${'2002:babe:0000:0000:47b3:0000:0002:0013'} | ${'2002:babe::47b3:0:2:13'}
    ${'0000:0000:0000:0000:0000:c01a:abcd:0987'} | ${'::c01a:abcd:987'}
    ${'0ace:00cd:f987:0000:0000:0000:0000:0000'} | ${'ace:cd:f987::'}
    ${'1ace:00cd:f987:0000:0e57:0000:0006:0010'} | ${'1ace:cd:f987::e57:0:6:10'}
    `('returns $expected short representation of $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.toCompressed()).toBe(expected);
});
});

// //not working with BIgInts
// describe('IPv6, testing toInteger method', () => {
//     const addr = ['::abcd:c7ce', '2002:babe::abc:2:3'];
//     const expected = [ BigInt('2882389966'), BigInt('42549468040371534509101895686289489923n') ];
//
//     test(`returns ${expected[0]} integer for ${addr[0]}`, () => {
//         const ip = new IP(addr[0]);
//         expect(ip.toInteger()).toBe(expected[0]);
//     });
//
//     test(`returns ${expected[1]} integer for ${addr[1]}`, () => {
//         const ip = new IP(addr[1]);
//         expect(ip.toInteger()).toBe(expected[1]);
//     });
// });
//
describe('IPv6, valid ip, testing toBimary method', () => {
    test.each`
    address                 | expected
    ${'2001:dead:beef:0051:c01d:c01a:abcd:0987'}  | ${'00100000000000011101111010101101101111101110111100000000010100011100000000011101110000000001101010101011110011010000100110000111'}
    ${'2002:babe:0000:0000:47b3:0000:0002:0003'}  | ${'00100000000000101011101010111110000000000000000000000000000000000100011110110011000000000000000000000000000000100000000000000011'}
    ${'7201:dead:beef:4ac1:c01e:c01f:ffff:0fab'}  | ${'01110010000000011101111010101101101111101110111101001010110000011100000000011110110000000001111111111111111111110000111110101011'}
    ${'2001:db8::ff:ffff'}   | ${'00100000000000010000110110111000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111'}

    `('returns binary version for $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.toBinary()).toBe(expected);
});
});

describe('IPv6, testing toHex method', () => {
    test.each`
    address              | expected
    ${'2001:dead:beef:0051:c01d:c01a:abcd:0987'} | ${'2001deadbeef0051c01dc01aabcd0987'}
    ${'2002:babe:0000:0000:47b3:0000:0002:0003'} | ${'2002babe0000000047b3000000020003'}
    ${'7201:dead:beef:4ac1:c01e:c01f:ffff:0fab'} | ${'7201deadbeef4ac1c01ec01fffff0fab'}
    ${'2001:db8::ff:ffff'}                       | ${'20010db8000000000000000000ffffff'}
    `('returns $expected hex for ip $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.toHEX()).toBe(expected);
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
