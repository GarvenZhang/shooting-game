/**
 * @author 张益铭 jf00258jf@hotmail.com
 * @overview p5项目-射击游戏-主逻辑函数
 */
// 元素
var doc = document,
    container = doc.getElementById('game'),
    canvas = doc.querySelector('#canvas');

//获取上下文
var ctx = canvas.getContext('2d');
if(!ctx) alert('当前浏览器不支持canvas,请升级浏览器以获得更好的体验！');

//配置项
var CONFIG = {
    bgm: './audio/bgm.audio',
    width: canvas.width,
    height: canvas.height,
    padding: 30,
    status: 'start',
    currentLevel: 1,
    totalLevel: 6,

    //怪兽配置项
    enemy: {
        width: 50, //宽
        height: 50, //高
        rangeX: {   //x轴上的移动范围
            start: 30,
            end: 670
        },
        rangeY: {   //y轴上的移动范围
            start: 30,
            end: 470
        },
        numPerLine: 7,  //每行个数
        distancePerNum: 10, //每个间间距
        speed: 2,   //移动速度
        lineNum: 1, //行数
        downDistance: 50,
        iconWhenAlive: './img/enemy.png',   //有生命时的图像
        iconWhenDead: './img/boom.png',     //挂了时的图像
        duration: 3, //持续挂多少帧
        audio: './audio/lose.audio'
    },

    //子弹配置项
    bullet: {
        width: 1,   //宽
        height: 10, //高
        rangeY: {
            end: 0
        },
        color: '#fff',  //颜色
        speed: 10   //速度
    },

    //飞机配置项
    plane: {
        width: 60,  //宽
        height: 100, //高
        icon: './img/plane.png',    //资源路径
        rangeX: {   //x轴上的移动范围
            start: 30,
            end: 670
        },
        rangeY: {    //y轴上的移动范围
            start: 470,
            end: 570
        },
        speed: 5,    //移动速度
        audio: './audio/shoot.audio'
    }

};

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


/**
 * 飞机类
 * @constructor
 * @param {Object} obj 绘制飞机的参数对象
 */
var Plane = function (obj) {
    Element.call(this, obj);
    this.direction = '';
    this.status = '';
    this.bullets = [];

};
inheritPrototype(Plane, Element);

/**
 * 创建子弹实例
 */
Plane.prototype.createBullet = function () {
    var self = this,
        bulletConfig = CONFIG.bullet;

    self.bullets.push(new Bullet({
        x: self.x + (self.width >> 1),
        y: self.y,
        width: bulletConfig.width,
        height: bulletConfig.height,
        speed: bulletConfig.speed
    }));

};
/**
 * 绘制飞机
 */
Plane.prototype.draw = function () {

    ctx.drawImage(CONFIG.plane.icon, this.x, this.y, this.width, this.height);

};


/**
 * 子弹类
 * @constructor
 * @param {Object} obj 绘制子弹的参数对象
 */
var Bullet = function (obj) {
    Element.call(this, obj);

    this.color = CONFIG.bullet.color;   //子弹颜色

};
inheritPrototype(Bullet, Element);

/**
 * 判断是否出界
 */
Bullet.prototype.isOut = function () {

    if(this.y < CONFIG.bullet.rangeY.end) return true;

};
/**
 * 射中
 * @param {Array} enemiesArr 现有的怪兽数组
 * @param {Array} bulletsArr 现有的子弹数组
 * @return {Boolean} 是否射中
 */
Bullet.prototype.hit = function (enemiesArr, bulletsArr) {
    var lenEnemy = enemiesArr.length;

    //遍历所有怪兽实例
    //进行子弹与怪兽的碰撞检测
    while(lenEnemy--) {
        var item = enemiesArr[lenEnemy];

        if(
            (this.y - item.height == item.y) &&
            (this.x >= item.x && this.x <= item.x + item.width)
        ) {

            //无血
            item.setNoBlood(enemiesArr);

            //子弹毁灭
            this.destroy(bulletsArr);

            return true;
        }

    }

};
/**
 * 毁灭子弹
 * @param {Array} bulletsArr 现有的子弹数组
 */
Bullet.prototype.destroy = function (bulletsArr) {
    var len = bulletsArr.length;

    //遍历所有子弹
    //找到当前子弹的位置，并删除
    while(len--) {

        if(this == bulletsArr[len]) {

            bulletsArr.splice(len, 1);

            break;
        }
    }
};
/**
 * 绘制子弹
 */
