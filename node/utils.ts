import * as path from "path";

export const resolvePath = (p: string) => path.resolve(__dirname, "..", p);
