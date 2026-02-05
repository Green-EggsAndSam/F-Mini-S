import fs from 'fs'

export function jsonToString(path : string): string{
    return fs.readFileSync(path,'utf-8');
}