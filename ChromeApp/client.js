$(function(){

	var $files = $('#filesPanel');
	var $preview = $('#previewPanel');

	var f = {};

	var gf;

	function exportToFileEntry(fileEntry) {
		gf = fileEntry;
							console.log(fileEntry);
							console.log('-------');
		var directoryReader = fileEntry.createReader();
		console.log(directoryReader);
	directoryReader.readEntries(function(entries) {
		console.log(entries);
		for(var i in entries){
			
			f[entries[i].name] = entries[i];
			chrome.fileSystem.getDisplayPath(entries[i], function(displayPath){
				//$files.append($('<span class="photo" data-path="' + displayPath + '">' + entries[i].name + '</span><br/>'));
			});
			$files.append($('<span class="photo" data-path="' + entries[i].name + '">' + entries[i].name + '</span><br/>'));
		}
	});

	console.log('!');
	fileEntry.getFile('400.jpg', {}, function(f){
		f.file(function(file){
			var reader = new FileReader();
			reader.onloadend = function(e) {
				console.log(e.target.result);

				
				var img = document.createElement('img');
				img.src = e.target.result;
				$preview.html($(img));
			};
			reader.readAsDataURL(file);
		});
	});

	fileEntry.getFile('dupadupa.txt', {create: true}, function(f){
		f.createWriter(function(fileWriter) {

			fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

			var debug = {hello: "world"};
			var blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});
			fileWriter.write(blob);
		});
	});
  }

        chrome.fileSystem.chooseEntry( {
      type: 'openDirectory',
      
      
      acceptsAllTypes: true
        }, exportToFileEntry);
		
	$(document).on('click', '.photo', function(){
		
		var reader = new FileReader();
		reader.onloadend = function (e) {
				console.log('loaded');
				successCallback(e.target.result);
		};
		
		console.log(f[$(this).data('path')]);
		gf.getFile(f[$(this).data('path')].name, {}, function(f){
			f.file(function(file){
				var reader = new FileReader();
				reader.onloadend = function(e) {
					console.log(e.target.result);
	
					
					var img = document.createElement('img');
					img.src = e.target.result;
					$preview.html($(img));
				};
				reader.readAsDataURL(file);
			});
			
			//console.log(f);
			//f.createReader(function(fileReader){
			//	console.log('mam reader!');
			//});
		});

		/*
		var fullPath = 'file://' + $(this).data('path');
		//$preview.html($('<img src="file://' + fullPath + '" style="width: 100%;"/>'))

		var xhr = new XMLHttpRequest();
		xhr.open('GET', fullPath, true);
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
  		var img = document.createElement('img');
			img.src = window.URL.createObjectURL(this.response);
			$preview.html($(img));
  		//document.body.appendChild(img);
		};

		xhr.send();
*/


	});

});
