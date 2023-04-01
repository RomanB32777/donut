import dayjs, { ManipulateType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// import "dayjs/locale/ru";
// import "dayjs/locale/en";
// import "dayjs/locale/pt";
// import "dayjs/locale/es";

dayjs.extend(relativeTime);
const dayjsModule = dayjs;

export type { ManipulateType };
export default dayjsModule;
