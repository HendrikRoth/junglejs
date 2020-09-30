export enum Color {
	Reset = "\x1b[0m",
	Bright = "\x1b[1m",
	Dim = "\x1b[2m",
	Underscore = "\x1b[4m",
	Blink = "\x1b[5m",
	Reverse = "\x1b[7m",
	Hidden = "\x1b[8m",

	FgBlack = "\x1b[30m",
	FgRed = "\x1b[91m",
	FgGreen = "\x1b[92m",
	FgYellow = "\x1b[93m",
	FgBlue = "\x1b[94m",
	FgMagenta = "\x1b[95m",
	FgCyan = "\x1b[96m",
	FgWhite = "\x1b[97m"
}

export default function(color: string, message: string) {
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
