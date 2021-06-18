class BufferReader {
    constructor(buffer, offset, length, bigEndian = true) {
        this.buffer = buffer;
        this.offset = offset || 0;
        length = length || buffer.length;
        this.endPosition = this.offset + length;
        this.bigEndian = bigEndian;
    }

    nextString(length) {
        const value = this.buffer.toString('utf8', this.offset, this.offset + length);
        this.offset += length;
        return value;
    }

    nextUInt8() {
        const value = this.buffer.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }

    nextInt8() {
        const value = this.buffer.readInt8(this.offset);
        this.offset += 1;
        return value;
    }

    nextUInt16() {
        const value = this.bigEndian ? this.buffer.readUInt16BE(this.offset) : this.buffer.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    }

    nextInt16() {
        const value = this.bigEndian ? this.buffer.readInt16BE(this.offset) : this.buffer.readInt16LE(this.offset);
        this.offset += 2;
        return value;
    }

    nextUInt32() {
        const value = this.bigEndian ? this.buffer.readUInt32BE(this.offset) : this.buffer.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    }

    nextInt32() {
        const value = this.bigEndian ? this.buffer.readInt32BE(this.offset) : this.buffer.readInt32LE(this.offset);
        this.offset += 4;
        return value;
    }

    nextFloat() {
        const value = this.bigEndian ? this.buffer.readFloatBE(this.offset) : this.buffer.readFloatLE(this.offset);
        this.offset += 4;
        return value;
    }

    nextDouble() {
        const value = this.bigEndian ? this.buffer.readDoubleBE(this.offset) : this.buffer.readDoubleLE(this.offset);
        this.offset += 8;
        return value;
    }

    nextBuffer(length) {
        const value = this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return value;
    }

    remainingLength() {
        return this.endPosition - this.offset;
    }

    skip(amount) {
        this.offset += amount;
    }

    setBigEndian(bigEndian) {
        this.bigEndian = bigEndian;
    }

    mark() {
        const self = this;
        return {
            openWithOffset: function (offset) {
                offset = (offset || 0) + this.offset;
                return new BufferReader(self.buffer, offset, self.endPosition - offset, self.bigEndian);
            },
            offset: this.offset
        };
    }

}

module.exports = BufferReader;
