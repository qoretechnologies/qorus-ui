(function($){
  jQuery.each( [ "put", "delete" ], function( i, method ) {
  	jQuery[ method ] = function( url, data, callback, type ) {
  		// shift arguments if data argument was omitted
  		if ( jQuery.isFunction( data ) ) {
  			type = type || callback;
  			callback = data;
  			data = undefined;
  		}

  		return jQuery.ajax({
  			url: url,
  			type: method,
  			data: JSON.stringify(data),
  			success: callback,
        dataType: 'json',
        contentType: 'application/json',
        processData: false
  		});
  	};
  });
})(jQuery);