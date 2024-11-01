"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionStatus = void 0;
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["PENDING"] = "pending";
    ConnectionStatus["ACCEPTED"] = "accepted";
    ConnectionStatus["REJECTED"] = "rejected";
    ConnectionStatus["RECEIVED"] = "received";
    ConnectionStatus["NOT_CONNECTED"] = "not_connected";
})(ConnectionStatus || (exports.ConnectionStatus = ConnectionStatus = {}));
