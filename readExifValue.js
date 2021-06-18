function readExifValue(format, stream) {
    switch (format) {
        case 1:
            return stream.nextUInt8();
        case 3:
            return stream.nextUInt16();
        case 4:
            return stream.nextUInt32();
        case 5:
            return [stream.nextUInt32(), stream.nextUInt32()];
        case 6:
            return stream.nextInt8();
        case 8:
            return stream.nextUInt16();
        case 9:
            return stream.nextUInt32();
        case 10:
            return [stream.nextInt32(), stream.nextInt32()];
        case 11:
            return stream.nextFloat();
        case 12:
            return stream.nextDouble();
        default:
            throw new Error('Invalid format while decoding: ' + format);
    }
}

module.exports = readExifValue;
