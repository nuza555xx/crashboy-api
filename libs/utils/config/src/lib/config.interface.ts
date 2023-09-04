export interface JwtConfig {
  secret: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface RedisConfig {
  host: string;
  password: string;
  port: number;
  db: number;
  ttl: number;
  store?: unknown;
}

export interface MongooseConfig {
  uri: string;
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

export interface ThrottlerConfig {
  limit: number;
  ttl: number;
}

export interface StorageConfig {
  apiEndpoint: string;
  projectId: string;
  clientEmail: string;
  clientId: string;
  privateKey: string;
  bucketName: string;
  expired: number;
}
