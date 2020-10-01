"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
var Color;
(function (Color) {
    Color["Reset"] = "\u001B[0m";
    Color["Bright"] = "\u001B[1m";
    Color["Dim"] = "\u001B[2m";
    Color["Underscore"] = "\u001B[4m";
    Color["Blink"] = "\u001B[5m";
    Color["Reverse"] = "\u001B[7m";
    Color["Hidden"] = "\u001B[8m";
    Color["FgBlack"] = "\u001B[30m";
    Color["FgRed"] = "\u001B[91m";
    Color["FgGreen"] = "\u001B[92m";
    Color["FgYellow"] = "\u001B[93m";
    Color["FgBlue"] = "\u001B[94m";
    Color["FgMagenta"] = "\u001B[95m";
    Color["FgCyan"] = "\u001B[96m";
    Color["FgWhite"] = "\u001B[97m";
})(Color = exports.Color || (exports.Color = {}));
function default_1(color, message) {
    switch (color) {
        case "green":
            console.log(Color.Bright + Color.FgGreen + message + Color.Reset);
            break;
        case "red":
            console.log(Color.Bright + Color.FgRed + message + Color.Reset);
            break;
        default:
            console.log(message);
    }
}
exports.default = default_1;
