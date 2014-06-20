define(function (require) {
  var filters, FilterBase;
  
  filters = {
    ERROR: {
      name: 'error',
      help: "the error text to search (can also include '%' characters for use with the LIKE operator; in this case only 1 value can be given)"
    },
    ERRORID: {
      name: 'error_instanceid',
      help: "limit the search to one or more error_instanceids"
    },
    DESCRIPTION: {
      name: 'description',
      help: "the description text to search (can also include '%' characters for use with the LIKE operator; in this case only 1 value can be given)"
    },
    INFO: {
      name: 'info',
      help: "the info text to search (can also include '%' characters for use with the LIKE operator; in this case only 1 value can be given"
    },
    STEPID: {
      name: 'stepid',
      help: 'limit the search to one or more stepids'
    },
    STEPNAME: {
      name: 'stepname',
      help: 'limit the search to one or more step names'
    },
    SEVERITY: {
      name: 'severity',
      help: 'limit the search to one or more severity values'
    },
    VERSION: {
      name: 'version',
      help: 'limit the search to one or more step versions'
    },
    RETRY: {
      name: 'retry',
      help: 'limit the search to errors with or without the retry flag'
    },
    BUSINESSERROR: {
      name: 'business_error',
      help: 'limit the search to errors with or without the business_error flag'
    },
    ID: {
      name: 'workflow_instanceid',
      help: 'limit the search to one or more workflow_instanceids'      
    },
    WORKFLOWID: {
      name: 'worfklowid',
      help: 'limit the search to one or more workflowids'
    },
    WORKFLOWSTATUS: {
      name: 'workflowstatus',
      help: 'limit the search to workflow instances with the given status value(s)'
    },
    MAXDATE: {
      name: 'maxdate',
      help: 'give the upper date range for the error search'
    },
    MINDATE: {
      name: 'mindate',
      help: 'give the lower date range for the error search'
    }
  };
  
  FilterBase = {
    filter: function (text) {
      
    }
  };
});