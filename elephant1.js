/******
 * 这是附件
 * *****/

var elephant = document.getElementById("elephant");
var ctx = elephant.getContext("2d");
var arr = [];//红军
var brr = [];//黑军
var allArr = [];        //  全部装在这里面方便遍历
var turnTo = [];        //  可能去的位置
var aimTo = [];         //  目标 敌人
var currentZi = {};
//  防止重复点击
var clickPos = {
    clock: false,
    whitch: "red",
};
qipan();
init();
initQiZi();
elephant.onclick = function (e) {
    var xscrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    var yscrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    var clickX = parseInt(e.clientX - elephant.offsetLeft + xscrollX);
    var clickY = parseInt(e.clientY - elephant.offsetTop + yscrollY);
    var deffX = Math.abs(clickX % 55 - 28);
    var deffY = Math.abs(clickY % 55 - 34);
    console.log(deffX)
    var existX = clickX - (clickX % 55 );
    var existY = clickY - (clickY % 55 );
    console.log(existX)
    var diandaole = false;
    if ((deffX <= 20 && deffY <= 20) && (Math.pow(deffX, 2) + Math.pow(deffY, 2) <= 400)) {
        if (aimTo.length) {
            for (var i = 0; i < aimTo.length; i++) {
                if ((aimTo[i].x * 55 == existX) && ( aimTo[i].y * 55 == existY)) {
                    //  杀了!
                    currentZi.x = aimTo[i].x;
                    currentZi.y = aimTo[i].y;
                    clickPos.clock = true;
                    clickPos.whitch = ( clickPos.whitch == "red") ? "black" : "red";
                    //  判断吃的是谁
                    var duiCurrentArr = (clickPos.whitch == "red") ? arr : brr;
                    var index = duiCurrentArr.indexOf(aimTo[i]);
                    duiCurrentArr.splice(index, 1)
                    aimTo = [];
                    turnTo = [];
                    ctx.clearRect(0, 0, elephant.width, elephant.height);
                    qipan();
                    initQiZi();
                    return;
                }
            }
        } else {
            aimTo = [];
        }
        var currentArr = (clickPos.whitch == "red") ? arr : brr;
        for (var i = 0; i < currentArr.length; i++) {
            if ((currentArr[i].x * 55 == existX) && (currentArr[i].y * 55 == existY)) {
                huaFocus(existX + 27, existY + 27);
                diandaole = true;
                currentZi = currentArr[i];
                way(currentZi);
                break;
            }
        }
        for (var i = 0; i < turnTo.length; i++) {
            if ((turnTo[i][0] * 55 == existX) && ( turnTo[i][1] * 55 == existY)) {
                currentZi.x = turnTo[i][0];
                currentZi.y = turnTo[i][1];
                aimTo = [];
                ctx.clearRect(0, 0, elephant.width, elephant.height);
                qipan();
                initQiZi();
                clickPos.whitch = ( clickPos.whitch == "red") ? "black" : "red";
                turnTo = [];
                break;
            }
        }
    }
//        console.log(turnTo,aimTo);
};
//  使棋子聚焦   包括敌人
function huaFocus(x, y) {
    ctx.clearRect(0, 0, elephant.width, elephant.height);
    qipan();
    initQiZi();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 22);
    ctx.lineTo(x + 22, y + 22);
    ctx.lineTo(x + 22, y + 12);
    ctx.moveTo(x - 12, y - 22);
    ctx.lineTo(x - 22, y - 22);
    ctx.lineTo(x - 22, y - 12);
    ctx.stroke();
    ctx.closePath();
}
//  棋盘
function qipan() {
    ctx.strokeStyle = "brown";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(22, 22);
    ctx.lineTo(22, 527);
    ctx.lineTo(472, 527);
    ctx.lineTo(472, 22);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.lineTo(492, 2);
    ctx.lineTo(492, 547);
    ctx.lineTo(2, 547);
    ctx.lineTo(2, 2);
    //  宫
    ctx.moveTo(192, 522);
    ctx.lineTo(302, 412);
    ctx.moveTo(192, 412);
    ctx.lineTo(302, 522);
    ctx.moveTo(192, 137);
    ctx.lineTo(302, 27);
    ctx.lineTo(192, 27);
    ctx.lineTo(302, 137);
    //  横线和竖线
    for (var i = 0; i < 10; i++) {
        ctx.moveTo(27, 27 + i * 55);
        ctx.lineTo(467, 27 + i * 55);
        ctx.moveTo(27 + i * 55, 27);
        if (i && i != 8) {
            ctx.lineTo(27 + i * 55, 247);
            ctx.moveTo(27 + i * 55, 302);
        }
        ctx.lineTo(27 + i * 55, 522);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.font = "25px new ";
    ctx.fillStyle = "brown";
    ctx.fillText("楚河                       汉界", 115, 283);
}
//  画出棋子的位置
function initQiZi() {
    allArr = arr.concat(brr);
    for (var red = 0; red < arr.length; red++) {
        oneStep(arr[red].x, arr[red].y, arr[red].font, arr[red].color);
    }
    for (var bla = 0; bla < brr.length; bla++) {
        oneStep(brr[bla].x, brr[bla].y, brr[bla].font, brr[bla].color);
    }
}
//  画画棋子
function oneStep(i, j, font, color) {
    ctx.strokeStyle = "saddlebrown";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(27 + i * 55, 27 + j * 55, 20, 0, 2 * Math.PI);//画圆
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#f4e4cc";
    ctx.fill();
    ctx.font = "12px new ";
    ctx.fillStyle = color;
    ctx.fillText(font, 9 + i * 55, 32 + j * 55);
}
//  怎么走
function way(data) {
    //  可能去的地方
    var posWayArr = [];
    //  可能的目标
    var aimArr = [];
    switch (data.font) {
        case "布鲁尔":
            bingzu(data, posWayArr, aimArr);
            break;
        case "比斯利":
            bingzu(data, posWayArr, aimArr);
            break;
        case "库   里":
            pao(data, posWayArr, aimArr);
            break;
        case "威   少":
            ju(data, posWayArr, aimArr);
            break;
        case "格里芬":
            ma(data, posWayArr, aimArr);
            break;
        case "伦纳德":
            xiang(data, posWayArr, aimArr);
            break;
        case "阿   伦":
            xiang(data, posWayArr, aimArr);
            break;
        case "格   林":
            shi(data, posWayArr, aimArr);
            break;
        case "霍华德":
            shi(data, posWayArr, aimArr);
            break;
        case "张伯伦":
            shuai(data, posWayArr, aimArr);
            break;
        case "詹姆斯":
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
    turnTo = posWayArr;
    ctx.strokeStyle = "green";
    ctx.beginPath();
    for (var i = 0; i < posWayArr.length; i++) {
        var x = posWayArr[i][0];
        var y = posWayArr[i][1];
        //  右下
        if (y < 9 && x < 8) {
            ctx.moveTo(x * 55 + 27 + 5, y * 55 + 27 + 5 + 15);
            ctx.lineTo(x * 55 + 27 + 5, y * 55 + 27 + 5);
            ctx.lineTo(x * 55 + 27 + 5 + 15, y * 55 + 27 + 5);
        }
        //  左下
        if (x != 0 && y < 9) {
            ctx.moveTo(x * 55 + 27 - 5, y * 55 + 27 + 5 + 15);
            ctx.lineTo(x * 55 + 27 - 5, y * 55 + 27 + 5);
            ctx.lineTo(x * 55 + 27 - 5 - 15, y * 55 + 27 + 5);
        }
        //  左上
        if (x != 0 && y != 0) {
            ctx.moveTo(x * 55 + 27 - 5, y * 55 + 27 - 5 - 15);
            ctx.lineTo(x * 55 + 27 - 5, y * 55 + 27 - 5);
            ctx.lineTo(x * 55 + 27 - 5 - 15, y * 55 + 27 - 5);
        }
        //  右上
        if (x < 8 && y != 0) {
            ctx.moveTo(x * 55 + 27 + 5, y * 55 + 27 - 5 - 15);
            ctx.lineTo(x * 55 + 27 + 5, y * 55 + 27 - 5);
            ctx.lineTo(x * 55 + 27 + 20, y * 55 + 27 - 5);
        }
    }
    ctx.stroke();
    ctx.stroke();
}
function huaAim(aimArr) {
    aimTo = aimArr;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.lineWidth = 3;
    for (var i = 0; i < aimArr.length; i++) {
        var x = aimArr[i].x * 55 + 27;
        var y = aimArr[i].y * 55 + 27;
        ctx.moveTo(x + 12, y + 22);
        ctx.lineTo(x + 22, y + 22);
        ctx.lineTo(x + 22, y + 12);
        ctx.moveTo(x - 12, y - 22);
        ctx.lineTo(x - 22, y - 22);
        ctx.lineTo(x - 22, y - 12);
        ctx.moveTo(x + 12, y - 22);
        ctx.lineTo(x + 22, y - 22);
        ctx.lineTo(x + 22, y - 12);
        ctx.moveTo(x - 12, y + 22);
        ctx.lineTo(x - 22, y + 22);
        ctx.lineTo(x - 22, y + 12);
    }
    ctx.stroke();
    ctx.stroke();
    ctx.stroke();
    ctx.closePath();
}
//  库   里的走法
function pao(data, posWayArr, aimArr) {
    var leftArr = [];
    var bottomArr = [];
    var upArr = [];
    var rightArr = [];
    //  左面
    for (var i = data.x - 1; i >= 0; i--) {
        for (var j = 0; j < allArr.length; j++) {
            if (allArr[j].x == i && allArr[j].y == data.y) {
                leftArr.push(allArr[j]);
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
        for (var j = 0; j < allArr.length; j++) {
            if (allArr[j].x == data.x && allArr[j].y == i) {
                bottomArr.push(allArr[j]);
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
        for (var j = 0; j < allArr.length; j++) {
            if (allArr[j].x == data.x && allArr[j].y == i) {
                upArr.push(allArr[j]);
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
        for (var j = 0; j < allArr.length; j++) {
            if (allArr[j].x == i && allArr[j].y == data.y) {
                rightArr.push(allArr[j]);
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
        for (var j = 0; j < allArr.length; j++) {
            if (allArr[j].x == i && allArr[j].y == data.y) {
                if (allArr[j].color != data.color) {
                    aimArr.push(allArr[j]);
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
        for (var j = 0; j < allArr.length; j++) {
            if (allArr[j].x == data.x && allArr[j].y == i) {
                if (allArr[j].color != data.color) {
                    aimArr.push(allArr[j]);
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
        for (var j = 0; j < allArr.length; j++) {
            if (allArr[j].x == data.x && allArr[j].y == i) {
                if (allArr[j].color != data.color) {
                    aimArr.push(allArr[j]);
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
        for (var j = 0; j < allArr.length; j++) {
            if (allArr[j].x == i && allArr[j].y == data.y) {
                if (allArr[j].color != data.color) {
                    aimArr.push(allArr[j]);
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
    for (var i = 0; i < allArr.length; i++) {
        if (allArr[i].y == data.y) {
            //  最左面有
            if (allArr[i].x == data.x - 1) {
                breakoutleft = true;
            }
            //  最右面有
            if (allArr[i].x == data.x + 1) {
                breakoutrihgt = true;
            }
        }
        if (allArr[i].x == data.x) {
            //  最上面有
            if (allArr[i].y == data.y - 1) {
                breakouttop = true;
            }
            //  最下面有
            if (allArr[i].y == data.y + 1) {
                breakoutbottom = true;
            }
        }
    }
    for (var i = 0; i < allArr.length; i++) {
        if (!breakoutleft) {
            if (allArr[i].x == data.x - 2) {
                if (allArr[i].y == data.y - 1) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                    var _lefttop = true;
                }
                if (allArr[i].y == data.y + 1) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                    var _leftbottom = true;
                }
            }
        }
        if (!breakoutrihgt) {
            if (allArr[i].x == data.x + 2) {
                if (allArr[i].y == data.y - 1) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                    var _righttop = true;
                }
                if (allArr[i].y == data.y + 1) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                    var _rightbottom = true;
                }
            }
        }
        if (!breakouttop) {
            if (allArr[i].y == data.y - 2) {
                if (allArr[i].x == data.x - 1) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                    var _topleft = true;
                }
                if (allArr[i].x == data.x + 1) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                    var _topright = true;
                }
            }
        }
        if (!breakoutbottom) {
            if (allArr[i].y == data.y + 2) {
                if (allArr[i].x == data.x - 1) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                    var _bottomleft = true;
                }
                if (allArr[i].x == data.x + 1) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
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
//  伦纳德的走法
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
        for (var i = 0; i < allArr.length; i++) {
            if ((allArr[i].x == zs.yanx) && (allArr[i].y == zs.yany)) {
                var _lefttop = true;
                break;
            }
        }
        if (!_lefttop) {
            var index = true;
            for (var i = 0; i < allArr.length; i++) {
                if ((allArr[i].x == zs.posx ) && (allArr[i].y == zs.posy)) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i]);
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
//  格   林的走法
function shi(data, posWayArr, aimArr) {
    var _leftTop, _leftBottom, _rightTop, _rightBottom;
    if (data.x == 4) {
        for (var i = 0; i < allArr.length; i++) {
            if (Math.abs(allArr[i].x - data.x) == 1) {
                if (allArr[i].y + 1 == data.y) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i]);
                    }
                    if (allArr[i].x < data.x) {
                        _leftTop = true;
                    } else {
                        _rightTop = true;
                    }
                }
                if (allArr[i].y - 1 == data.y) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i]);
                    }
                    if (allArr[i].x < data.x) {
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
        for (var i = 0; i < allArr.length; i++) {
            if (allArr[i].x == 4) {
                if ((Math.abs(allArr[i].y - data.y) == 1) && (allArr[i].y == 8 || allArr[i].y == 1 )) {
                    //  如果是下面那个
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
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
    for (var i = 0; i < allArr.length; i++) {
        //  只处理上下
        if (allArr[i].x == data.x) {
            //  上面有
            if ((allArr[i].y >= 0 && allArr[i].y <= 2) || (allArr[i].y >= 7 && allArr[i].y <= 9)) {
                if (allArr[i].y + 1 == data.y) {
                    _top = true;
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                }
                //  下面有
                if (allArr[i].y - 1 == data.y) {
                    _bottom = true;
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                }
            }
        }
        //  只处理左右
        if (allArr[i].y == data.y) {
            if (allArr[i].x >= 3 && allArr[i].x <= 5) {
                //  左面有
                if (allArr[i].x + 1 == data.x) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                    _left = true;
                }
                //  右面有
                if (allArr[i].x - 1 == data.x) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
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
//  比斯利布鲁尔的走法
function bingzu(data, posWayArr, aimArr) {
    var _top, _right, _left, _bottom;
    for (var i = 0; i < allArr.length; i++) {
        if (data.color == "red") {
            if ((allArr[i].x == data.x) && (allArr[i].y + 1 == data.y)) {
                if (allArr[i].color != data.color) {
                    aimArr.push(allArr[i])
                }
                _top = true;
            }
        }

        else {
            if ((allArr[i].x == data.x) && (allArr[i].y - 1 == data.y)) {
                if (allArr[i].color != data.color) {
                    aimArr.push(allArr[i])
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
        for (var i = 0; i < allArr.length; i++) {
            if (allArr[i].y == data.y) {
                if (allArr[i].x + 1 == data.x) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
                    }
                    _left = true;
                }
                if (allArr[i].x - 1 == data.x) {
                    if (allArr[i].color != data.color) {
                        aimArr.push(allArr[i])
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
    var redJ1 = {x: 0, y: 9, font: "威   少", color: "red"};
    var redJ2 = {x: 8, y: 9, font: "威   少", color: "red"};
    var redM1 = {x: 1, y: 9, font: "格里芬", color: "red"};
    var redM2 = {x: 7, y: 9, font: "格里芬", color: "red"};
    var redX1 = {x: 2, y: 9, font: "阿   伦", color: "red"};
    var redX2 = {x: 6, y: 9, font: "阿   伦", color: "red"};
    var redS1 = {x: 3, y: 9, font: "霍华德", color: "red"};
    var redS2 = {x: 5, y: 9, font: "霍华德", color: "red"};
    var redCn = {x: 4, y: 9, font: "张伯伦", color: "red"};
    var redP1 = {x: 1, y: 7, font: "库   里", color: "red"};
    var redP2 = {x: 7, y: 7, font: "库   里", color: "red"};
    var redB1 = {x: 0, y: 6, font: "比斯利", color: "red"};
    var redB2 = {x: 2, y: 6, font: "比斯利", color: "red"};
    var redB3 = {x: 4, y: 6, font: "比斯利", color: "red"};
    var redB4 = {x: 6, y: 6, font: "比斯利", color: "red"};
    var redB5 = {x: 8, y: 6, font: "比斯利", color: "red"};

    var blcJ1 = {x: 0, y: 0, font: "威   少", color: "black"};
    var blcJ2 = {x: 8, y: 0, font: "威   少", color: "black"};
    var blcM1 = {x: 1, y: 0, font: "格里芬", color: "black"};
    var blcM2 = {x: 7, y: 0, font: "格里芬", color: "black"};
    var blcX1 = {x: 2, y: 0, font: "伦纳德", color: "black"};
    var blcX2 = {x: 6, y: 0, font: "伦纳德", color: "black"};
    var blcS1 = {x: 3, y: 0, font: "格   林", color: "black"};
    var blcS2 = {x: 5, y: 0, font: "格   林", color: "black"};
    var blcCn = {x: 4, y: 0, font: "詹姆斯", color: "black"};
    var blcP1 = {x: 1, y: 4, font: "库   里", color: "black"};
    var blcP2 = {x: 7, y: 2, font: "库   里", color: "black"};
    var blcB1 = {x: 0, y: 3, font: "布鲁尔", color: "black"};
    var blcB2 = {x: 2, y: 3, font: "布鲁尔", color: "black"};
    var blcB3 = {x: 4, y: 3, font: "布鲁尔", color: "black"};
    var blcB4 = {x: 6, y: 3, font: "布鲁尔", color: "black"};
    var blcB5 = {x: 8, y: 3, font: "布鲁尔", color: "black"};
    arr = [redJ1, redJ2, redM1, redM2, redX1, redX2, redS1, redS2, redCn, redP1, redP2, redB1, redB2, redB3, redB4, redB5];
    brr = [blcJ1, blcJ2, blcM1, blcM2, blcX1, blcX2, blcS1, blcS2, blcCn, blcP1, blcP2, blcB1, blcB2, blcB3, blcB4, blcB5];
    allArr = arr.concat(brr);
}