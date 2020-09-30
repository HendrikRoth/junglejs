export default function normalizePort(val: string | number): number {
  let port: number;
  if (typeof val === "string") {
    port = parseInt(val, 10);
    if (isNaN(port))
      throw new Error("Could not normalize the port " + val);
  }
  else return val;

  if (port >= 0) return port;
  throw new Error("Could not normalize the port " + val);
}
