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


describe('IP class, valid full dotted IPv4, testing validation methods', () => {
    const testAddr = ['192.168.114.42', '192.168.0.1', '255.168.114.128', '10.0.0.1', '0.0.0.0'];
    for (let i = 0; i < testAddr.length; i++) {

        test(`version returns 4 for address ${testAddr[i]}`, () => {
            const ip = new IP(testAddr[i]);
            expect(ip.version).toBe(4);
        });

        test('addres returns address', () => {
            const ip = new IP(testAddr[i]);
            expect(ip.address).toBe(testAddr[i]);
        });

        test('short returns 0', () => {
            const ip = new IP(testAddr[i]);
            expect(ip.short).toBe(0);
        });
    }
});

describe('IP class, valid full dotted IPv6, testing validation methods', () => {
    const testAddr = ['2001:dead:beef:0051:c01d:c01a:abcd:0987', '2002:babe:0000:0000:47b3:0000:0002:0003', '7201:dead:beef:4ac1:c01e:c01f:ffff:0fab'];
    for (let i = 0; i < testAddr.length; i++) {

        test(`version returns 6 for address ${testAddr[i]}`, () => {
            const ip = new IP(testAddr[i]);
            expect(ip.version).toBe(6);
        });

        test('addres returns address', () => {
            const ip = new IP(testAddr[i]);
            expect(ip.address).toBe(testAddr[i]);
        });

        test('short returns 0', () => {
            const ip = new IP(testAddr[i]);
            expect(ip.short).toBe(0);
        });
    }
});
