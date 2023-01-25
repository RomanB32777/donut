import DonatAlertContainer from "containers/WidgetContainers/DonatAlertContainer";
import DonatWebSocketProvider from "components/DonatWebSocket";

const DonatAlertPage = () => (
  <DonatWebSocketProvider>
    <DonatAlertContainer />
  </DonatWebSocketProvider>
);

export default DonatAlertPage;
