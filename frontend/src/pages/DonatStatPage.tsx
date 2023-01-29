import DonatStatContainer from "containers/WidgetContainers/DonatStatContainer";
import DonatWebSocketProvider from "contexts/DonatWebSocket";

const DonatStatPage = () => (
  <DonatWebSocketProvider>
    <DonatStatContainer />
  </DonatWebSocketProvider>
);

export default DonatStatPage;
