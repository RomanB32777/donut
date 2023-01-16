import DonatStatContainer from "containers/WidgetContainers/DonatStatContainer";
import DonatWebSocketProvider from "components/DonatWebSocket";

const DonatStatPage = () => (
  <DonatWebSocketProvider>
    <DonatStatContainer />
  </DonatWebSocketProvider>
);

export default DonatStatPage;
