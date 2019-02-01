const formatAppender: Function = (appender: Object): Object => ({
  id: appender.appenderid,
  type: appender.params.appenderType,
  layoutPattern: appender.params.layoutPattern,
  name: appender.params.name,
  rotationCount: appender.params.rotationCount,
  filename: appender.params.filename,
  encoding: appender.params.encoding,
});

export { formatAppender };
