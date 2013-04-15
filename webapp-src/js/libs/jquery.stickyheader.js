function makeTableHeadersSticky(tableId, offset){
    //collect widths of all the th elements
    var thArr = $(tableId + " th");
    //create an array to hold the auto calculated widths of each element
    var thWidthsArr = [];
    $(tableId + " th").each(function(){
        thWidthsArr.push($(this).css("width"));
    });
    var pos = $(tableId).offset();
    //set the distance of the table from the top,
    //we ll need to make the headers sticky when this distance is 0  
    var thTop = pos.top + "px";
    //set the widths of the first and last tr's ths/tds...
    //this is done coz in some cases,
    //the widths will get messed up if the data was generated dynamically
    var count = 0;
    $(tableId + " tr:first-child>th").each(function(){
        $(this).css("width", thWidthsArr[count]);
        count++;
    });
    count = 0;
    $(tableId + " tr:last-child>td").each(function(){
        $(this).css("width", thWidthsArr[count]);
        count++;
    });
    $(window).scroll(function(){
        if($(window).scrollTop() > pos.top)
        {
            $(tableId + " thead tr")
              .css("position", "fixed")
              .css("top", "0px");
        }
        else
        {
            $(tableId + " thead tr")
              .css("position", "relative")
              .css("top", thTop);
        }
    });
}
  
makeTableHeadersSticky('.table-fixed', -100);

// // sticky header
// var hw = [], bw = [];
// $('.table-fixed thead').css('display', 'block').width('100%');
// $('.table-fixed tbody').css('display', 'block').width('100%');
//     
// $('.table-fixed thead tr:first-child th').each(function(){
//   hw.push($(this).width());
// });
//     
// $('.table-fixed tbody tr:first-child td').each(function(){
//   bw.push($(this).width());
// });
//     
// var count = 0;
// $('.table-fixed thead tr:first-child th').each(function(){
//   $(this).width(Math.max(hw[count], bw[count]));
//   $(this).css('overflow', 'hidden');
//   count++;
// });
// count = 0;
// $('.table-fixed tbody tr:first-child td').each(function(){
//   $(this).width(Math.max(hw[count], bw[count]));
//   count++;
// });
