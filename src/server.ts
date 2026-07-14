import colors from "colors";
import app from "./app";
import config from "./config/index";
import { createServer } from "http";

const port =
  typeof config.port === "number" ? config.port : Number(config.port);

const httpServer = createServer(app);

httpServer.listen(port, () => {
  console.log(
    colors.green.bold(
      `Buddy Script Server is running on port http://${config.ip_address}:${port}`,
    ),
  );
});
