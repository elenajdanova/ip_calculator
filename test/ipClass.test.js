import IP from '../src/ip.js';

//   ${'abc:'}            | toThrowError("valid")
  // ${'def'}             | toThrowError("valid")
  // ${'12345'}           | toThrowError("valid")
  // ${'19.300.114.1280'} | toThrowError("valid")
  // '101.200.57', '255.255', , 47898909
  //
  //   test(`toLong returns ${testAddr[i]}`, () => {
    //     const ip = new IP(testAddr[i]);
    //     expect(ip.address).toBe(testAddr[i]);
    // });
    // , '2553432', 4789890956000, '30.0.0.400', 'abc:', 'beef', undefined


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

// describe('IP class, Invalid IPv4, testing validation methods', () => {
//     const testAddr = ['1920.168.114.42', '900.1'];
//     for (let i = 0; i < testAddr.length; i++) {
//         const ip = new IP(testAddr[i]);
//
//         test('addres throws error', () => {
//             function addressError() {
//                 ip._checkAddress(testAddr[i]);
//             }
//             expect(addressError).toThrowError();
//         });
//
//     }
// });

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

    `('returns $expected representational version for ip $address',({address, expected}) => {
    const ip = new IP(address);
    expect(ip.address).toBe(expected);
});
});
