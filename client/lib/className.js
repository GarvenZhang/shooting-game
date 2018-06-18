/**
 * 添加类名
 * // === 思路：获取原有字符串，对需要添加的类名去空白，根据是否首个来决定是不添加空白 === //
 * @param {Node} node - 节点
 * @param {String} className - 类名
 */
export function addClass (node, className) {
  let initClassName = node.className

  initClassName += (initClassName === '' ? className.trim() : ` ${className.trim()}`)

  node.className = initClassName
}

/**
 * 移除类名
 * // === 思路：获取原有字符串，以空白分割为数组，过滤掉需要去挑的类名，重新赋值给节点类名 === //
 * @param {Node} node - 节点
 * @param {String} className - 类名
 */
export function removeClass (node, className) {
  let initClassNameArr = node.className.split(' ')

  let newClassNameArr = initClassNameArr.filter(item => item !== className)

  node.className = newClassNameArr.join(' ')
}

/**
 * 替换类名
 * // === 思路：利用map，与oldClassName相同的就返回newClassName === //
 * @param {Node} node - 节点
 * @param {String} newClassName - 旧类名
 * @param {String} oldClassName - 新类名
 */
export function replaceClass (node, newClassName, oldClassName) {
  let initClassNameArr = node.className.split(' ')

  let newClassNameArr = initClassNameArr.map(item => item === oldClassName ? newClassName : item)

  if (!newClassNameArr.some(item => item === newClassName)) {
    newClassNameArr.push(newClassName)
  }

  node.className = newClassNameArr.join(' ').trim()
}
