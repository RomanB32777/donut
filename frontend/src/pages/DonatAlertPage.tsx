import DonatAlertContainer from "containers/WidgetContainers/DonatAlertContainer";
import DonatWebSocketProvider from "components/DonatWebSocket";

const DonatMessagePage = () => (
  <DonatWebSocketProvider>
    <DonatAlertContainer />
  </DonatWebSocketProvider>
);

export default DonatMessagePage;
