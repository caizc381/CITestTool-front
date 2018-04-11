var env = process.env;

var settings = {
    //全局设置
    gbs: {
        db_prefix: 'ops_web_', //本地存储的key
    }
} 
class Store {
    constructor() {
        this.store = window.localStorage;
        this.prefix = 'ops_web_';
    }
    set(key, value, fn) {
        try {
            value = JSON.stringify(value);
        } catch (e) {
            value = value;
        }

        this.store.setItem('ops_web_' + key, value);

        fn && fn();
    }
    get(key, fn) {
        if (!key) {
            throw new Error('没有找到key。');
            return;
        }
        if (typeof key === 'object') {
            throw new Error('key不能是一个对象。');
            return;
        }
        var value = this.store.getItem('ops_web_' + key);
        if (value !== null) {
            try {
                value = JSON.parse(value);
            } catch (e) {
                value = value;
            }
        }

        return value;
    }
    remove(key) {
        this.store.removeItem('ops_web_' + key);
    }
}
module.exports = new Store();