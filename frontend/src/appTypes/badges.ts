import { IBadgeInfo } from "types";
import { IFileInfo } from "./files";

interface IBadge extends IBadgeInfo<IFileInfo> {}

export type { IBadge };
