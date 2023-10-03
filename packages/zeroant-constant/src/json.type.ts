export type JsonArgumentValue =
  | number
  | string
  | boolean
  | null
  | JsonTaggedValue
  | JsonArgumentValue[]
  | {
      [key: string]: JsonArgumentValue
    }

export type JsonArray = JsonValue[]

export interface JsonConvertible {
  toJSON: () => unknown
}

export interface JsonFieldSelection {
  arguments?: Record<string, JsonArgumentValue>
  selection: JsonSelectionSet
}

export type JsonObject = {
  [Key in string]?: JsonValue
}

export interface JsonQuery {
  modelName?: string
  action: JsonQueryAction
  query: JsonFieldSelection
}

export type JsonQueryAction =
  | 'findUnique'
  | 'findUniqueOrThrow'
  | 'findFirst'
  | 'findFirstOrThrow'
  | 'findMany'
  | 'createOne'
  | 'createMany'
  | 'updateOne'
  | 'updateMany'
  | 'deleteOne'
  | 'deleteMany'
  | 'upsertOne'
  | 'aggregate'
  | 'groupBy'
  | 'executeRaw'
  | 'queryRaw'
  | 'runCommandRaw'
  | 'findRaw'
  | 'aggregateRaw'

export type JsonSelectionSet = {
  $scalars?: boolean
  $composites?: boolean
} & Record<string, boolean | JsonFieldSelection>

export interface JsonTaggedValue {
  $type: 'Json'
  value: string
}

export type JsonValue = string | number | boolean | JsonObject | JsonArray | null
