/**
 * 抽象父类, 代表接下来要在canvas上绘制的所有形状
 * @constructor
 * @param {Object} instanceObj 绘制具体实例的参数对象
 * 公共方法：更新 -> 清除 -> 绘制
 */
var Element = function (instanceObj) {
    instanceObj = instanceObj || {};
    this.x = instanceObj.x;
    this.y = instanceObj.y;
    this.width = instanceObj.width;
    this.height = instanceObj.height;
    this.speed = instanceObj.speed;
};
/**
 * 更新操作
 * @param {Number} x 更新的x坐标值
 * @param {Number} y 更新的y坐标值
 */
Element.prototype.update = function (x, y) {
    this.x += x;
    this.y += y;
};
/**
 * 绘制
 * 空方法，由子类重写
 */
Element.prototype.draw = function () {};
