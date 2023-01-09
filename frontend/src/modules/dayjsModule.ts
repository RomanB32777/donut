import dayjs, { ManipulateType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const dayjsModule = dayjs;

export type { ManipulateType };
export default dayjsModule;
