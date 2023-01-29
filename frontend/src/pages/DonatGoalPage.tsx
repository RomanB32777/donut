import DonatGoalContainer from "containers/WidgetContainers/DonatGoalContainer";
import DonatWebSocketProvider from "contexts/DonatWebSocket";

const DonatGoalPage = () => (
  <DonatWebSocketProvider>
    <DonatGoalContainer />
  </DonatWebSocketProvider>
);

export default DonatGoalPage;
