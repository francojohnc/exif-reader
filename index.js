const fs = require("fs");
const tagNames = require('./exif-tags');
const getBytesPerComponent = require('./getBytesPerComponent');
const readExifValue = require('./readExifValue');

const BufferReader = require('./BufferReader');
const buffer = fs.readFileSync('./exif.jpg');
const stream = new BufferReader(buffer);


let len = 0;
let markerType;
let tags = {};

const start = stream.nextUInt16();
if (start !== 0xFFD8) {
    throw new Error('Invalid file type');
}
const appi = stream.nextUInt16();
if (appi !== 0xFFE1) {
    throw new Error('Invalid appi');
}
const appiDataSize = stream.nextUInt16();
const exifHeader = stream.nextString(6);
if (exifHeader !== 'Exif\0\0') {
    throw new Error('Invalid EXIF header');
}
const tiffMarker = mark(stream);
const tiffHeader = stream.nextUInt16();
if (tiffHeader === 0x4949) {
    stream.setBigEndian(false);
} else if (tiffHeader === 0x4D4D) {
    stream.setBigEndian(true);
} else {
    throw new Error('Invalid TIFF header');
}

const tiffData = stream.nextUInt16();
if (tiffData !== 0x002A) {
    throw new Error('Invalid TIFF data');
}
const unknown = stream.nextUInt32();
const numberOfEntries = stream.nextUInt16();
for (i = 0; i < numberOfEntries; ++i) {
    tag = readExifTag(tiffMarker,stream);
    const tagType = tag[0];
    const value = tag[1];
    const format = tag[2];
    let sectionTagNames = tagNames.exif;
    let name = sectionTagNames[tagType];
    if (!name) {
        name = tagNames.exif[tagType];
    }
    if (!tags.hasOwnProperty(name)) {
        tags[name] = value;
    }
}
console.log(tags);

function mark(stream) {
    return {
        openWithOffset: function (offset) {
            offset = (offset || 0) + stream.offset;
            return new BufferReader(stream.buffer, offset, stream.endPosition - offset, stream.bigEndian);
        },
        offset: stream.offset
    }
}

function readExifTag(tiffMarker,stream) {
    let tagType = stream.nextUInt16();
    let format = stream.nextUInt16();
    let bytesPerComponent = getBytesPerComponent(format);
    let components = stream.nextUInt32();
    let valueBytes = bytesPerComponent * components;
    let values;
    let c;
    /* if the value is bigger than 4 bytes, the value is in the data section of the IFD
    and the value present in the tag is the offset starting from the tiff header. So we replace the stream
    with a stream that is located at the given offset in the data section. s*/
    if (valueBytes > 4) {
        const offset = stream.nextUInt32();
        stream = tiffMarker.openWithOffset(offset);
        // stream = new BufferReader(stream.buffer, offset, undefined, stream.bigEndian);
    }
    if (format === 2) {
        values = stream.nextString(components);
        var lastNull = values.indexOf('\0');
        if (lastNull !== -1) {
            values = values.substr(0, lastNull);
        }
    } else if (format === 7) {
        values = stream.nextBuffer(components);
    } else if (format !== 0) {
        values = [];
        for (c = 0; c < components; ++c) {
            values.push(readExifValue(format, stream));
        }
    }
    if (valueBytes < 4) {
        stream.skip(4 - valueBytes);
    }
    return [tagType, values, format];
}


