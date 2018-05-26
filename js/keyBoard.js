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
