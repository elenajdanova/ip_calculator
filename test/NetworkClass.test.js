import Network from '../src/network.js';

describe('test', () => {
    const testAddr = '192.168.114.42';
    const ip = new Network(testAddr, 18);

    test(`test ${testAddr}`, () => {
        expect(ip).toEqual({"address": "192.168.114.42", "integer": 0, "prefix": 18, "short": 0, "version": 4});
    });

});
