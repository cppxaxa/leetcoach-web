/* Don't edit */

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

    rpush(key, value) {
        if (!this.data[key]) {
            this.data[key] = [];
        }
        this.data[key].push(value);
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
}

class BrowserStorage {
    constructor() {
        this.storage = window.localStorage;
    }

    set(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    get(key) {
        const value = this.storage.getItem(key);
        return value ? JSON.parse(value) : null;
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    rpush(key, value) {
        let list = this.get(key);
        if (!list) {
            list = [];
        }
        list.push(value);
        this.set(key, list);
    }

    llen(key) {
        const list = this.get(key);
        return list ? list.length : 0;
    }

    lrange(key, start, end) {
        const list = this.get(key);
        return list ? list.slice(start, end) : [];
    }
}

class Storage extends BrowserStorage {
    
}
