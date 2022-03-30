import includes from 'lodash/includes';

const formatAppender: Function = (appender: Object): Object => ({
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'appenderid' does not exist on type 'Obje... Remove this comment to see the full error message
  id: appender.appenderid || appender.logger_appenderid,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  type: appender.params.appenderType,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  layoutPattern: appender.params.layoutPattern,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  name: appender.params.name,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  rotationCount: appender.params.rotationCount,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  filename: appender.params.filename,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  encoding: appender.params.encoding,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
  archivePattern: appender.params.archivePattern,
});

const getLoggerIntfcType: Function = (
  loggerList: string[],
  intfc: string
): string => (includes(loggerList, intfc) ? 'system' : intfc);

export { formatAppender, getLoggerIntfcType };
