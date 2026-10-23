import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { uuidFactory } from "./packages/foundation/src/infrastructure/adapters/entity/uuid/cryptouuid";
import {
  uuidAssertFn,
  uuidValidator,
} from "./packages/foundation/src/infrastructure/adapters/entity/uuid/entity-id";
import {
  YYYMMDDHHmmssFactory,
  YYYMMDDHHmmssAssertFn,
  validateYYYYMMDDHHmmss,
  YYYMMDDHHmmssNormalizer,
} from "./packages/foundation/src/infrastructure/adapters/timestamp/YYYMMDDHHmmss/timestamp";
import {
  setEntityIdFactory,
  setEntityIdAssertionFn,
  setEntityIdValidationFn,
} from "./packages/foundation/src/infrastructure/core/entity/entity-id";
import {
  setTimestampFactory,
  setTimestampAssertionFn,
  setTimestampValidationFn,
  setConvertDateToTimestampFn,
} from "./packages/foundation/src/infrastructure/core/timestamp/timestamp";

setEntityIdFactory(uuidFactory);
setEntityIdAssertionFn(uuidAssertFn);
setEntityIdValidationFn(uuidValidator);
setTimestampFactory(YYYMMDDHHmmssFactory);
setTimestampAssertionFn(YYYMMDDHHmmssAssertFn);
setTimestampValidationFn(validateYYYYMMDDHHmmss);
setConvertDateToTimestampFn(YYYMMDDHHmmssNormalizer);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
