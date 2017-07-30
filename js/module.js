/**
 * @author 张益铭 jf00258jf@hotmail.com
 * @overview p5项目-射击游戏-依赖
 */
// 兼容定义 requestAnimFrame
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 30);
    };
//寄生组合继承
function inheritPrototype(subType, superType){
    var protoType = Object.create(superType.prototype);
    protoType.constructor = subType;
    subType.prototype = protoType;
}

/**
 * 排序找最大值和最小值
 * @param {Array} arr 需检索的数组
 * @return {{minX: *, maxX: *}} 结果
 */
function getMinAndMax(arr) {
    var len = arr.length,
        min = arr[0],   //假设第一个为min
        max = arr[len-1];   //假设最后一个为max

    //比较,替换
    while(len--) {

        if(arr[len].x > max.x) max = arr[len];
        if(arr[len].x < min.x) min = arr[len];

    }

    return {
        min: min,
        max: max
    };
}


/**
 * src转换成img对象模块组件
 */
var preLoadModule = {
    loadedImgsNum: 0,   //已加载的图片资源数量
    totalImg: 0,    //总共需加载的图片资源数量

    loadedAudio: 0,  //已加载的音频资源数量
    totalAudio: 0,  //总共需加载的音频资源数量
    supportedFormat: '',  //浏览器支持的音频格式

    /**
     * 初始化： 深度遍历找出src字符串并将其转换为Image对象
     * @param {Object} config 需遍历的对象，里面存有需加载的图片的路径
     * @param {Function} fn 加载完所有图片后执行的函数
     */
    init: function (config, fn) {
        //获取DOM
        this.oProgress = document.querySelector('.load-progress');
        this.oLoadedPercent = document.querySelector('.loaded-percentage');

        //获取浏览器支持的格式
        this.supportedFormat = this.supportWhichFormat();

        //遍历替换
        for(var key in config) {

            if (this.isType(config[key], 'string')) {

                //图片src判断
                if (/^.+(\.png|\.jpg|\.gif|\.jpeg)$/.test(config[key])) {

                    ++this.totalImg;

                    this.transformImg(config, key, fn);
                }

                //音频src判断
                if (/^.+\.audio$/.test(config[key])) {

                    ++this.totalAudio;

                    this.transformAudio(config, key, fn);
                }

            } else if (this.isType(config[key], 'object')) {

                this.init(config[key], fn);

            }
        }
    },
    /**
     * 判断类型
     * @param {Object} obj 需检测的对象
     * @param {String} type 判断的类型
     */
    isType: function (obj,type) {
        return new RegExp(type.toLowerCase(),'i').test(Object.prototype.toString.call(obj));
    },
    /**
     * 图片转换：将src转换成img对象
     * @param {Object} obj src字符串值对应的key的上一层对象，如 CONFIG.img.src = '...', 则obj 为 CONFIG.img, attr 为 src <参数按值传递>
     * @param {String} attr 如上解释
     * @param {Function} fn 需执行的函数
     */
    transformImg: function (obj, attr, fn) {
        var self = this;

        var img = new Image();
        img.onload = function () {

            ++self.loadedImgsNum;
            obj[attr] = this;

            //更新进度条
            self.updateProgress(fn);
        };
        img.src = obj[attr];

    },
    /**
     * 检测浏览器支持的音频格式
     * @return {String} 格式名称
     */
    supportWhichFormat: function () {
        var audio = new Audio();

        if(audio.canPlayType('audio/mpeg')) return 'mp3';
        else if(audio.canPlayType('audio/ogg')) return 'ogg';
    },
    /**
     * 音频转换：将src转换成audio对象
     * @param {Object} obj src字符串值对应的key的上一层对象，如 CONFIG.audio.src = '...', 则obj 为 CONFIG.audio, attr 为 src <参数按值传递>
     * @param {String} attr 如上解释
     * @param {Function} fn 需执行的函数
     */
    transformAudio: function (obj, attr, fn) {
        var self = this,
            src = obj[attr].replace(/\.audio/, '.' + this.supportedFormat);

        var audio = new Audio(src);
        audio.addEventListener('canplaythrough', function () {

            ++self.loadedAudio;
            obj[attr] = this;

            //更新进度条
            self.updateProgress(fn);

        }, false);
    },
    updateProgress: function (fn) {
        var loaded = (this.loadedImgsNum + this.loadedAudio) / (this.totalImg + this.totalAudio);

        //DOM更新
        this.oProgress.style.transform = 'scaleX(' + loaded + ')';
        this.oLoadedPercent.innerHTML = (loaded * 100 | 0) + '%';

        //加载完毕
        if(loaded == 1){
            this.oLoadedPercent.className += ' loaded-over';
            fn.call(GAME);
        }

    }
};

