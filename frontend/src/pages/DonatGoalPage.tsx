import DonatGoalContainer from "../containers/WidgetContainers/DonatGoalContainer";
import DonatWebSocketProvider from "../components/DonatWebSocket";

const DonatGoalPage = () => (
  <DonatWebSocketProvider>
    <DonatGoalContainer />
  </DonatWebSocketProvider>
);

export default DonatGoalPage;
