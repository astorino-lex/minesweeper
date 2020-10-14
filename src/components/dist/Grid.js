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
var Sqaure_1 = require("./Sqaure");
require("../AllGame.scss");
var replay_png_1 = require("../icons/replay.png");
var STATE_HIDDEN = "hidden";
var STATE_SHOWN = "shown";
var STATE_MARKED = "marked";
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(props) {
        var _this = _super.call(this, props) || this;
        _this.createGrid = function () {
            var rows = [];
            for (var i = 0; i < _this.props.height; i++) {
                var columns = [];
                for (var j = 0; j < _this.props.width; j++) {
                    columns.push(react_1["default"].createElement("td", { key: i + "," + j, style: { backgroundColor: _this.getColor(i, j) } },
                        react_1["default"].createElement(Sqaure_1["default"], { mines: _this.props.mines, exploded: _this.state.exploded, data: _this.state.gridData[i][j], onLeftClick: _this.handleLeftClick, onRightClick: _this.handleRightClick })));
                }
                rows.push(react_1["default"].createElement("tr", { key: i }, columns));
            }
            return rows;
        };
        _this.generateGridData = function () {
            var data = [];
            for (var i = 0; i < _this.props.height; i++) {
                data.push([]);
                for (var j = 0; j < _this.props.width; j++) {
                    data[i][j] = {
                        id: i + "," + j,
                        count: 0,
                        state: STATE_HIDDEN,
                        isMine: false
                    };
                }
            }
            return data;
        };
        //mark/flag
        _this.handleRightClick = function (row, col, e) {
            e.preventDefault();
            if (!_this.isValidCoordinate(row, col))
                return false;
            // if cell is already shown, do nothing
            if (_this.state.gridData[row][col].state === STATE_SHOWN)
                return false;
            var updatedGridData = _this.state.gridData;
            updatedGridData[row][col].state = updatedGridData[row][col].state === STATE_MARKED ? STATE_HIDDEN : STATE_MARKED;
            _this.setState(function (prev) {
                return (__assign(__assign({}, prev), { markedSqaures: updatedGridData[row][col].state === STATE_MARKED ? prev.markedSqaures + 1 : prev.markedSqaures - 1, gridData: updatedGridData }));
            }, function () { return _this.props.updateFlagCount(_this.state.markedSqaures); });
            return true;
        };
        //uncover
        _this.handleLeftClick = function (row, col) {
            if (!_this.isValidCoordinate(row, col))
                return false;
            //first move
            if (_this.state.uncoveredSquares === 0) {
                _this.generateMines(row, col);
                _this.props.startCounting();
            }
            //if sqaure is already revealed or marked, do nothing
            if (_this.state.gridData[row][col].state !== STATE_HIDDEN)
                return false;
            var updatedGridData = _this.state.gridData;
            _this.reveal(row, col, updatedGridData);
            _this.setState(function (prev) {
                return (__assign(__assign({}, prev), { gridData: updatedGridData }));
            });
            if (_this.state.gridData[row][col].isMine) {
                _this.setState(function (prev) { return (__assign(__assign({}, prev), { exploded: true })); });
                _this.props.stopCountingTime();
            }
            return true;
        };
        _this.reveal = function (r, c, updatedGridData) {
            if (!_this.isValidCoordinate(r, c))
                return;
            //if already shown or marked, dont reveal
            if (_this.state.gridData[r][c].state !== STATE_HIDDEN)
                return;
            updatedGridData[r][c].state = STATE_SHOWN;
            _this.setState(function (prev) { return (__assign(__assign({}, prev), { uncoveredSquares: prev.uncoveredSquares + 1 })); }, function () {
                if (_this.state.uncoveredSquares === _this.props.height * _this.props.width - _this.props.mines && !_this.state.exploded) {
                    _this.props.stopCountingTime();
                }
            });
            //if neighbours have mines, return
            if (_this.state.gridData[r][c].count !== 0)
                return;
            _this.reveal(r - 1, c - 1, updatedGridData);
            _this.reveal(r - 1, c, updatedGridData);
            _this.reveal(r - 1, c + 1, updatedGridData);
            _this.reveal(r, c - 1, updatedGridData);
            _this.reveal(r, c + 1, updatedGridData);
            _this.reveal(r + 1, c - 1, updatedGridData);
            _this.reveal(r + 1, c, updatedGridData);
            _this.reveal(r + 1, c + 1, updatedGridData);
        };
        _this.generateMines = function (row, col) {
            var _a;
            var newGridData = _this.state.gridData;
            //generate coordinated that are allowed to have mines
            var allowedCoorindates = [];
            for (var r = 0; r < _this.props.height; r++) {
                for (var c = 0; c < _this.props.width; c++) {
                    if (Math.abs(row - r) > 2 || Math.abs(col - c) > 2) {
                        allowedCoorindates.push([r, c]);
                    }
                }
            }
            //randomly decide mine coordinates from allowed coordinates
            var totalMines = Math.min(_this.props.mines, allowedCoorindates.length);
            for (var i = 0; i < totalMines; i++) {
                var j = _this.randomNumber(i, allowedCoorindates.length - 1);
                _a = [allowedCoorindates[j], allowedCoorindates[i]], allowedCoorindates[i] = _a[0], allowedCoorindates[j] = _a[1];
                var _b = allowedCoorindates[i], r = _b[0], c = _b[1];
                newGridData[r][c].isMine = true;
            }
            //clear any previously marked sqaures and update counts
            for (var r = 0; r < _this.props.height; r++) {
                for (var c = 0; c < _this.props.width; c++) {
                    if (newGridData[r][c].state === STATE_MARKED) {
                        newGridData[r][c].state = STATE_HIDDEN;
                    }
                    newGridData[r][c].count = _this.count(r, c, newGridData);
                }
            }
            _this.setState(function (prev) { return (__assign(__assign({}, prev), { gridData: newGridData, markedSqaures: 0 })); }, function () { return _this.props.updateFlagCount(_this.state.markedSqaures); });
        };
        _this.randomNumber = function (min, max) {
            var _a;
            _a = [Math.ceil(min), Math.floor(max)], min = _a[0], max = _a[1];
            return min + Math.floor(Math.random() * (max - min + 1));
        };
        _this.count = function (row, col, gridData) {
            var c = function (r, c) {
                return (_this.isValidCoordinate(r, c) && gridData[r][c].isMine ? 1 : 0);
            };
            var res = 0;
            for (var dr = -1; dr <= 1; dr++) {
                for (var dc = -1; dc <= 1; dc++) {
                    res += c(row + dr, col + dc);
                }
            }
            return res;
        };
        _this.isValidCoordinate = function (row, col) {
            return row >= 0 && row < _this.props.height && col >= 0 && col < _this.props.width;
        };
        _this.handleReplay = function () {
            _this.setState(function (prev) {
                return (__assign(__assign({}, prev), { gridData: _this.generateGridData(), exploded: false, markedSqaures: 0, uncoveredSquares: 0 }));
            }, function () { return _this.props.updateFlagCount(_this.state.markedSqaures); });
            _this.props.resetCountingTime();
        };
        _this.getColor = function (row, col) {
            var color1 = "#99D599";
            var color2 = "#83D183";
            if (_this.state.gridData[row][col].state === STATE_SHOWN) {
                color1 = "#E4DEB8";
                color2 = "#E2DAAC";
            }
            if (_this.state.gridData[row][col].isMine && _this.state.exploded) {
                return "#D34949";
            }
            if (!_this.isEven(row)) {
                return _this.isEven(col) ? color1 : color2;
            }
            else {
                return _this.isEven(col) ? color2 : color1;
            }
        };
        _this.isEven = function (value) {
            if (value % 2 === 0)
                return true;
            else
                return false;
        };
        _this.state = {
            uncoveredSquares: 0,
            gridData: _this.generateGridData(),
            exploded: false,
            markedSqaures: 0
        };
        return _this;
    }
    Grid.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var _this = this;
        if (nextProps.mines !== this.props.mines) {
            this.setState(function (prev) {
                return (__assign(__assign({}, prev), { gridData: _this.generateGridData(), exploded: false, markedSqaures: 0, uncoveredSquares: 0 }));
            });
            return false;
        }
        return true;
    };
    Grid.prototype.render = function () {
        var winner = !this.state.exploded && this.state.uncoveredSquares === this.props.height * this.props.width - this.props.mines;
        var loser = this.state.exploded;
        return (react_1["default"].createElement("div", { style: { position: "relative" } },
            winner || loser ?
                react_1["default"].createElement("div", { className: "finish-message" },
                    react_1["default"].createElement("div", null, winner ?
                        "You Won!"
                        : "You Lost!"),
                    react_1["default"].createElement("div", { className: "play-again", onClick: this.handleReplay },
                        "Play again",
                        react_1["default"].createElement("img", { src: replay_png_1["default"], width: 35, alt: "replay" })))
                : null,
            react_1["default"].createElement("table", { className: "grid", style: { pointerEvents: this.state.exploded ? 'none' : 'auto' } },
                react_1["default"].createElement("tbody", null, this.createGrid()))));
    };
    return Grid;
}(react_1["default"].Component));
exports["default"] = Grid;
