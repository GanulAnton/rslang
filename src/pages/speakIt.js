import '../components/speakIt/stylesSpeakIt.css';
import SpeakIt from '../components/speakIt/renderSpeakIt';

const speakIt = SpeakIt();
speakIt.onInit(document.querySelector('#app'));
