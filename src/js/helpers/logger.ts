import includes from 'lodash/includes';

const formatAppender: Function = (appender: Object): Object => ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'appenderid' does not exist on type 'Obje... Remove this comment to see the full error message
  id: appender.appenderid || appender.logger_appenderid,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  type: appender.params.appenderType,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  layoutPattern: appender.params.layoutPattern,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  name: appender.params.name,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  rotationCount: appender.params.rotationCount,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  filename: appender.params.filename,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  encoding: appender.params.encoding,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  archivePattern: appender.params.archivePattern,
});

const getLoggerIntfcType: Function = (loggerList: string[], intfc: string): string =>
  includes(loggerList, intfc) ? 'system' : intfc;

export { formatAppender, getLoggerIntfcType };
