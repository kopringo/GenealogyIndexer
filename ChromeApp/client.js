$(function(){

	var $files = $('#filesPanel');
	var $preview = $('#previewPanel');

	function exportToFileEntry(fileEntry) {
							console.log(fileEntry);
							console.log('-------');
		var directoryReader = fileEntry.createReader();
		console.log(directoryReader);
	directoryReader.readEntries(function(entries) {
		console.log(entries);
		for(var i in entries){
			$files.append($('<span class="photo" data-path="' + entries[i].fullPath + '">' + entries[i].name + '</span><br/>'));
		}
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
		var fullPath = $(this).data('path');
		$preview.html($('<img src="' + fullPath + '" style="width: 100%;"/>'))

	});

});
