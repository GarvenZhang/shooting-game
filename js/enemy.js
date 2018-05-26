/**
 * 怪兽类
 * @constructor
 * @param {Object} obj 绘制怪兽的参数对象
 * @example {
 *      x: x,
 *      y: y,
 *      width: width,
 *      speed: speed
 * }
 */
var Enemy = function (obj) {
    Element.call(this, obj);
    this.lifeblood = 1; //生命值: 1 -> 有生命     0 -> 已挂
    this.direction = true; //向左移动为true，向右移动为false
    this.duration = 0;

};
inheritPrototype(Enemy, Element);

/**
 * 转向: 因为游戏里是把整一行看作弹性碰撞的检测目标，所以需交给一行中的一头一尾去检测
 */
Enemy.prototype.isTurnAround = function () {
    var _rangeX = CONFIG.enemy.rangeX;

    if(this.x < _rangeX.start || this.x + this.width > _rangeX.end) return true;

};

/**
 * 移动下一层 并 判断是否突破界限
 * @param {Function} fn 游戏失败后执行的函数
 */
Enemy.prototype.down = function (fn) {
    var _CONFIG = CONFIG.enemy;

    this.y += _CONFIG.downDistance;

    if(this.y >= _CONFIG.rangeY.end) fn();

};

/**
 * 设置无血状态
 * @param {Array} enemiesArr 现有的怪兽数组
 */
Enemy.prototype.setNoBlood = function (enemiesArr) {
    var len = enemiesArr.length;

    while(len--) {

        if(this == enemiesArr[len]) {
            this.lifeblood = 0;

            break;
        }

    }
};

/**
 * 怪兽死亡
 * @param {Object} GAMEContext GAME上下文
 * @param {Number} index 该怪兽在数组中的索引
 */
Enemy.prototype.dead = function (GAMEContext, index) {
    var planeAudio = GAMEContext.CONFIG.plane.audio; //射中怪兽时的音频对象

    //若没有生命力了，则开始计算死亡持续帧数
    if(!this.lifeblood){
        ++this.duration;

        //射中音效
        new Audio(planeAudio.src).play();

        //当第3帧时，真正死亡
        if(this.duration === 3){
            GAMEContext.enemies.splice(index, 1);
            ++GAMEContext.score;
            GAMEContext.updateScore();

            //若当局怪兽全部死亡
            //更新状态，更新level
            if(!GAMEContext.enemies.length){

                GAMEContext.setStatus('success');
                ++GAMEContext.currentLevel;
                GAMEContext.updateLevel();
            }
        }
    }
};

/**
 * 根据生命数绘制怪兽
 */
Enemy.prototype.draw = function () {
    var _CONFIG = CONFIG.enemy,
        img = this.lifeblood ? _CONFIG.iconWhenAlive : _CONFIG.iconWhenDead;

    //绘制
    ctx.drawImage(img, this.x, this.y, _CONFIG.width, _CONFIG.height);
};
