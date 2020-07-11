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
                                    <img src="../../assets/img/Naruto_Uzumaki.png" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                                    <h2>Никита Богданов</h2>
                                    <p>Student of the Belarusian State University of Informatics and Radio Electronics, front-end developer. Student of RS school.</p>
                                    <a target="_blank" href="https://github.com/N1kaSqq">My Github</a>
                                </div>
                            </div>
                            <div class='aboutUs-slide fade'>
                            <div class='aboutUs-picture'>
                                    <img src="../../assets/img/cat1.jpg" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                                    
                                </div>
                            </div>
                            <div class='aboutUs-slide fade'>
                                <div class='aboutUs-picture'>
                                    <img src="../../assets/img/cat2.jpg" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                            
                                </div>
                            </div>
                            <div class='aboutUs-slide fade'>
                                <div class='aboutUs-picture'>
                                    <img src="../../assets/img/cat3.jpg" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                            
                                </div>
                            </div>
                            <div class='aboutUs-slide fade'>
                                <div class='aboutUs-picture'>
                                    <img src="../../assets/img/BassFish_04.png" alt="employee">
                                </div>
                                <div class='aboutUs-text'>
                            
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
    for(let i=0; i<slides.length; i++){
        slides[i].style.display = 'none';
    }
    slides[slideIndex - 1].style.display = 'flex'; 
}

  function addEventListeners(){
      document.querySelector('.prev').addEventListener('click',()=>{handleSlide(-1)});
      document.querySelector('.next').addEventListener('click',()=>{handleSlide(1)});
  }




  return {
    onInit,
  }
}