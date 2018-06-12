/**
 * 获取css属性值
 * // === node.style.xxx: 获取行内样式 === //
 * // === window.getComputedStyle(element[, pseudoElt]): 获取样式计算值，返回动态的 CSSStyleDecoration 对象，其getPropertyValue()用于获取属性值 === //
 * @param {Node} node - 节点
 * @param {String} cssProperty - css属性
 * @param {String} pseudoElt - 伪元素
 * @return {String}
 */
export function get (node, cssProperty, pseudoElt = null) {
  if (node.style[cssProperty]) {
    return node.style[cssProperty]
  }
  return window.getComputedStyle(node, pseudoElt).getPropertyValue(cssProperty)
}

/**
 * 设置css属性值
 * @param {Node} node - 节点
 * @param {String} cssProperty - css属性
 * @param {String} value - css值
 */
export function set (node, cssProperty, value) {
  node.style[cssProperty] = value
}
