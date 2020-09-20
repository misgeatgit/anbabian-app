/*
 A cache for storing audio data
*/

import { Audio } from 'expo-av';

class Cache {
    constructor(size) {
        this.cacheSize = size;
        this.cache = [];
    }

    get(key) {
        return null;
    }
    add(key, obj) {
       
    }
    
    removeObj(ke) {

    }
}

class AudioCache extends Cache{
    constructor(size) {
        this.cacheSize = size;
    }

    asyn removeObj(key) {
        let obj = super.get(key);
        await obj.unloadAsync();
    }
}