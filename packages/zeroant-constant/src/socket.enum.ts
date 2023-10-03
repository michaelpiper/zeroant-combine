export enum WebSocketCloseCode {
  CLOSE_NORMAL = 1000, // No No Successful operation / regular socket shutdown
  CLOSE_GOING_AWAY = 1001, // No No Client is leaving (browser tab closing)
  CLOSE_PROTOCOL_ERROR = 1002, // Yes No Endpoint received a malformed frame
  CLOSE_UNSUPPORTED = 1003, // Yes  No Endpoint received an unsupported frame (e.g. binary-only endpoint received text frame)
  // 1004  // Yes No Reserved
  CLOSED_NO_STATUS = 1005, // Yes No Expected close status, received none
  CLOSE_ABNORMAL = 1006, // Yes No No close code frame has been received
  UNSUPPORTED_PAYLOAD = 1007, // Unsupported payload // Yes No Endpoint received inconsistent message (e.g. malformed UTF-8)
  // 1008 Policy violation // No No Generic code used for situations other than 1003 and 1009
  // 1009 CLOSE_TOO_LARGE // No No Endpoint won't process large frame
  // 1010 Mandatory extension // No No Client wanted an extension which server did not negotiate
  SERVICE_RESTART = 1012 // Service restart // No No Server/service is restarting
  // 1013 Try again later // No No Temporary server condition forced blocking client's request
  // 1014 Bad gateway // No No Server acting as gateway received an invalid response
  // 1015 TLS handshake  //fail Yes No Transport Layer Security handshake failure
  // 1016 - 1999 // Yes No Reserved for later
  // 2000 - 2999 // Yes Yes Reserved for websocket extensions
  // 3000 - 3999  // No Yes Registered first come first serve at IANA
  // 4000 - 4999  // No Yes Available for applications
}
export enum SocketEvent {
  CONNECTION = 'connection',
  CLOSE = 'close',
  MESSAGE = 'message'
}
