import fs from 'fs';

export function jsonToString(path : string): string{
    return fs.readFileSync(path,'utf-8');
}

export function safeWriteJSON(filename : string, data : unknown) {
    const tempFile = filename + ".tmp";

    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    fs.renameSync(tempFile, filename);
}
