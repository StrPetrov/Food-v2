const provide = () => {
    let searchBtn = document.querySelector('#search');
    let inputField = document.querySelector('#ingridient');
    let inputValue;
    const mealNameArray = [];
    const mealPhotoArray  = [];
    const mealIdArray = [];
    let errorMessage = document.querySelector('#error_message');
    let containerToRender = document.querySelector('.main_container_food_list');
    let readMoreButtons;
    let modal = document.querySelector('.modal');
    let modalClose = document.querySelector('.modal_close');
    let modalHeader = document.querySelector('.modal_header');
    let modalDesc = document.querySelector('.modal_desc');
    let modalPhoto = document.querySelector('.modal_photo');
    

    searchBtn.addEventListener('click', (event) => {
        containerToRender.innerHTML = '';
        mealPhotoArray.length = 0;
        mealNameArray.length = 0;
        mealIdArray.length = 0;
        event.preventDefault();
        inputValue = inputField.value;
        inputField.value = '';
        const foodApi = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${inputValue}`;

        const fetchFoodApi = async () => {
            const response = await fetch(foodApi);
            const food = await response.json();

            if (food.meals === null) {
                errorMessage.style.visibility = 'visible';
            }
            else {
                errorMessage.style.visibility = 'hidden';
                food.meals.forEach(meal => {
                    mealNameArray.push(meal.strMeal);
                    mealPhotoArray.push(meal.strMealThumb);
                    mealIdArray.push(meal.idMeal);
                })

                mealPhotoArray.forEach((value, index) => {
                    containerToRender.insertAdjacentHTML('afterbegin',
                     `<div class="card">
                        <img src="${value}">
                        <p>${mealNameArray[index]}</p>
                        <button class="read_more_buttons">Read more</button>
                      </div>`)
                })

                readMoreButtons = document.querySelectorAll('.read_more_buttons');

                mealIdArray.reverse();

                readMoreButtons.forEach((value, index) => {
                        value.setAttribute('id', `${mealIdArray[index]}`);
                    }) 

                readMoreButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const specificApi = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${this.id}`;
                        modal.style.display = 'block';
                        
                        const fetchSpecificApi = async () => {
                            const response = await fetch(specificApi);
                            const data = await response.json();

                            let modalName = data.meals[0].strMeal;
                            let modalCategory = data.meals[0].strCategory;
                            let modalRecipe = data.meals[0].strInstructions;
                            let modalPhotoSrc = data.meals[0].strMealThumb;
                            let modalYoutube = data.meals[0].strYoutube;

                            modalHeader.insertAdjacentHTML('afterbegin', `
                            <h1>${modalName}</h1>
                            <h3>${modalCategory}</h3>`)

                            modalPhoto.insertAdjacentHTML('afterbegin', `
                            <a href="${modalYoutube}" target="_blank"><img src="${modalPhotoSrc}"></a>`)

                            modalDesc.insertAdjacentHTML('afterbegin', `
                            <p>${modalRecipe}</p>`) 

                            modalClose.addEventListener('click', () => {
                                modal.style.display = 'none';
                                modalHeader.innerHTML = '';
                                modalPhoto.innerHTML = '';
                                modalDesc.innerHTML = '';
                            })
                        }
                        fetchSpecificApi();
                    })
                })
            }  
        }
        fetchFoodApi();
    })
}

provide();


