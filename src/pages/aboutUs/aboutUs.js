import './aboutUs.css';


export default function aboutUs() {
    const onInit = (anchor) => {
        const container = anchor.append(render());
        addEventListeners();
        showSlides(slideIndex);
        return container;
    };

    let slideIndex = 1;

    const render = () => {
        const container = document.createElement('div');
        container.classList.add('box-aboutUs');
        container.innerHTML = `
                         <h2 class='aboutUs-title'>О Команде</h2>
                         <div class='slider-container-aboutUs'>
                            <div class='aboutUs-slide fade'>
                                <div class='aboutUs-picture'>
                                    <img src="../../assets/img/cat2.jpg" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                                    <h2>Зубков Андрей</h2>
                                    <p>Котик обычной породы. Team lead. Сделал лингвиста и авторизацию. Любит успешно сданные таски в срок. Не любит овертаймы.</p>
                                    <a target="_blank" href="https://github.com/nofishtou">My Github</a>
                                </div>
                            </div>
                            <div class='aboutUs-slide fade'>
                                <div class='aboutUs-picture'>
                                    <img src="../../assets/img/cat6.jpg" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                                    <h2>Романова Екатерина</h2>
                                    <p>Единственная кошечка в команде, откликается на Романова Екатерина, очень ласковая и азарная, пока дело не доходит до правки кода. Приучена к "митингам" и командой работе. Владеет разнообразными стилями написания кода. Если вы спите, постарается дозвониться до вас с новыми идеями.</p>
                                    <a target="_blank" href="https://github.com/KaterinaRomanova">My Github</a>
                                </div>
                            </div>
                            <div class='aboutUs-slide fade'>
                                <div class='aboutUs-picture'>
                                    <img src="../../assets/img/Naruto_Uzumaki.png" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                                    <h2>Никита Богданов</h2>
                                    <p>После присоединения к команде RSS, Никита упорно трудился, чтобы получить признание всех в деревне и исполнить свою заветную мечту стать Хокаге. В последующие годы, он хочет стать способным front-end разработчиком, которого будут считать героем Конохи.</p>
                                    <a target="_blank" href="https://github.com/N1kaSqq">My Github</a>
                                </div>
                            </div>
                            <div class='aboutUs-slide fade'>
                            <div class='aboutUs-picture'>
                                    <img src="../../assets/img/cat1.jpg" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                                    <h2>Ганул Антон</h2>
                                    <p>Кот как кот, отликается на Ганул Антон, дерёт JS файлы, "гуглить" приучен, характер покладистый. В еде не прихотлив, может до 10 дней прожить на одном дошираке и энергетиках. Днем включается спящий режим, но при наступлении темноты он, как и всё адское зло, просыпается.</p>
                                    <a target="_blank" href="https://github.com/GanulAnton">My Github</a>
                                </div>
                            </div>
                            <div class='aboutUs-slide fade'>
                                <div class='aboutUs-picture'>
                                    <img src="../../assets/img/cat3.jpg" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                                    <h2>Зиновьев Глеб</h2>
                                    <p>Кот домашний, откликается на Глеб Зиновьев, качественный, пробег - 10 месяцев, Обладает функцией кодоиспускания. Функция впитывания новых знаний отлажена просто на диво: с удовольствием принимает даже сложный материал. Вложений не требует. С хорошим характером, спокойный, дружелюбный.</p>
                                    <a target="_blank" href="https://github.com/IxionBY">My Github</a>
                                </div>
                            </div>
                            <div class='aboutUs-slide fade'>
                                <div class='aboutUs-picture'>
                                    <img src="../../assets/img/cat5.jpg" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                                    <h2>Бадмаев Егор</h2>
                                    <p>Харизматичный надменный Милаш породы «Девонрекс». Меня зовут «Егорьян». КоТ пишет КоД как умеет, потому что у меня лапки. Люблю цветы и вождение автомобиля. Сотрудничал со Сфинксом.</p>
                                    <a target="_blank" href="https://github.com/htmlprogrammist">My Github</a>
                                </div>
                            </div>
                            <a class="prev">&#10094</a>
                            <a class="next">&#10095</a>
                         </div>
                         <div class="wave"></div>   
                       `;
        return container;
    };

    function handleSlide(n) {
        showSlides(slideIndex += n);
    }

    function showSlides(n) {
        const slides = document.getElementsByClassName("aboutUs-slide");
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        slides[slideIndex - 1].style.display = 'flex';
    }

    function addEventListeners() {
        document.querySelector('.prev').addEventListener('click', () => {
            handleSlide(-1)
        });
        document.querySelector('.next').addEventListener('click', () => {
            handleSlide(1)
        });
    }




    return {
        onInit,
    }
}