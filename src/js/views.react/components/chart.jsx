define(function (require, exports, module) {
  var Config, DoughnutConfig, ColorScheme, LineStyles;

  Config = {
    datasetFill: false,
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"legend-color-box\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
    animation: false
  };

  DoughnutConfig = _.extend({}, Config, {
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li data-idx=\"<%= i %>\"><span class=\"legend-color-box\" style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%> (<%= segments[i].value %>)<%}%></li><%}%></ul>"
  });
  
  ColorScheme = {
    clr1: "rgba(250,225,107,1)",
    clr2: "rgba(169,204,143,1)",
    clr3: "rgba(178,200,217,1)",
    clr4: "rgba(190,163,122,1)",
    clr5: "rgba(243,170,121,1)",
    clr6: "rgba(181,181,169,1)",
    clr7: "rgba(230,165,164,1)"
  };
  
  LineStyles = [
    {
      fillColor : "rgba(250,225,107,0.5)",
      strokeColor : ColorScheme.clr1,
      pointColor : ColorScheme.clr1,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(169,204,143,0.5)",
      strokeColor : ColorScheme.clr2,
      pointColor : ColorScheme.clr2,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(178,200,217,0.5)",
      strokeColor : ColorScheme.clr3,
      pointColor : ColorScheme.clr3,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(190,163,122,0.5)",
      strokeColor : ColorScheme.clr4,
      pointColor : ColorScheme.clr4,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(243,170,121,0.5)",
      strokeColor : ColorScheme.clr5,
      pointColor : ColorScheme.clr5,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(181,181,169,0.5)",
      strokeColor : ColorScheme.clr6,
      pointColor : ColorScheme.clr6,
      pointStrokeColor : "#fff"
    },
    {
      fillColor : "rgba(230,165,164,0.5)",
      strokeColor : ColorScheme.clr7,
      pointColor : ColorScheme.clr7,
      pointStrokeColor : "#fff"
    }
  ];

  return {
    ColorSchme: ColorScheme,
    LineStyles: LineStyles
  };
});