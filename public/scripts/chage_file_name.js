		var input = document.getElementById('customfile');
		var label = document.getElementById('file_name');
		input.addEventListener( 'change', showFileName );
		function showFileName( event ) {
			var input = event.srcElement;
			var fileName = input.files[0].name;
			label.textContent = fileName;
		}