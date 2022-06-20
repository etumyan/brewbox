import jsonRequire from '../utils/json-require';
import logger from '../utils/logger';

export function version() {
  const { version } = jsonRequire('../../package.json');
  logger.log(version);
}