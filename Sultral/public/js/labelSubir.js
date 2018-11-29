var inputs = document.querySelectorAll( '.inputfile' );
Array.prototype.forEach.call( inputs, function( input )
{
	var label	 = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener( 'change', function( e )
	{
		var fileName = '';
		
	    fileName = e.target.value.split( '\\' ).pop();

        if(fileName){
            console.log(fileName);
			label.querySelector( 'span' ).innerHTML = fileName;
        }else
			label.innerHTML = labelVal;
	});
});