/* Copyright 2013 Chris Wilson

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var audioContext = new AudioContext();
var audioInput = null, realAudioInput = null, inputPoint = null, audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;

var Clock = {
	totalSeconds : 0,

	start : function() {
		var self = this;

		this.interval = setInterval(function() {
			self.totalSeconds += 1;

			jQuery("#hour").text(Math.floor(self.totalSeconds / 3600));
			jQuery("#min").text(Math.floor(self.totalSeconds / 60 % 60));
			jQuery("#sec").text(parseInt(self.totalSeconds % 60));
		}, 1000);
	},

	pause : function() {
		clearInterval(this.interval);
		delete this.interval;
	},

	resume : function() {
		if (!this.interval)
			this.start();
	},
	stop : function() {
		clearTimeout(totalSeconds);

	}
};

/*
 * TODO:
 *  - offer mono option - "Monitor input" switch
 */

function saveAudio() {
//	alert("inside save audio");
	audioRecorder.exportWAV(doneEncoding);
	// could get mono instead by saying
	// audioRecorder.exportMonoWAV( doneEncoding );
}

function drawWave(buffers) {
	var canvas = document.getElementById("wavedisplay");
	drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffers[0]);
}

var localPassword = null;
function setPassword(password){
	localPassword = password;
//	alert("LOCALPWD : "+localpwd);
}

function doneEncoding(blob) {
	//Recorder.forceDownload(blob, "myRecording" + ((recIndex < 10) ? "0" : "")
//			+ recIndex + ".wav");
//	console.log("BLOB LENGTH : "+blob.length);
    var formData = new FormData();
    formData.append('file', blob);
    
    	$.ajax({
    		url: "/intelesant-ws/jmessaging/addRecord",
    		type: "post",
    		data: formData,
    		contentType: false,
    		processData: false,
    		async : false,
    		headers : {
				Authorization : localPassword
			},
     // contenType:"audio/x-wav",
    		success: function(data){
//    			alert("success");
    			console.log("data : "+data);
//    			$("#blobpath").val(data);
//    			document.cookie = "returnblob="+data;
    			var totalfileName = data.substring(data.lastIndexOf("/")+1,data.length);
    			console.log("total filename : "+totalfileName);
    			
    			var array = totalfileName.split('.');
    			
    			console.log("filename : "+array[0]);
    			console.log("extension : "+array[1]);
    			
    			$('#voiceControl').attr('src',"voicerecorder/"+array[0]+".ogg").detach().appendTo($("#audioPlayer"));
                $("#audioPlayer").load();
                $('#embedId').attr('src',"voicerecorder/"+array[0]+".mp3");
                $("#embedId").load();
    			return false;
    			
    		},
    		error:function(){
    			return false;
//    			alert("failure");
    		}
  });
    	return false;
    	recIndex++;
}

function toggleRecording(e) {
	// if (e.classList.contains("recording")) {
//	 alert("toggle recording");
	// // stop recording
	// audioRecorder.stop();
	// e.classList.remove("recording");
	// audioRecorder.getBuffers( drawWave );
	// } else {
	// alert("start recoreding");
	// // start recording
	// if (!audioRecorder)
	// return;
	// e.classList.add("recording");
	// audioRecorder.clear();
	// audioRecorder.record();
	// }

//	alert("start recoreding");
	Clock.start();
	// start recording
	if (!audioRecorder)
		return;
	// e.classList.add("recording");
	audioRecorder.clear();
	audioRecorder.record();

}
function stopRecording() {
//	alert("stop recording");
	// stop recording
	audioRecorder.stop();
	// e.classList.remove("recording");
	audioRecorder.getBuffers(drawWave);
}

function convertToMono(input) {
	var splitter = audioContext.createChannelSplitter(2);
	var merger = audioContext.createChannelMerger(2);

	input.connect(splitter);
	splitter.connect(merger, 0, 0);
	splitter.connect(merger, 0, 1);
	return merger;
}

function cancelAnalyserUpdates() {
	window.cancelAnimationFrame(rafID);
	rafID = null;
}

function updateAnalysers(time) {
	if (!analyserContext) {
		var canvas = document.getElementById("analyser");
		canvasWidth = canvas.width;
		canvasHeight = canvas.height;
		analyserContext = canvas.getContext('2d');
	}

	// analyzer draw code here
	{
		var SPACING = 3;
		var BAR_WIDTH = 1;
		var numBars = Math.round(canvasWidth / SPACING);
		var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

		analyserNode.getByteFrequencyData(freqByteData);

		analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
		analyserContext.fillStyle = '#F6D565';
		analyserContext.lineCap = 'round';
		var multiplier = analyserNode.frequencyBinCount / numBars;

		// Draw rectangle for each frequency bin.
		for (var i = 0; i < numBars; ++i) {
			var magnitude = 0;
			var offset = Math.floor(i * multiplier);
			// gotta sum/average the block, or we miss narrow-bandwidth spikes
			for (var j = 0; j < multiplier; j++)
				magnitude += freqByteData[offset + j];
			magnitude = magnitude / multiplier;
			var magnitude2 = freqByteData[i * multiplier];
			analyserContext.fillStyle = "hsl( "
					+ Math.round((i * 360) / numBars) + ", 100%, 50%)";
			analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH,
					-magnitude);
		}
	}

	rafID = window.requestAnimationFrame(updateAnalysers);
}

function toggleMono() {
	if (audioInput != realAudioInput) {
		audioInput.disconnect();
		realAudioInput.disconnect();
		audioInput = realAudioInput;
	} else {
		realAudioInput.disconnect();
		audioInput = convertToMono(realAudioInput);
	}

	audioInput.connect(inputPoint);
}

function gotStream(stream) {
//	alert("getStream called");
	inputPoint = audioContext.createGain();

	// Create an AudioNode from the stream.
	realAudioInput = audioContext.createMediaStreamSource(stream);
	audioInput = realAudioInput;
	audioInput.connect(inputPoint);

	// audioInput = convertToMono( input );

	analyserNode = audioContext.createAnalyser();
	analyserNode.fftSize = 2048;
	inputPoint.connect(analyserNode);

	audioRecorder = new Recorder(inputPoint);

	zeroGain = audioContext.createGain();
	zeroGain.gain.value = 0.0;
	inputPoint.connect(zeroGain);
	zeroGain.connect(audioContext.destination);
//	updateAnalysers();
}

function initAudio() {
	if (!navigator.getUserMedia)
		navigator.getUserMedia = navigator.webkitGetUserMedia
				|| navigator.mozGetUserMedia;
	if (!navigator.cancelAnimationFrame)
		navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame
				|| navigator.mozCancelAnimationFrame;
	if (!navigator.requestAnimationFrame)
		navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame
				|| navigator.mozRequestAnimationFrame;
	
	if(navigator.getUserMedia){
//		alert("navigator.getUserMedia is supported");
		navigator.getUserMedia({
			audio : true
		}, gotStream, function() {
//			alert('Error getting audio');
			console.log(e);
		});
	} else {
//		alert("navigator.getUserMedia is NOT supported");
	}
}

window.addEventListener('load', initAudio);