export declare enum Color {
    Reset = "\u001B[0m",
    Bright = "\u001B[1m",
    Dim = "\u001B[2m",
    Underscore = "\u001B[4m",
    Blink = "\u001B[5m",
    Reverse = "\u001B[7m",
    Hidden = "\u001B[8m",
    FgBlack = "\u001B[30m",
    FgRed = "\u001B[91m",
    FgGreen = "\u001B[92m",
    FgYellow = "\u001B[93m",
    FgBlue = "\u001B[94m",
    FgMagenta = "\u001B[95m",
    FgCyan = "\u001B[96m",
    FgWhite = "\u001B[97m"
}
export default function (color: string, message: string): void;
