$(function(){

	var $files = $('#filesPanel');
	var $preview = $('#previewPanel');

	var $dataPanel_speech = $('#dataPanel_speech');
	var $dataPanel_speech_tmp = $('#dataPanel_speech_tmp');

	var previewOriginalWidth = 0;
	var previewOriginalHeight = 0;

	var previewRatio = 100;
	var previewMarginTop = 0;
	var previewMarginLeft = 0;

	var f = {};

	var gf;

	function exportToFileEntry(fileEntry) {
		gf = fileEntry;
							console.log(fileEntry);
							console.log('-------');
		var directoryReader = fileEntry.createReader();
		console.log(directoryReader);
		directoryReader.readEntries(function(entries) {
			//console.log(entries);
			for(var i in entries){
				
				f[entries[i].name] = entries[i];
				chrome.fileSystem.getDisplayPath(entries[i], function(displayPath){
					//$files.append($('<span class="photo" data-path="' + displayPath + '">' + entries[i].name + '</span><br/>'));
				});
				$files.append($('<span class="photo" data-path="' + entries[i].name + '">' + entries[i].name + '</span>'));
			}
		});

	
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

	function adjustPreview(){
		console.log(previewOriginalWidth);
		$('#previewPanel > img').css('width', previewOriginalWidth * previewRatio / 100);

	}

    chrome.fileSystem.chooseEntry( {
      type: 'openDirectory',
      
      
      acceptsAllTypes: true
    }, exportToFileEntry);
	
	$(window).on('scroll', '#previewPanel > img', function(event){
		console.log(event);
	});
	$(window).on('wheel', function(event){ 
		if(event.target.class == 'preview'){
			console.log(event); 
			if(event.originalEvent.deltaY < 0){
				previewRatio -= 5;
			} else {
				previewRatio += 5;
			}
			if(previewRatio < 10) previewRatio = 10;
			if(previewRatio > 100) previewRatio = 100;
			//

			adjustPreview();
		}
	});

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
					img.class = 'preview';
					img.src = e.target.result;
					$preview.html($(img));

					adjustPreview();
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

	var final_transcript = '';
	if (!('webkitSpeechRecognition' in window)) {
		console.log('brak supportu');
	} else {
		var recognition = new webkitSpeechRecognition();
  		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.onresult = function(event) {
			var interim_transcript = '';
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					var text = event.results[i][0].transcript;
					final_transcript += text + "\n";

					if(text == "czyść" || text == "wyczyść" || text == "od nowa" || text == "restart"){
						final_transcript = "";
					}

					$dataPanel_speech.html(final_transcript);
				} else {
					interim_transcript += event.results[i][0].transcript;
					$dataPanel_speech_tmp.html(interim_transcript);
				}
			}
			//console.log(interim_transcript);
			//console.log(final_transcript);
			/*
			final_transcript = capitalize(final_transcript);
			final_span.innerHTML = linebreak(final_transcript);
			interim_span.innerHTML = linebreak(interim_transcript);
			if (final_transcript || interim_transcript) {
				showButtons('inline-block');
			}
			*/
		};
		recognition.onstart = function() {
			console.log('onstarted');
		}
		recognition.onerror = function(event) {
			console.log(event.error);
		}
		recognition.onend = function() {
			console.log('onend');
			recognition.start();
		}
	}

	recognition.lang = 'pl';
	recognition.start();
	console.log('started');

});
