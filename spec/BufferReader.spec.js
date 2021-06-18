const BufferReader = require('../BufferReader');
describe('BufferReader', () => {
    it('should read string', function () {
        const buffer = Buffer.from('hello world');
        const stream = new BufferReader(buffer);
        expect(stream.nextString(5)).toEqual('hello');
        expect(stream.nextString(6)).toEqual(' world');
    });
    it('should read 8 bit unsigned integer', function () {
        const buffer = Buffer.from([1, -2]);
        const stream = new BufferReader(buffer);
        expect(stream.nextUInt8()).toEqual(1);
        expect(stream.nextUInt8()).toEqual(254);
    });
    it('should read 8 bit integer', function () {
        const buffer = Buffer.from('AB');
        const stream = new BufferReader(buffer);
        expect(stream.nextInt8()).toEqual(65);
        expect(stream.nextInt8()).toEqual(66);
    });
    it('should read 16 bit unsigned integer', function () {
        const buffer = Buffer.from([1, -2, 3, -4]);
        const stream = new BufferReader(buffer);
        expect(stream.nextUInt16()).toEqual(510);
        expect(stream.nextUInt16()).toEqual(1020);
    });
    it('should read 16 bit integer', function () {
        const buffer = Buffer.from('ABCD');
        const stream = new BufferReader(buffer);
        expect(stream.nextInt16()).toEqual(16706);
        expect(stream.nextInt16()).toEqual(17220);
    });
    it('should read 32 bit unsigned integer', function () {
        const buffer = Buffer.from([1, -2, 3, -4, 5, -6, 7, -8]);
        const stream = new BufferReader(buffer);
        expect(stream.nextUInt32()).toEqual(33424380);
        expect(stream.nextUInt32()).toEqual(100272120);
    });
    it('should read 32 bit integer', function () {
        const buffer = Buffer.from('ABCDEFGH');
        const stream = new BufferReader(buffer);
        expect(stream.nextInt32()).toEqual(1094861636);
        expect(stream.nextInt32()).toEqual(1162233672);
    });
    it('should read float', function () {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const stream = new BufferReader(buffer);
        expect(stream.nextFloat()).toEqual(2.387939260590663e-38);
    });
    it('should read double', function () {
        const buffer = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
        const stream = new BufferReader(buffer);
        expect(stream.nextDouble()).toEqual(8.20788039913184e-304);
    });
    it('should slice buffer from length', function () {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const stream = new BufferReader(buffer);
        expect(stream.nextBuffer(3)).toEqual(Buffer.from([1, 2, 3]));
    });
    it('should get remaining length', function () {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const stream = new BufferReader(buffer, 0, 2);
        expect(stream.remainingLength()).toEqual(2);
    });
    it('should skip length', function () {
        const buffer = Buffer.from([1, 2, 3, 4]);
        const stream = new BufferReader(buffer);
        stream.skip(2);
        expect(stream.remainingLength()).toEqual(2);
    });
});
