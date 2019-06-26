import includes from 'lodash/includes';

const formatAppender: Function = (appender: Object): Object => ({
  id: appender.appenderid || appender.logger_appenderid,
  type: appender.params.appenderType,
  layoutPattern: appender.params.layoutPattern,
  name: appender.params.name,
  rotationCount: appender.params.rotationCount,
  filename: appender.params.filename,
  encoding: appender.params.encoding,
  archivePattern: appender.params.archivePattern,
});

const getLoggerIntfcType: Function = (intfc: string): string =>
  includes(
    ['http', 'audit', 'monitoring', 'alert', 'qorus-core', 'qorus-master'],
    intfc
  )
    ? 'system'
    : intfc;

export { formatAppender, getLoggerIntfcType };
