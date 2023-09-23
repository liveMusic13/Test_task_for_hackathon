const buttonRecording = document.querySelector('.main__block-record');
const elemStartRecording = document.querySelector('.main__micro_no-active');
const elemStopRecording = document.querySelector('.main__micro_active');
const elemCompletedRecording = document.querySelector('.main__micro_completed');
const mainInfo = document.querySelector('.main__info');
const buttonSubmit = document.querySelector('.main__submit');
const inputElement = document.querySelector('.main__input');

let mediaRecorder;
let audioChunks = [];
let textQuestion = '';
let inputText = '';
let imageState = 0;
let isRecording = false;

buttonRecording.addEventListener('click', toggleImage);

inputElement.oninput = function () {
	inputText = inputElement.value;

	if (inputText) {
		buttonSubmit.style.display = 'block';
	}
};

buttonSubmit.addEventListener('click', () => {
	textQuestion = inputText;
	inputElement.value = '';
	inputText = '';
	if (!inputText) {
		buttonSubmit.style.display = 'none';
	}
	console.log(textQuestion);
});

function toggleImage() {
	const imageElements = [
		elemStartRecording,
		elemStopRecording,
		elemCompletedRecording,
	];

	imageElements[imageState].style.display = 'none';
	imageState = (imageState + 1) % imageElements.length;
	imageElements[imageState].style.display = 'block';

	if (imageState === 0) {
		buttonRecording.style.backgroundColor = 'rgba(255, 255, 255, 1)';
		if (isRecording) {
			stopRecording();
		}
		mainInfo.textContent = 'говорите';
	} else if (imageState === 1) {
		buttonRecording.style.backgroundColor = 'rgba(255, 105, 69, 1)';
		startRecording();
		mainInfo.textContent = 'идет запись...';
	} else {
		buttonRecording.style.backgroundColor = 'rgba(224, 251, 82, 1)';
	}
	checkRecording(imageState);
}

function checkRecording(startRec) {
	let viewRecording = document.querySelector('.main__block-image-record');
	let viewTextInput = document.querySelector('.main__input');

	if (startRec === 1) {
		viewRecording.style.display = 'block';
		viewTextInput.style.display = 'none';
	} else {
		viewRecording.style.display = 'none';
	}

	if (startRec === 0) {
		viewTextInput.style.display = 'block';
		buttonRecording.style.marginTop = '0px';
	} else if (startRec === 2) {
		buttonRecording.style.marginTop = '80px';
	}
}

function startRecording() {
	if (!isRecording) {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then(stream => {
				mediaRecorder = new MediaRecorder(stream);
				mediaRecorder.ondataavailable = event => {
					if (event.data.size > 0) {
						audioChunks.push(event.data);
					}
				};

				mediaRecorder.onstop = () => {
					console.log(audioChunks);
					mainInfo.textContent = 'говорите';
				};

				mediaRecorder.start();
				isRecording = true;
			})
			.catch(error => {
				console.error('Error accessing microphone:', error);
			});
	}
}

function stopRecording() {
	if (isRecording) {
		mediaRecorder.stop();
		isRecording = false;
	}
}
