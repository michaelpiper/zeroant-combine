export var WebSocketCloseCode;
(function (WebSocketCloseCode) {
    WebSocketCloseCode[WebSocketCloseCode["CLOSE_NORMAL"] = 1000] = "CLOSE_NORMAL";
    WebSocketCloseCode[WebSocketCloseCode["CLOSE_GOING_AWAY"] = 1001] = "CLOSE_GOING_AWAY";
    WebSocketCloseCode[WebSocketCloseCode["CLOSE_PROTOCOL_ERROR"] = 1002] = "CLOSE_PROTOCOL_ERROR";
    WebSocketCloseCode[WebSocketCloseCode["CLOSE_UNSUPPORTED"] = 1003] = "CLOSE_UNSUPPORTED";
    WebSocketCloseCode[WebSocketCloseCode["CLOSED_NO_STATUS"] = 1005] = "CLOSED_NO_STATUS";
    WebSocketCloseCode[WebSocketCloseCode["CLOSE_ABNORMAL"] = 1006] = "CLOSE_ABNORMAL";
    WebSocketCloseCode[WebSocketCloseCode["UNSUPPORTED_PAYLOAD"] = 1007] = "UNSUPPORTED_PAYLOAD";
    WebSocketCloseCode[WebSocketCloseCode["SERVICE_RESTART"] = 1012] = "SERVICE_RESTART";
})(WebSocketCloseCode || (WebSocketCloseCode = {}));
export var SocketEvent;
(function (SocketEvent) {
    SocketEvent["CONNECTION"] = "connection";
    SocketEvent["CLOSE"] = "close";
    SocketEvent["MESSAGE"] = "message";
})(SocketEvent || (SocketEvent = {}));
//# sourceMappingURL=socket.enum.js.map