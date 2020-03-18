//这个JS主要操作和History相关的逻辑


const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

export function saveSearch(query) {
    //获取SEARCH_KEY储存空间的情况,如果还没有这个空间就创建一个并设置为空数组
    let searches = localDate('get', SEARCH_KEY, '', []);
    //把query插入searches数组
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH);
    localDate('set', SEARCH_KEY, searches);
    return searches
}


//从本地储存获取数据传到vuex的state里面的searchHistory
export function loadSearch() {
    return localDate('get', SEARCH_KEY, []);
}

//处理插入数组的数据，让新插入的始终在最前面，多余的数据删除
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)
    //index===0说明是第一条数据
    if (index === 0) {
        return
    } else if (index > 0) {
        //index > 0说明有重复数据，需要先删除
        arr.splice(index, 1)
    }
    arr.unshift(val)
    //如果有条数限制且超过限制就删除最后一条数据
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}

//在历史列表删除储存数据的方法
export function deleteSearch(query) {
    let searches = localDate('get', SEARCH_KEY);
    deleteFromArray(searches, (item) => {
        return item === query
    })
    localDate('set', SEARCH_KEY, searches);
    return searches
}
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

//在历史列表删除所有历史搜索数据
export function clearSearch() {
    localDate('set', SEARCH_KEY, []);
    let searches = localDate('get', SEARCH_KEY);
    return searches
}


//封装localStorage方法
const localDate = function (method, name, data) {
    //参数说明：
    //method：set存入或覆盖，get获取，remove清除单条数据，clear清除全部localStorage数据
    //name:localStorage的key值
    //data:存入的内容，可以是任意类型 
    switch (method) {
        case 'set':
            localStorage.setItem(name, JSON.stringify(data));
            return true;
        case 'get':
            if (localStorage.getItem(name)) {
                return JSON.parse(localStorage.getItem(name));
            } else if (data) {
                localStorage.setItem(name, JSON.stringify(data));
                return JSON.parse(localStorage.getItem(name));
            } else {
                console.log('获取不到key为' + name + '的localStorage数据')
            }
        case 'remove':
            localStorage.removeItem(name);
            return true;
        case 'clear':
            localStorage.clear();
            return true;
    }
}