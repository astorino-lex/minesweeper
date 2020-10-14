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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
require("../AllGame.scss");
var redFlag_png_1 = require("../icons/redFlag.png");
var stopwatch_png_1 = require("../icons/stopwatch.png");
var Grid_1 = require("./Grid");
var difficultyLevels = ["Easy", "Medium"];
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            difficultyLevel: "Easy",
            mines: 10,
            gridHeight: 8,
            gridWidth: 10,
            flags: 10,
            timeCount: 0,
            intervalId: 0
        };
        _this.handleChange = function (e) {
            var selectedOption = e.target.value;
            if (_this.state.difficultyLevel !== selectedOption) {
                clearInterval(_this.state.intervalId);
                _this.setState(function (prev) { return (__assign(__assign({}, prev), { timeCount: 0 })); });
            }
            var mines;
            var gridHeight;
            var gridWidth;
            if (selectedOption === difficultyLevels[0]) {
                mines = 10;
                gridHeight = 8;
                gridWidth = 10;
            }
            else if (selectedOption === difficultyLevels[1]) {
                mines = 40;
                gridHeight = 14;
                gridWidth = 18;
            }
            _this.setState(function (prev) { return (__assign(__assign({}, prev), { difficultyLevel: selectedOption, mines: mines, gridHeight: gridHeight, gridWidth: gridWidth, flags: mines })); });
        };
        _this.updateFlagCount = function (markedSquares) { return _this.setState(function (prev) { return (__assign(__assign({}, prev), { flags: _this.state.mines - markedSquares })); }); };
        _this.startCountingTime = function () {
            var intervalId = setInterval(function () { _this.setState(function (prev) { return (__assign(__assign({}, prev), { timeCount: prev.timeCount + 1 })); }); }, 1000);
            _this.setState(function (prev) { return (__assign(__assign({}, prev), { intervalId: intervalId })); });
        };
        _this.stopCountingTime = function () {
            clearInterval(_this.state.intervalId);
        };
        _this.resetCountingTime = function () {
            clearInterval(_this.state.intervalId);
            _this.setState(function (prev) { return (__assign(__assign({}, prev), { timeCount: 0 })); });
        };
        return _this;
    }
    Game.prototype.render = function () {
        return (react_1["default"].createElement("div", null,
            react_1["default"].createElement("div", { className: "game" },
                react_1["default"].createElement("div", { className: "toolbar" },
                    react_1["default"].createElement("select", { onChange: this.handleChange, value: this.state.difficultyLevel, className: "select-difficulty" }, difficultyLevels.map(function (level) {
                        return react_1["default"].createElement("option", { key: level, value: level }, level);
                    })),
                    react_1["default"].createElement("div", { className: "img-wrapper" },
                        react_1["default"].createElement("span", null,
                            react_1["default"].createElement("img", { src: redFlag_png_1["default"], width: 30, alt: "flag" }),
                            this.state.flags),
                        react_1["default"].createElement("span", null,
                            react_1["default"].createElement("img", { src: stopwatch_png_1["default"], width: 30, alt: "flag" }),
                            ("00" + this.state.timeCount).slice(-3)))),
                react_1["default"].createElement(Grid_1["default"], { mines: this.state.mines, height: this.state.gridHeight, width: this.state.gridWidth, updateFlagCount: this.updateFlagCount, startCounting: this.startCountingTime, stopCountingTime: this.stopCountingTime, resetCountingTime: this.resetCountingTime }))));
    };
    return Game;
}(react_1["default"].Component));
exports["default"] = Game;
