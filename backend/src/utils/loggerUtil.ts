import * as winston from 'winston'

/**
 * Create a logger instance to write log messages in JSON format.
 *
 * @param loggerName - a name of a logger that will be added to all messages
 */
export const createLogger = (loggerName: string) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { name: loggerName },
    transports: [new winston.transports.Console()]
  })
}

/** Logger name constants */
export const LOG_NAME = {
  DOC_CLIENTS: 'DocumentClient',
  AUTH0_AUTH: 'Auth0Authorizer',
  COMMON_REPO: 'CommonRepository',
  TODO_REPO: 'TodoRepositories',
  TODO_SERVICE: 'TodoService',
  GENERATE_UPLOAD_URL: 'GenerateUploadUrl',
  CREATE_TODO: 'CreateTodo',
  DELETE_TODO: 'DeleteTodo',
  GET_TODOS: 'GetTodos',
  UPDATE_TODO: 'UpdateTodo',
  USER_REPO: 'UserRepository',
  USER_SERVICE: 'UserService',
  CREATE_USER: 'CreateUser',
  GET_ALL_USER: 'GetAllUser',
  GET_USER_INFO: 'GetUserInfo',
  UPDATE_USER_INFO: 'UpdateUserInfo',
  CHAT_REPO: 'ChatRepository',
  CHAT_SERVICE: 'ChatService',
  CHAT_SEND_MESSAGE: 'SendNewMessage',
  CHAT_GET_ALL_MESSAGE: 'GetAllMessage',
  CONNECTION_REPO: 'ConnectionRepository',
  CONNECTION_SERVICE: 'ConnectionService',
  CONNECTION_OPEN: 'Connect',
  CONNECTION_CLOSE: 'Disconect'
}
