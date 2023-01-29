import DonatAlertContainer from "containers/WidgetContainers/DonatAlertContainer";
import DonatWebSocketProvider from "contexts/DonatWebSocket";

const DonatAlertPage = () => (
  <DonatWebSocketProvider>
    <DonatAlertContainer />
  </DonatWebSocketProvider>
);

export default DonatAlertPage;
