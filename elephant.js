//  1.声明一个变量
var elephant = document.getElementById("elephant");
/**
 * 说明:我可以声明另一个变量ctx来获取elephant的上下文,这样声明的是一个全局变量,为了让我全局变量的数量尽可能少,防止出现命名冲突,我将声明elephant的一个属性来获取elephant的上下文
 * **/
//  2.获取elephant的上下文,用于在上下文的基础上作画
elephant.ctx = elephant.getContext("2d");
//  3.毫无疑问,我需要用两个数组分别存放红军和黑军的棋子,至于这个为什么用数组,以及数组里存放什么信息,在这时候还不能做决定
elephant.arr = [];//红军
elephant.brr = [];//黑军
//  4.这个数组仅仅是为了方便遍历,因为我在判断蹩马腿的时候有可能需要一次性判断
elephant.allArr = [];        //  红军和黑军,全部装在这里面方便遍历.
//  5.可能去的位置 这个没什么好解释的
elephant.turnTo = [];
//  6.目标 敌人 的信息   这个也没什么好解释的
elephant.aimTo = [];
//  7.我当前选中的子 这个也没什么好解释的
elephant.currentZi = {};
//  8.防止重复点击  红先黑后
elephant.clickPos = {   //  这个对象里本来有很多信息[属性],后来发现不需要,就删了
    witch: "red",
};
qipan();
init();
initQiZi();
elephant.onclick = function (e) {
    /***
     * 说明 我最开始打印的,毫无疑问是  e.clientX ,但是显然我不能直接用  e.clientX  去决定我点击的是什么,甚至我都不能确定我点击的位置上有任何东西,因为棋盘并不是从页面左上角开始的
     *      我是在这个时候有了判断点击位置的想法,我知道将来画布上会出现很多线和焦点,所以我  [至少要知道]  [点击canvas上任何位置时,知道这个位置距离哪一个焦点最近]
     *      然后我应该减去 elephant.offsetLeft ,即画布对于浏览器的左偏移量[margin-left]
     *      至于  xscrollX  这个变量是为了解决后面发现的bug,当页面有滚动条的时候会出现这个bug,  (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft; 是兼容ie的写法
     *            xscrollX  是滚动条滚动的距离
     *
     *      以上是对于   clickX  的解释,这时的clickX是我点击canvas画布时,点击位置距离canvas画布左上角的位置
     * ***/
    var xscrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    var yscrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    //  10.  e.clientX - elephant.offsetLeft 是 点击位置关于浏览器左边距的位置, +xscrollX 是存在横向滚动条的情况下[比如,把页面缩放为500%时会出现滚动条],并将滚动条拉倒最右面时,拉动的距离
    //      那么这时候,我就做到指哪儿打哪儿了,
    var clickX = parseInt(e.clientX - elephant.offsetLeft + xscrollX);
    var clickY = parseInt(e.clientY - elephant.offsetTop + yscrollY);
    //  11. deffX  指我所点击的位置,距离最近的焦点的距离
    var deffX = Math.abs(clickX % 55 - 28);
    var deffY = Math.abs(clickY % 55 - 34);
    //  12. existX  指我所点击的位置,距离最近焦点的焦点坐标[是焦点的坐标]
    var existX = clickX - (clickX % 55 );
    var existY = clickY - (clickY % 55 );
    /****
     * 说明   这时候的打印,existX是55的倍数了,就是距离最近的焦点的坐标,但这时我棋盘上还没有棋子,所以现在应该去画棋子
     *      在画棋子之前,应该先确定棋子的位置   init()
     * ***/
    var diandaole = false;
    if ((deffX <= 20 && deffY <= 20) && (Math.pow(deffX, 2) + Math.pow(deffY, 2) <= 400)) {
        if (elephant.aimTo.length) {
            for (var i = 0; i < elephant.aimTo.length; i++) {
                if ((elephant.aimTo[i].x * 55 == existX) && ( elephant.aimTo[i].y * 55 == existY)) {
                    //  杀了!
                    elephant.currentZi.x = elephant.aimTo[i].x;
                    elephant.currentZi.y = elephant.aimTo[i].y;
                    elephant.clickPos.witch = ( elephant.clickPos.witch == "red") ? "black" : "red";
                    //  判断吃的是谁
                    var duiCurrentArr = (elephant.clickPos.witch == "red") ? elephant.arr : elephant.brr;
                    var index = duiCurrentArr.indexOf(elephant.aimTo[i]);
                    duiCurrentArr.splice(index, 1)
                    elephant.aimTo = [];
                    elephant.turnTo = [];
                    elephant.ctx.clearRect(0, 0, elephant.width, elephant.height);
                    qipan();
                    initQiZi();
                    return;
                }
            }
        } else {
            elephant.aimTo = [];
        }
        var currentArr = (elephant.clickPos.witch == "red") ? elephant.arr : elephant.brr;
        for (var i = 0; i < currentArr.length; i++) {
            if ((currentArr[i].x * 55 == existX) && (currentArr[i].y * 55 == existY)) {
                huaFocus(existX + 27, existY + 27);
                diandaole = true;
                elephant.currentZi = currentArr[i];
                way(elephant.currentZi);
                break;
            }
        }
        for (var i = 0; i < elephant.turnTo.length; i++) {
            if ((elephant.turnTo[i][0] * 55 == existX) && ( elephant.turnTo[i][1] * 55 == existY)) {
                elephant.currentZi.x = elephant.turnTo[i][0];
                elephant.currentZi.y = elephant.turnTo[i][1];
                elephant.aimTo = [];
                elephant.ctx.clearRect(0, 0, elephant.width, elephant.height);
                qipan();
                initQiZi();
                elephant.clickPos.witch = ( elephant.clickPos.witch == "red") ? "black" : "red";
                elephant.turnTo = [];
                break;
            }
        }
    }
//        console.log(elephant.turnTo,elephant.aimTo);
};
//  使棋子聚焦   包括敌人
function huaFocus(x, y) {
    elephant.ctx.clearRect(0, 0, elephant.width, elephant.height);
    qipan();
    initQiZi();
    elephant.ctx.strokeStyle = "blue";
    elephant.ctx.lineWidth = 1;
    elephant.ctx.beginPath();
    elephant.ctx.moveTo(x + 12, y + 22);
    elephant.ctx.lineTo(x + 22, y + 22);
    elephant.ctx.lineTo(x + 22, y + 12);
    elephant.ctx.moveTo(x - 12, y - 22);
    elephant.ctx.lineTo(x - 22, y - 22);
    elephant.ctx.lineTo(x - 22, y - 12);
    elephant.ctx.stroke();
    elephant.ctx.closePath();
}
//  9.画棋盘,仔细点就行了,注意我格子的大小是55px,并没有什么特别的意义
function qipan() {
    elephant.ctx.strokeStyle = "brown";
    elephant.ctx.lineWidth = 5;
    elephant.ctx.beginPath();
    elephant.ctx.moveTo(22, 22);
    elephant.ctx.lineTo(22, 527);
    elephant.ctx.lineTo(472, 527);
    elephant.ctx.lineTo(472, 22);
    elephant.ctx.closePath();
    elephant.ctx.stroke();
    elephant.ctx.lineWidth = 2;
    elephant.ctx.beginPath();
    elephant.ctx.moveTo(2, 2);
    elephant.ctx.lineTo(492, 2);
    elephant.ctx.lineTo(492, 547);
    elephant.ctx.lineTo(2, 547);
    elephant.ctx.lineTo(2, 2);
    //  宫
    elephant.ctx.moveTo(192, 522);
    elephant.ctx.lineTo(302, 412);
    elephant.ctx.moveTo(192, 412);
    elephant.ctx.lineTo(302, 522);
    elephant.ctx.moveTo(192, 137);
    elephant.ctx.lineTo(302, 27);
    elephant.ctx.lineTo(192, 27);
    elephant.ctx.lineTo(302, 137);
    //  横线和竖线
    for (var i = 0; i < 10; i++) {
        elephant.ctx.moveTo(27, 27 + i * 55);
        elephant.ctx.lineTo(467, 27 + i * 55);
        elephant.ctx.moveTo(27 + i * 55, 27);
        if (i && i != 8) {
            elephant.ctx.lineTo(27 + i * 55, 247);
            elephant.ctx.moveTo(27 + i * 55, 302);
        }
        elephant.ctx.lineTo(27 + i * 55, 522);
    }
    elephant.ctx.closePath();
    elephant.ctx.stroke();
    elephant.ctx.font = "25px new ";
    elephant.ctx.fillStyle = "brown";
    elephant.ctx.fillText("楚河                       汉界", 115, 283);
    /***
     * 说明 如果仅仅是为了画棋盘和棋子,不去考虑点击的功能,那想怎么画就怎么画,但是现在有个问题,是我们现在应该考虑的,就是我在canvas上点击的时候,我凭什么就知道我点击的是棋子而不是棋盘,或者对方的棋子,以及具体是哪一个棋子
     *      但如果仅仅是单方面的考虑是很难想出来的,这时候应该先去做elephant.onclick事件,或者说,去考虑elephant.onclick事件
     * ***/
}
//  画出棋子的位置
function initQiZi() {
    elephant.allArr = elephant.arr.concat(elephant.brr);
    for (var red = 0; red < elephant.arr.length; red++) {
        oneStep(elephant.arr[red].x, elephant.arr[red].y, elephant.arr[red].font, elephant.arr[red].color);
    }
    for (var bla = 0; bla < elephant.brr.length; bla++) {
        oneStep(elephant.brr[bla].x, elephant.brr[bla].y, elephant.brr[bla].font, elephant.brr[bla].color);
    }
}
//  画画棋子
function oneStep(i, j, font, color) {
    elephant.ctx.strokeStyle = "saddlebrown";
    elephant.ctx.lineWidth = 3;
    elephant.ctx.beginPath();
    elephant.ctx.arc(27 + i * 55, 27 + j * 55, 20, 0, 2 * Math.PI);//画圆
    elephant.ctx.closePath();
    elephant.ctx.stroke();
    elephant.ctx.fillStyle = "#f4e4cc";
    elephant.ctx.fill();
    elephant.ctx.font = "25px new ";
    elephant.ctx.fillStyle = color;
    elephant.ctx.fillText(font, 14 + i * 55, 36 + j * 55);
}
//  怎么走
function way(data) {
    //  可能去的地方
    var posWayArr = [];
    //  可能的目标
    var aimArr = [];
    switch (data.font) {
        case "卒":
            bingzu(data, posWayArr, aimArr);
            break;
        case "兵":
            bingzu(data, posWayArr, aimArr);
            break;
        case "炮":
            pao(data, posWayArr, aimArr);
            break;
        case "車":
            ju(data, posWayArr, aimArr);
            break;
        case "馬":
            ma(data, posWayArr, aimArr);
            break;
        case "象":
            xiang(data, posWayArr, aimArr);
            break;
        case "相":
            xiang(data, posWayArr, aimArr);
            break;
        case "士":
            shi(data, posWayArr, aimArr);
            break;
        case "仕":
            shi(data, posWayArr, aimArr);
            break;
        case "帥":
            shuai(data, posWayArr, aimArr);
            break;
        case "将":
            shuai(data, posWayArr, aimArr);
            break;
    }
    possible(posWayArr);
    if (aimArr.length) {
        huaAim(aimArr)
    }
}
//  可能性 画出
function possible(posWayArr) {
    elephant.turnTo = posWayArr;
    elephant.ctx.strokeStyle = "green";
    elephant.ctx.beginPath();
    for (var i = 0; i < posWayArr.length; i++) {
        var x = posWayArr[i][0];
        var y = posWayArr[i][1];
        //  右下
        if (y < 9 && x < 8) {
            elephant.ctx.moveTo(x * 55 + 27 + 5, y * 55 + 27 + 5 + 15);
            elephant.ctx.lineTo(x * 55 + 27 + 5, y * 55 + 27 + 5);
            elephant.ctx.lineTo(x * 55 + 27 + 5 + 15, y * 55 + 27 + 5);
        }
        //  左下
        if (x != 0 && y < 9) {
            elephant.ctx.moveTo(x * 55 + 27 - 5, y * 55 + 27 + 5 + 15);
            elephant.ctx.lineTo(x * 55 + 27 - 5, y * 55 + 27 + 5);
            elephant.ctx.lineTo(x * 55 + 27 - 5 - 15, y * 55 + 27 + 5);
        }
        //  左上
        if (x != 0 && y != 0) {
            elephant.ctx.moveTo(x * 55 + 27 - 5, y * 55 + 27 - 5 - 15);
            elephant.ctx.lineTo(x * 55 + 27 - 5, y * 55 + 27 - 5);
            elephant.ctx.lineTo(x * 55 + 27 - 5 - 15, y * 55 + 27 - 5);
        }
        //  右上
        if (x < 8 && y != 0) {
            elephant.ctx.moveTo(x * 55 + 27 + 5, y * 55 + 27 - 5 - 15);
            elephant.ctx.lineTo(x * 55 + 27 + 5, y * 55 + 27 - 5);
            elephant.ctx.lineTo(x * 55 + 27 + 20, y * 55 + 27 - 5);
        }
    }
    elephant.ctx.stroke();
    elephant.ctx.stroke();
}
function huaAim(aimArr) {
    elephant.aimTo = aimArr;
    elephant.ctx.strokeStyle = "red";
    elephant.ctx.beginPath();
    elephant.ctx.lineWidth = 3;
    for (var i = 0; i < aimArr.length; i++) {
        var x = aimArr[i].x * 55 + 27;
        var y = aimArr[i].y * 55 + 27;
        elephant.ctx.moveTo(x + 12, y + 22);
        elephant.ctx.lineTo(x + 22, y + 22);
        elephant.ctx.lineTo(x + 22, y + 12);
        elephant.ctx.moveTo(x - 12, y - 22);
        elephant.ctx.lineTo(x - 22, y - 22);
        elephant.ctx.lineTo(x - 22, y - 12);
        elephant.ctx.moveTo(x + 12, y - 22);
        elephant.ctx.lineTo(x + 22, y - 22);
        elephant.ctx.lineTo(x + 22, y - 12);
        elephant.ctx.moveTo(x - 12, y + 22);
        elephant.ctx.lineTo(x - 22, y + 22);
        elephant.ctx.lineTo(x - 22, y + 12);
    }
    elephant.ctx.stroke();
    elephant.ctx.stroke();
    elephant.ctx.stroke();
    elephant.ctx.closePath();
}
//  炮的走法
function pao(data, posWayArr, aimArr) {
    var leftArr = [];
    var bottomArr = [];
    var upArr = [];
    var rightArr = [];
    //  左面
    for (var i = data.x - 1; i >= 0; i--) {
        for (var j = 0; j < elephant.allArr.length; j++) {
            if (elephant.allArr[j].x == i && elephant.allArr[j].y == data.y) {
                leftArr.push(elephant.allArr[j]);
                if (leftArr.length >= 2) {
                    break;
                }
            }
        }
    }
    for (var i = (leftArr.length ? leftArr[0].x + 1 : 0); i < data.x; i++) {
        posWayArr.push([i, data.y])
    }
    if (leftArr.length >= 2) {
        if (leftArr[1].color != data.color) {
            aimArr.push(leftArr[1]);
        }
    }
    //  下
    for (var i = data.y + 1; i < 10; i++) {
        for (var j = 0; j < elephant.allArr.length; j++) {
            if (elephant.allArr[j].x == data.x && elephant.allArr[j].y == i) {
                bottomArr.push(elephant.allArr[j]);
                if (bottomArr.length >= 2) {
                    break;
                }
            }
        }
    }
    for (var i = (bottomArr.length ? bottomArr[0].y - 1 : 9); i > data.y; i--) {
        posWayArr.push([data.x, i])
    }
    if (bottomArr.length >= 2) {
        if (bottomArr[1].color != data.color) {
            aimArr.push(bottomArr[1]);
        }
    }
    //  向上
    for (var i = data.y - 1; i >= 0; i--) {
        for (var j = 0; j < elephant.allArr.length; j++) {
            if (elephant.allArr[j].x == data.x && elephant.allArr[j].y == i) {
                upArr.push(elephant.allArr[j]);
                if (upArr.length >= 2) {
                    break;
                }
            }
        }
    }
    for (var i = (upArr.length ? upArr[0].y + 1 : 0); i < data.y; i++) {
        posWayArr.push([data.x, i])
    }
    if (upArr.length >= 2) {
        if (upArr[1].color != data.color) {
            aimArr.push(upArr[1]);
        }
    }
    //  向右
    for (var i = data.x + 1; i <= 8; i++) {
        for (var j = 0; j < elephant.allArr.length; j++) {
            if (elephant.allArr[j].x == i && elephant.allArr[j].y == data.y) {
                rightArr.push(elephant.allArr[j]);
                if (rightArr.length >= 2) {
                    break;
                }
            }
        }
    }
    for (var i = (rightArr.length ? rightArr[0].x - 1 : 8); i > data.x; i--) {
        posWayArr.push([i, data.y])
    }
    if (rightArr.length >= 2) {
        if (rightArr[1].color != data.color) {
            aimArr.push(rightArr[1]);
        }
    }
}
//  车的走法
function ju(data, posWayArr, aimArr) {
    var breakoutleft, breakoutrihgt, breakouttop, breakoutbottom;
    //  左面
    for (var i = data.x - 1; i >= 0; i--) {
        for (var j = 0; j < elephant.allArr.length; j++) {
            if (elephant.allArr[j].x == i && elephant.allArr[j].y == data.y) {
                if (elephant.allArr[j].color != data.color) {
                    aimArr.push(elephant.allArr[j]);
                }
                breakoutleft = true;
                break;
            }
        }
        if (breakoutleft) {
            breakoutleft = false;
            break;
        } else {
            posWayArr.push([i, data.y])
        }
    }
    //  下
    for (var i = data.y + 1; i < 10; i++) {
        for (var j = 0; j < elephant.allArr.length; j++) {
            if (elephant.allArr[j].x == data.x && elephant.allArr[j].y == i) {
                if (elephant.allArr[j].color != data.color) {
                    aimArr.push(elephant.allArr[j]);
                }
                breakoutbottom = true;
                break;
            }
        }
        if (breakoutbottom) {
            breakoutbottom = false;
            break;
        } else {
            posWayArr.push([data.x, i])
        }
    }
    //  向上
    for (var i = data.y - 1; i >= 0; i--) {
        for (var j = 0; j < elephant.allArr.length; j++) {
            if (elephant.allArr[j].x == data.x && elephant.allArr[j].y == i) {
                if (elephant.allArr[j].color != data.color) {
                    aimArr.push(elephant.allArr[j]);
                }
                breakouttop = true;
                break;
            }
        }
        if (breakouttop) {
            breakouttop = false;
            break;
        } else {
            posWayArr.push([data.x, i])
        }
    }
    //  向右
    for (var i = data.x + 1; i <= 8; i++) {
        for (var j = 0; j < elephant.allArr.length; j++) {
            if (elephant.allArr[j].x == i && elephant.allArr[j].y == data.y) {
                if (elephant.allArr[j].color != data.color) {
                    aimArr.push(elephant.allArr[j]);
                }
                breakoutrihgt = true;
                break;
            }
        }
        if (breakoutrihgt) {
            breakoutrihgt = false;
            break;
        } else {
            posWayArr.push([i, data.y])
        }
    }
}
//  马的走法
function ma(data, posWayArr, aimArr) {
    //  蹩马腿的判断
    var breakoutleft, breakoutrihgt, breakouttop, breakoutbottom;
    for (var i = 0; i < elephant.allArr.length; i++) {
        if (elephant.allArr[i].y == data.y) {
            //  最左面有
            if (elephant.allArr[i].x == data.x - 1) {
                breakoutleft = true;
            }
            //  最右面有
            if (elephant.allArr[i].x == data.x + 1) {
                breakoutrihgt = true;
            }
        }
        if (elephant.allArr[i].x == data.x) {
            //  最上面有
            if (elephant.allArr[i].y == data.y - 1) {
                breakouttop = true;
            }
            //  最下面有
            if (elephant.allArr[i].y == data.y + 1) {
                breakoutbottom = true;
            }
        }
    }
    for (var i = 0; i < elephant.allArr.length; i++) {
        if (!breakoutleft) {
            if (elephant.allArr[i].x == data.x - 2) {
                if (elephant.allArr[i].y == data.y - 1) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    var _lefttop = true;
                }
                if (elephant.allArr[i].y == data.y + 1) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    var _leftbottom = true;
                }
            }
        }
        if (!breakoutrihgt) {
            if (elephant.allArr[i].x == data.x + 2) {
                if (elephant.allArr[i].y == data.y - 1) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    var _righttop = true;
                }
                if (elephant.allArr[i].y == data.y + 1) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    var _rightbottom = true;
                }
            }
        }
        if (!breakouttop) {
            if (elephant.allArr[i].y == data.y - 2) {
                if (elephant.allArr[i].x == data.x - 1) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    var _topleft = true;
                }
                if (elephant.allArr[i].x == data.x + 1) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    var _topright = true;
                }
            }
        }
        if (!breakoutbottom) {
            if (elephant.allArr[i].y == data.y + 2) {
                if (elephant.allArr[i].x == data.x - 1) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    var _bottomleft = true;
                }
                if (elephant.allArr[i].x == data.x + 1) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    var _bottomright = true;
                }
            }
        }
    }
    if (!breakoutleft) {
        if (data.x >= 2) {
            //  左上没人
            if (!_lefttop) {
                posWayArr.push([data.x - 2, data.y - 1])
            }
            //  左下没人
            if (!_leftbottom) {
                posWayArr.push([data.x - 2, data.y + 1])
            }
        }
    }
    if (!breakoutrihgt) {
        if (data.x <= 6) {
            //  右上没人
            if (!_righttop) {
                posWayArr.push([data.x + 2, data.y - 1])
            }
            //  右下没人
            if (!_rightbottom) {
                posWayArr.push([data.x + 2, data.y + 1])
            }
        }
    }
    if (!breakouttop) {
        if (data.y >= 2) {
            //  上左没人
            if (!_topleft) {
                posWayArr.push([data.x - 1, data.y - 2])
            }
            //  上右没人
            if (!_topright) {
                posWayArr.push([data.x + 1, data.y - 2])
            }
        }
    }
    if (!breakoutbottom) {
        if (data.y <= 7) {
            //  下左没人
            if (!_bottomleft) {
                posWayArr.push([data.x - 1, data.y + 2])
            }
            //  下右没人
            if (!_bottomright) {
                posWayArr.push([data.x + 1, data.y + 2])
            }
        }
    }
}
//  象的走法
function xiang(data, posWayArr, aimArr) {
    if (data.color == "red") {
        var limitTop = 5;
        var limitBottom = 9;
    } else {
        limitTop = 0;
        limitBottom = 4;
    }
    //  我应该先判断限界,有四个不同的方向
    var zs = {};
    if (data.x - 2 >= 0) {
        //  能向左上
        if (data.y - 2 >= limitTop) {
            zs.yanx = data.x - 1;
            zs.yany = data.y - 1;
            zs.posx = data.x - 2;
            zs.posy = data.y - 2;
            xiangway(zs)
        }
        //  左下
        if (data.y + 2 <= limitBottom) {
            zs.yanx = data.x - 1;
            zs.yany = data.y + 1;
            zs.posx = data.x - 2;
            zs.posy = data.y + 2;
            xiangway(zs)
        }
    }
    if (data.x + 2 <= 8) {
        //  右上
        if (data.y - 2 >= limitTop) {
            zs.yanx = data.x + 1;
            zs.yany = data.y - 1;
            zs.posx = data.x + 2;
            zs.posy = data.y - 2;
            xiangway(zs)
        }
        //  右下
        if (data.y + 2 <= limitBottom) {
            zs.yanx = data.x + 1;
            zs.yany = data.y + 1;
            zs.posx = data.x + 2;
            zs.posy = data.y + 2;
            xiangway(zs)
        }
    }
    function xiangway(zs) {
        for (var i = 0; i < elephant.allArr.length; i++) {
            if ((elephant.allArr[i].x == zs.yanx) && (elephant.allArr[i].y == zs.yany)) {
                var _lefttop = true;
                break;
            }
        }
        if (!_lefttop) {
            var index = true;
            for (var i = 0; i < elephant.allArr.length; i++) {
                if ((elephant.allArr[i].x == zs.posx ) && (elephant.allArr[i].y == zs.posy)) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i]);
                    }
                    index = false;
                    break;
                }
            }
            if (index) {
                posWayArr.push([zs.posx, zs.posy])
            }
        }
    }
}
//  士的走法
function shi(data, posWayArr, aimArr) {
    var _leftTop, _leftBottom, _rightTop, _rightBottom;
    if (data.x == 4) {
        for (var i = 0; i < elephant.allArr.length; i++) {
            if (Math.abs(elephant.allArr[i].x - data.x) == 1) {
                if (elephant.allArr[i].y + 1 == data.y) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i]);
                    }
                    if (elephant.allArr[i].x < data.x) {
                        _leftTop = true;
                    } else {
                        _rightTop = true;
                    }
                }
                if (elephant.allArr[i].y - 1 == data.y) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i]);
                    }
                    if (elephant.allArr[i].x < data.x) {
                        _leftBottom = true;
                    } else {
                        _rightBottom = true;
                    }
                }
            }
        }
        if (!_leftTop) {
            posWayArr.push([data.x - 1, data.y - 1])
        }
        if (!_leftBottom) {
            posWayArr.push([data.x - 1, data.y + 1])
        }
        if (!_rightTop) {
            posWayArr.push([data.x + 1, data.y - 1])
        }
        if (!_rightBottom) {
            posWayArr.push([data.x + 1, data.y + 1])
        }
    } else {
        var _top, _bottom;
        for (var i = 0; i < elephant.allArr.length; i++) {
            if (elephant.allArr[i].x == 4) {
                if ((Math.abs(elephant.allArr[i].y - data.y) == 1) && (elephant.allArr[i].y == 8 || elephant.allArr[i].y == 1 )) {
                    //  如果是下面那个
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    _top = true;
                    _bottom = true;
                    break;
                } else {
                    _top = data.color == "red";
                    _bottom = !_top;
                }
            }
        }
        if (!_top) {
            posWayArr.push([4, 1])
        }
        if (!_bottom) {
            posWayArr.push([4, 8])
        }
    }
}
//  帅的走法
function shuai(data, posWayArr, aimArr) {
    var _top, _bottom, _right, _left;
    for (var i = 0; i < elephant.allArr.length; i++) {
        //  只处理上下
        if (elephant.allArr[i].x == data.x) {
            //  上面有
            if ((elephant.allArr[i].y >= 0 && elephant.allArr[i].y <= 2) || (elephant.allArr[i].y >= 7 && elephant.allArr[i].y <= 9)) {
                if (elephant.allArr[i].y + 1 == data.y) {
                    _top = true;
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                }
                //  下面有
                if (elephant.allArr[i].y - 1 == data.y) {
                    _bottom = true;
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                }
            }
        }
        //  只处理左右
        if (elephant.allArr[i].y == data.y) {
            if (elephant.allArr[i].x >= 3 && elephant.allArr[i].x <= 5) {
                //  左面有
                if (elephant.allArr[i].x + 1 == data.x) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    _left = true;
                }
                //  右面有
                if (elephant.allArr[i].x - 1 == data.x) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    _right = true;
                }
            }
        }
    }
    if (!_top) {
        if ((data.y + 1 <= 3 && data.y - 1 >= 0 ) || ( data.y + 1 <= 10 && data.y - 1 >= 7)) {
            posWayArr.push([data.x, data.y - 1])
        }
    }
    if (!_bottom) {
        if ((data.y + 1 <= 2 && data.y + 1 >= 0 ) || ( data.y + 1 <= 9 && data.y - 1 >= 5)) {
            posWayArr.push([data.x, data.y + 1])
        }
    }
    if (!_left) {
        if (data.x >= 4) {
            posWayArr.push([data.x - 1, data.y]);
        }
    }
    if (!_right) {
        if (data.x <= 4) {
            posWayArr.push([data.x + 1, data.y]);
        }
    }
}
//  兵卒的走法
function bingzu(data, posWayArr, aimArr) {
    var _top, _right, _left, _bottom;
    for (var i = 0; i < elephant.allArr.length; i++) {
        if (data.color == "red") {
            if ((elephant.allArr[i].x == data.x) && (elephant.allArr[i].y + 1 == data.y)) {
                if (elephant.allArr[i].color != data.color) {
                    aimArr.push(elephant.allArr[i])
                }
                _top = true;
            }
        }

        else {
            if ((elephant.allArr[i].x == data.x) && (elephant.allArr[i].y - 1 == data.y)) {
                if (elephant.allArr[i].color != data.color) {
                    aimArr.push(elephant.allArr[i])
                }
                _bottom = true;
            }
        }
    }
    if (!_top) {
        if (data.y - 1 >= 0 && data.color == "red") {
            posWayArr.push([data.x, data.y - 1])
        }
    }
    if (!_bottom) {
        if (data.y + 1 <= 9 && data.color != "red") {
            posWayArr.push([data.x, data.y + 1])
        }
    }
    if ((data.y <= 4 && data.color == "red") || (data.y >= 5 && data.color != "red")) {
        for (var i = 0; i < elephant.allArr.length; i++) {
            if (elephant.allArr[i].y == data.y) {
                if (elephant.allArr[i].x + 1 == data.x) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    _left = true;
                }
                if (elephant.allArr[i].x - 1 == data.x) {
                    if (elephant.allArr[i].color != data.color) {
                        aimArr.push(elephant.allArr[i])
                    }
                    _right = true;
                }
            }
        }
        if (!_left) {
            if (data.x - 1 >= 0) {
                posWayArr.push([data.x - 1, data.y])
            }
        }
        if (!_right) {
            if (data.x + 1 <= 8) {
                posWayArr.push([data.x + 1, data.y])
            }
        }
    }
}
//  初始化棋子位置
function init() {
    //  13. 那么我要定义棋子的初始信息,包括位置,文字,颜色,把他们放在一个对象中是理所应当的,你可以加入其它的属性,但这几个属性已经足够了
    //      关于坐标,由于我
    var redJ1 = {x: 0, y: 9, font: "車", color: "red"};
    var redJ2 = {x: 8, y: 9, font: "車", color: "red"};
    var redM1 = {x: 1, y: 9, font: "馬", color: "red"};
    var redM2 = {x: 7, y: 9, font: "馬", color: "red"};
    var redX1 = {x: 2, y: 9, font: "相", color: "red"};
    var redX2 = {x: 6, y: 9, font: "相", color: "red"};
    var redS1 = {x: 3, y: 9, font: "仕", color: "red"};
    var redS2 = {x: 5, y: 9, font: "仕", color: "red"};
    var redCn = {x: 4, y: 9, font: "帥", color: "red"};
    var redP1 = {x: 1, y: 7, font: "炮", color: "red"};
    var redP2 = {x: 7, y: 7, font: "炮", color: "red"};
    var redB1 = {x: 0, y: 6, font: "兵", color: "red"};
    var redB2 = {x: 2, y: 6, font: "兵", color: "red"};
    var redB3 = {x: 4, y: 6, font: "兵", color: "red"};
    var redB4 = {x: 6, y: 6, font: "兵", color: "red"};
    var redB5 = {x: 8, y: 6, font: "兵", color: "red"};

    var blcJ1 = {x: 0, y: 0, font: "車", color: "black"};
    var blcJ2 = {x: 8, y: 0, font: "車", color: "black"};
    var blcM1 = {x: 1, y: 0, font: "馬", color: "black"};
    var blcM2 = {x: 7, y: 0, font: "馬", color: "black"};
    var blcX1 = {x: 2, y: 0, font: "象", color: "black"};
    var blcX2 = {x: 6, y: 0, font: "象", color: "black"};
    var blcS1 = {x: 3, y: 0, font: "士", color: "black"};
    var blcS2 = {x: 5, y: 0, font: "士", color: "black"};
    var blcCn = {x: 4, y: 0, font: "将", color: "black"};
    var blcP1 = {x: 1, y: 4, font: "炮", color: "black"};
    var blcP2 = {x: 7, y: 2, font: "炮", color: "black"};
    var blcB1 = {x: 0, y: 3, font: "卒", color: "black"};
    var blcB2 = {x: 2, y: 3, font: "卒", color: "black"};
    var blcB3 = {x: 4, y: 3, font: "卒", color: "black"};
    var blcB4 = {x: 6, y: 3, font: "卒", color: "black"};
    var blcB5 = {x: 8, y: 3, font: "卒", color: "black"};
    elephant.arr = [redJ1, redJ2, redM1, redM2, redX1, redX2, redS1, redS2, redCn, redP1, redP2, redB1, redB2, redB3, redB4, redB5];
    elephant.brr = [blcJ1, blcJ2, blcM1, blcM2, blcX1, blcX2, blcS1, blcS2, blcCn, blcP1, blcP2, blcB1, blcB2, blcB3, blcB4, blcB5];
    elephant.allArr = elephant.arr.concat(elephant.brr);
}