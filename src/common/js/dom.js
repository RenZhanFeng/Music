//给dom添加类名
export function addClass(el, className) {
    if (hasClass(el, className)) {
        return
    } else {
        let newClass = el.className.split(' ')
        newClass.push(className)
        el.className = newClass.join(' ')
    }
}

//判断该dom是否有这个类名
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

//
export function getData(el,name,val){

}