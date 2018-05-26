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
