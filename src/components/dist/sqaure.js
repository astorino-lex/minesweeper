"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var react_1 = require("react");
var mine_png_1 = require("../icons/mine.png");
var redFlag_png_1 = require("../icons/redFlag.png");
var STATE_HIDDEN = "hidden";
var STATE_MARKED = "marked";
var Sqaure = /** @class */ (function (_super) {
    __extends(Sqaure, _super);
    function Sqaure() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getCountColor = function (count) {
            if (count === 2) {
                return "#2ACD2A";
            }
            else if (count === 3) {
                return "#F39C12";
            }
            else if (count === 4) {
                return "#E74C3C";
            }
            else if (count === 5) {
                return "#7B241C";
            }
            else if (count === 6) {
                return "#4A235A";
            }
            return "#666";
        };
        return _this;
    }
    Sqaure.prototype.render = function () {
        var _this = this;
        var location = this.props.data.id.split(",");
        var row = parseInt(location[0]);
        var column = parseInt(location[1]);
        var medium = this.props.mines === 40;
        var count = this.props.data.count;
        return (react_1["default"].createElement("div", { style: { height: medium ? '30px' : '52px', fontSize: medium ? '18px' : '25px', textAlign: 'center' }, onClick: function () { return _this.props.onLeftClick(row, column); }, onContextMenu: function (e) { return _this.props.onRightClick(row, column, e); } }, this.props.exploded && this.props.data.isMine ?
            react_1["default"].createElement("img", { src: mine_png_1["default"], width: medium ? "25" : "30", alt: "mine" })
            : this.props.data.state === STATE_HIDDEN ?
                " "
                : this.props.data.state === STATE_MARKED ?
                    react_1["default"].createElement("img", { src: redFlag_png_1["default"], width: medium ? "25" : "30", alt: "flag" })
                    : react_1["default"].createElement("div", { style: { fontSize: medium ? '20px' : '30px',
                            color: count !== 0 ? this.getCountColor(count) : "#666" } }, count !== 0 ?
                        count
                        : null)));
    };
    return Sqaure;
}(react_1["default"].Component));
exports["default"] = Sqaure;