Bullet.prototype.draw = function () {

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    //reset
    ctx.fillStyle = '';
};

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

/**
 *  键盘控制组件
 */
var keyBoard = {
    "pressLeft": false, //按下left
    "pressRight": false,    //按下right
    "space": false, //按下空格

    //策略模式
    //type为键盘事件类型
    "strategy": {
        "32": function (type) {

            if(/keydown/.test(type)) this.space = true;
            else if(/keyup/.test(type)) this.space = false;

        },
        "37": function (type) {

            if(/keydown/.test(type)) this.pressLeft = true;
            else if(/keyup/.test(type)) this.pressLeft = false;

        },
        "39": function (type) {

            if(/keydown/.test(type)) this.pressRight = true;
            else if(/keyup/.test(type)) this.pressRight = false;

        }
    },
    /**
     * 初始化
     */
    init: function () {
        doc.onkeydown = doc.onkeyup = function (e) {
            e = e || window.event;
            var keyCode = e.keyCode;

            //调用策略
            if(this.strategy[keyCode]) this.strategy[keyCode].call(this, e.type);
        }.bind(this);
    }
};

/**
 * 整个游戏对象
 */
var GAME = {
    /**
     * 初始化函数,这个函数只执行一次
     * @param  {object} opts
     * @return {[type]}      [description]
     */
    init: function(opts) {
        this.finalScore = doc.querySelector('.game-failed .score');
        this.currentScore= doc.querySelector('.game-info .score');
        this.nextLevel = doc.querySelector('.game-next-level');

        var self = this;

        this.CONFIG = opts || CONFIG;
        this.status = this.CONFIG.status;
        this.score = 0;
        this.currentLevel = this.CONFIG.currentLevel;
        this.totalLevel = this.CONFIG.totalLevel;
        this.enemies = [];
        this.plane = null;
        this.clickEvents = {
            // 开始游戏按钮绑定
            "js-play": self.play,
            // 重新开始按钮绑定
            "js-replay": function () {
                self.end('failed');
                self.play();
            },
            "js-next": self.play    // 下一关开始按钮绑定
        };
        this.keyBoard = keyBoard;

        //事件绑定
        this.bindEvent();

    },
    /**
     * 事件绑定
     */
    bindEvent: function() {
        var self = this;

        //click事件委托
        container.addEventListener('click', function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement,
                classNames = target.className.split(/\s+/);

            //执行策略
            classNames.forEach(function (item, i, arr) {
                if(self.clickEvents[item]) self.clickEvents[item].call(self, item);
            });

        }, false);

        //键盘事件
        self.keyBoard.init();

        //bgm循环播放
        this.CONFIG.bgm.addEventListener('ended', function () {
            this.play();
        }, false);
    },
    /**
     * 更新游戏状态，分别有以下几种状态：
     * start  游戏前
     * playing 游戏中
     * failed 游戏失败
     * success 游戏成功
     * stop 游戏暂停
     */
    setStatus: function(status) {
        this.status = status;
        container.setAttribute("data-status", status);
    },
    /**
     * 开始游戏
     */
    play: function() {

        //bgm
        this.CONFIG.bgm.play();

        //初始化怪兽
        var enemy = CONFIG.enemy;
        for(var _currentLevel = this.currentLevel; _currentLevel--; ) {
            for(var len = enemy.numPerLine; len--; ) {

                //x: a1 为 enemy.rangeX.start, d 为  enemy.size + enemy.distancePerNum 的等差数列
                //y: a1 为 enemy.rangeY.start，d 为 enemy.downDistance 的等差数列
                this.enemies.push(new Enemy({
                    x: enemy.rangeX.start + len * (enemy.width + enemy.distancePerNum),
                    y: enemy.rangeY.start + _currentLevel * enemy.downDistance,
                    width: enemy.width,
                    height: enemy.height,
                    speed: enemy.speed
                }));

            }
        }

        //初始化飞机
        var plane = this.CONFIG.plane,
            planeRangeX = plane.rangeX;

        //x: 一开始飞机在中间
        this.plane = new Plane({
            x: planeRangeX.start + ((planeRangeX.end - planeRangeX.start) >> 1)  - (plane.width >> 1),
            y: plane.rangeY.start,
            width: plane.width,
            height: plane.height,
            speed: plane.speed
        });

        //设置游戏状态
        this.setStatus('playing');

        //更新
        this.update();

    },
    /**
     * 更新绘制信息
     */
    update: function () {
        var self = this;

        //重置画布
        ctx.clearRect(0, 0, this.CONFIG.width, this.CONFIG.height);

        //更新怪兽
        this.updateEnemies();
        //更新子弹
        this.updateBullet();
        //更新飞机
        this.updatePlane();

        //绘制
        this.draw();

        //怪兽未突破时，持续动画循环
        if(!/(failed|success|stop)/.test(self.status) ) {

            requestAnimFrame(function () {
                self.update();
            });

        //突破时，转入失败界面
        }else ctx.clearRect(0, 0, this.CONFIG.width, this.CONFIG.height);
    },
    /**
     * 更新怪兽绘制信息
     */
    updateEnemies: function () {
        var self = this,
            enemyAudio = this.CONFIG.enemy.audio,   //怪兽突破时的音频对象
            _enemies = this.enemies,    //怪兽实例数组
            minAndMax = getMinAndMax(_enemies), //取得边界
            headEnemy = minAndMax.min,    //排序中第一个怪兽对象
            footEnemy = minAndMax.max;  //排序中最后一个怪兽对象

        //判断是否转向并移到下一行
        if(headEnemy && headEnemy.isTurnAround() || footEnemy && footEnemy.isTurnAround()) {

            _enemies.forEach(function (item, i, arr) {

                //反向
                item.direction = !item.direction;

                //移到下一层
                item.down(function () {
                    self.setStatus('failed');
                    self.updateScore();

                    //怪兽突破时的音效
                    enemyAudio.play();
                });
            });
        }

        //左右移动
        _enemies.forEach(function (item, i, arr) {

            //根据方向选择速度
            if(item.direction) item.update(item.speed, 0);
            else item.update(-item.speed, 0);

            //判断死亡状态
            item.dead(self, i);

        });
    },
    /**
     * 更新子弹
     */
    updateBullet: function () {
        var bullets = this.plane.bullets,
            len = bullets.length,
            item = null;

        //遍历所有子弹实例
        while(len--) {
            item = bullets[len];

            //判断出界与否：出界，删除该实例；没出，则继续更新
            if(item.isOut()) bullets.splice(len, 1);
            else bullets[len].update(0, -item.speed);

            //若击中怪兽
            //更新分数
            item.hit(this.enemies, bullets);

        }

    },
    /**
     * 更新飞机
     */
    updatePlane: function () {
        var plane = this.plane,
            planeRangeX = this.CONFIG.plane.rangeX,
            keyBoard = this.keyBoard;

        //移动
        if (keyBoard.pressLeft && plane.x >= planeRangeX.start) plane.update(-plane.speed, 0);
        else if(keyBoard.pressRight && plane.x <= planeRangeX.end - plane.width) plane.update(plane.speed, 0);

        //发射子弹
        //必须要在调用发射函数之前把键位变回false，这样才能保证一开始按一次就发一颗子弹，而之后想持续多发就持续按咦跟上动画循环的渲染
        if(keyBoard.space){

            keyBoard.space = false;
            plane.createBullet();

        }
    },
    /**
     * 更新游戏难度水平
     */
    updateLevel: function () {

        //更新DOM数据
        this.nextLevel.innerHTML = '下一个Level： ' + this.currentLevel;

        //通过所有关时
        if (this.currentLevel === this.totalLevel + 1) this.end('all-success');
    },
    /**
     * 更新分数
     */
    updateScore: function () {
        //实时更新
        this.currentScore.innerHTML = this.score;

        //游戏结果界面中的更新
        if(/(failed|success)/.test(this.status)) this.finalScore.innerHTML = this.score;
    },
    /**
     * 绘制当前帧
     */
    draw: function () {

        //绘制所有怪兽实例
        this.enemies.forEach(function (item, i, arr) {
            item.draw();
        });

        //绘制飞机实例
        this.plane.draw();

        //绘制所有子弹实例
        this.plane.bullets.forEach(function (item, i, arr) {
            item.draw();
        });
    },
    /**
     * 暂停游戏
     */
    stop: function () {
        this.setStatus('stop');
    },
    /**
     * 结束游戏
     * 重置状态，分数，难度水平，画布
     */
    end: function (status) {
        /all-success/.test(status) ? this.setStatus('all-success') : this.setStatus('failed');
        this.enemies = [];
        this.currentLevel = 1;
        this.score = 0;
        this.updateScore();

        ctx.clearRect(0, 0, this.CONFIG.width, this.CONFIG.height);
    }
};

// 初始化
// preLoadModule.init: 资源预加载函数
preLoadModule.init(CONFIG, GAME.init);
