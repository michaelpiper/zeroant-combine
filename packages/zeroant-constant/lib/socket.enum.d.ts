export declare enum WebSocketCloseCode {
    CLOSE_NORMAL = 1000,
    CLOSE_GOING_AWAY = 1001,
    CLOSE_PROTOCOL_ERROR = 1002,
    CLOSE_UNSUPPORTED = 1003,
    CLOSED_NO_STATUS = 1005,
    CLOSE_ABNORMAL = 1006,
    UNSUPPORTED_PAYLOAD = 1007,
    SERVICE_RESTART = 1012
}
export declare enum SocketEvent {
    CONNECTION = "connection",
    CLOSE = "close",
    MESSAGE = "message"
}
