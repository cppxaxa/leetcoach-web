
class InMemoryStorage {
    constructor() {
        this.data = {};
    }

    set(key, value) {
        this.data[key] = value;
    }

    get(key) {
        return this.data[key];
    }

    remove(key) {
        delete this.data[key];
    }

    append(key, value) {
        if (!this.data[key]) {
            this.data[key] = [];
        }
        this.data[key].push(value);
    }

    rpush(key, value) {
        this.append(key, value);
    }

    lpush(key, value) {
        if (!this.data[key]) {
            this.data[key] = [];
        }
        this.data[key].unshift(value);
    }

    llen(key) {
        if (!this.data[key]) {
            return 0;
        }
        return this.data[key].length;
    }

    lrange(key, start, end) {
        if (!this.data[key]) {
            return [];
        }
        return this.data[key].slice(start, end);
    }

    hgetall(key) {
        if (!this.data[key]) {
            return {};
        }
        return this.data[key];
    }
}

class Storage extends InMemoryStorage {
    
}
