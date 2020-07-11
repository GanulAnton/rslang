import '../components/speakIt/stylesSpeakIt.css'
import { SpeakIt } from '../components/speakIt/renderSpeakIt';
//вставляем наш элемент
const speakIt =  SpeakIt();

speakIt.onInit(document.querySelector('#app'));
