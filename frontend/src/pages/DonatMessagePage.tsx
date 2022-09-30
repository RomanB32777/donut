import DonatMessageContainer from "../containers/WidgetContainers/DonatMessageContainer";
import DonatWebSocketProvider from "../components/DonatWebSocket";

const DonatMessagePage = () => (
  <DonatWebSocketProvider>
    <DonatMessageContainer />
  </DonatWebSocketProvider>
);

export default DonatMessagePage;
