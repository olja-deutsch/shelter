function removeMenuLinkEvent(event) {
    if (
        event.target.classList.contains('active') ||
        !event.target.getAttribute('href')
    ) {
        event.preventDefault();
    };
}

document.querySelector('.top-menu').addEventListener('click', removeMenuLinkEvent);

function scrollToTop(event) {
    if (
        event.target.classList.contains('active') &&
        window.pageYOffset > 100
    ) {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}

document.querySelector('.top-menu').addEventListener('click', scrollToTop);

document.querySelector('.hamburger-button').addEventListener('click', (event) => {
    document.body.classList.toggle('show-menu');

    if (document.querySelector('.top-wrapper_light')) {
        document.querySelector('.top-wrapper_light').classList.toggle('top-wrapper_fixed');
    }

    event.currentTarget.classList.toggle('active');
    document.querySelector('.blackout').classList.toggle('active');
});

function removeMobileMenuClasses() {
    document.body.classList.remove('show-menu');

    if (document.querySelector('.top-wrapper_light')) {
        document.querySelector('.top-wrapper_light').classList.add('top-wrapper_fixed');
    }

    document.querySelector('.hamburger-button').classList.remove('active');
    document.querySelector('.blackout').classList.remove('active');
}

document.querySelector('.top-menu').addEventListener('click', (event) => {
    if (event.target.classList.contains('active')) {
        removeMobileMenuClasses();
    }
})

document.querySelector('.blackout').addEventListener('click', removeMobileMenuClasses);

let pets = [];
let fullPetsList = [];
const sliderContent = document.querySelector('.pets-slider');
const popupBlock = document.querySelector('.popup');

const request = new XMLHttpRequest();
request.open('GET', '../pets.json');

request.onload = () => {
    pets = JSON.parse(request.response);

    fullPetsList = (() => {
        let tempArray = [];

        for (let i = 0; i < 6; i++) {
            const newPets = pets;

            for (let j = pets.length; j > 0; j--) {
                let randomIndex = Math.floor(Math.random() * j);
                const randomElement = newPets.splice(randomIndex, 1)[0];

                newPets.push(randomElement);
            }

            tempArray = [...tempArray, ...newPets];
        }

        return tempArray;
    })();

    // createPets(fullPetsList);

    fullPetsList = sort863(fullPetsList);

    sliderContent.addEventListener('click', showPopup);

    function showPopup(e) {
        if (e.target.closest('.pets-slider__content')) {
            document.body.classList.add('show-popup');
            document.querySelector('.blackout').classList.add('active');

            const currentPetName = e.target.closest('.pets-slider__content').getAttribute('data-name');
            const currentPetData = pets.find(item => item.name === currentPetName);

            popupBlock.classList.add('show');

            popupBlock.insertAdjacentHTML('afterbegin',
                `<button class="popup__close"></button>
            <div class="popup__img">
                <img src="${currentPetData.img}" alt="${currentPetData.type}">
            </div>
            <div class="popup__text">
                <h3 class="popup__pet-name">${currentPetData.name}</h3>
                <h4 class="popup__pet-breed">${currentPetData.type} - ${currentPetData.breed}</h4>
                <div class="popup__pet-desc">${currentPetData.description}</div>
                <div class="popup__pet-info">
                    <p><strong>Age:</strong> ${currentPetData.age}</p>
                    <p><strong>Inoculations:</strong> ${currentPetData.inoculations}</p>
                    <p><strong>Diseases:</strong> ${currentPetData.diseases}</p>
                    <p><strong>Parasites:</strong> ${currentPetData.parasites}</p>
                </div>
            </div>`);
        }
    }

    popupBlock.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup__close')) {
            hidePopup();
        }
    });
    document.querySelector('.blackout').addEventListener('click', hidePopup);

    function hidePopup(e) {
        document.body.classList.remove('show-popup');
        popupBlock.classList.remove('show');
        popupBlock.innerHTML = '';
        document.querySelector('.blackout').classList.remove('active');
    }
}

/* const createPets = (petsList) => {
    const catalog = document.querySelector('.pets-slider__items');

    catalog.innerHTML = createPetItem(petsList);
}

const createPetItem = (petsList) => {
    let structure = '';

    for (let i = 0; i < petsList.length; i++) {
        structure += `<div class="pets-slider__item">
                      <div class="pets-slider__content" data-name="${petsList[i].name}">
                      <img src="${petsList[i].img}" class="pets-slider__img" alt="${petsList[i].type}">
                      <div class="pets-slider__title">${petsList[i].name}</div>
                      <button class="btn btn-border">Learn more</button>
                      </div>
                      </div>`;
    }

    return structure;
} */

request.send();

const sort863 = (list) => {
    const length = list.length;

    for (let i = 0; i < (length / 6); i++) {
        const stepList = list.slice(i * 6, (i * 6) + 6);

        for (let j = 0; j < 6; j++) {
            const duplicatedItem = stepList.find((item, index) => {
                return item.name === stepList[j].name && (index !== j);
            });

            if (duplicatedItem !== undefined) {
                const currentItemIndex = (i * 6) + j;
                const which8OfList = Math.trunc(currentItemIndex / 8);

                list.splice(which8OfList * 8, 0, list.splice(currentItemIndex, 1)[0]);

                i -= 2;
                break;
            }
        }
    }

    return list;
};