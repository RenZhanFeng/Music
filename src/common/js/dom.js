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

//获取节点属性
export function getData(el, name, val) {
    const prefix = 'data-'
    name = prefix + name
    if (val) {
        //setAttribute:添加指定的属性，并为其赋指定的值。
        return el.setAttribute(name, val)
    } else {
        //getAttribute:获取指定的属性的值
        return el.getAttribute(name)
    }
}

//
let elementStyle = document