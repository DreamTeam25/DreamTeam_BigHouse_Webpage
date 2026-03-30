const houses = {
    barnaul: {
        title: 'Барнаул',
        year: '2023',
        stage: 'Строительство',
        price: '7 500 000 ₽',
        area: '450 м²',
        foundation: 'Кирпич',
        floors: 'Монолитные',
        finish: 'Чистовая, включая покраску стен, укладку ламината и установку сантехники',
        mainImage: 'IMG/Page2_1.png',
        gallery: [
            'IMG/Page2_2.png',
            'IMG/Page2_3.png',
            'IMG/Page2_4.png',
            'IMG/Page2_5.png'
        ]
    },

    piter: {
        title: 'Санкт-Петербург',
        year: '2022',
        stage: 'Сдан',
        price: '9 200 000 ₽',
        area: '520 м²',
        foundation: 'Монолитная плита',
        floors: 'Железобетонные',
        finish: 'Чистовая отделка с установкой сантехники и напольных покрытий',
        mainImage: 'IMG/Piter.png',
        gallery: [
            'IMG/Piter2.png',
            'IMG/Piter3.png',
            'IMG/Piter4.png',
            'IMG/Piter5.png'
        ]
    },

    ekb: {
        title: 'Екатеринбург',
        year: '2024',
        stage: 'Строительство',
        price: '8 100 000 ₽',
        area: '390 м²',
        foundation: 'Свайно-ростверковый',
        floors: 'Монолитные',
        finish: 'Предчистовая отделка',
        mainImage: 'IMG/Ekb.png',
        gallery: [
            'IMG/Ekb2.png',
            'IMG/Ekb3.png',
            'IMG/Ekb4.png',
            'IMG/Ekb5.png'
        ]
    },

    krasnodar: {
        title: 'Краснодар',
        year: '2021',
        stage: 'Сдан',
        price: '7 500 000 ₽',
        area: '430 м²',
        foundation: 'Ленточный',
        floors: 'Монолитные',
        finish: 'Чистовая отделка',
        mainImage: 'IMG/Krasnodar.png',
        gallery: [
            'IMG/Krasnodar2.png',
            'IMG/Krasnodar3.png',
            'IMG/Krasnodar4.png',
            'IMG/Krasnodar5.png'
        ]
    },

    vladivostok: {
        title: 'Владивосток',
        year: '2025',
        stage: 'Проектирование',
        price: '10 300 000 ₽',
        area: '610 м²',
        foundation: 'Монолитная плита',
        floors: 'Железобетонные',
        finish: 'Под ключ',
        mainImage: 'IMG/Vladivostok.png',
        gallery: [
            'IMG/Vladivostok2.png',
            'IMG/Vladivostok3.png',
            'IMG/Vladivostok4.png',
            'IMG/Vladivostok5.png'
        ]
    },

    novosibirsk: {
        title: 'Новосибирск',
        year: '2023',
        stage: 'Строительство',
        price: '7 500 000 ₽',
        area: '470 м²',
        foundation: 'Кирпич',
        floors: 'Монолитные',
        finish: 'Чистовая отделка',
        mainImage: 'IMG/Novo.png',
        gallery: [
            'IMG/Novo2.png',
            'IMG/Novo3.png',
            'IMG/Novo4.png',
            'IMG/Novo5.png'
        ]
    },

    rostov: {
        title: 'Ростов-на-Дону',
        year: '2021',
        stage: 'Сдан',
        price: '7 900 000 ₽',
        area: '410 м²',
        foundation: 'Ленточный',
        floors: 'Монолитные',
        finish: 'Предчистовая отделка',
        mainImage: 'IMG/Rostov.png',
        gallery: [
            'IMG/Rostov2.png',
            'IMG/Rostov3.png',
            'IMG/Rostov4.png',
            'IMG/Rostov5.png'
        ]
    },

    vologda: {
        title: 'Вологда',
        year: '2022',
        stage: 'Сдан',
        price: '8 500 000 ₽',
        area: '460 м²',
        foundation: 'Кирпич',
        floors: 'Монолитные',
        finish: 'Чистовая отделка',
        mainImage: 'IMG/vologda.png',
        gallery: [
            'IMG/vologda2.png',
            'IMG/vologda3.png',
            'IMG/vologda4.png',
            'IMG/vologda5.png'
        ]
    }
};

const params = new URLSearchParams(window.location.search);
const houseKey = params.get('house');
const house = houses[houseKey];

if (house) {
    document.title = `Большой Дом — ${house.title}`;

    const houseTitle = document.getElementById('house-title');
    const houseYear = document.getElementById('house-year');
    const houseStage = document.getElementById('house-stage');
    const housePrice = document.getElementById('house-price');
    const houseArea = document.getElementById('house-area');
    const houseFoundation = document.getElementById('house-foundation');
    const houseFloors = document.getElementById('house-floors');
    const houseFinish = document.getElementById('house-finish');
    const mainImage = document.getElementById('house-main-image');

    const gallery1 = document.getElementById('gallery-1');
    const gallery2 = document.getElementById('gallery-2');
    const gallery3 = document.getElementById('gallery-3');
    const gallery4 = document.getElementById('gallery-4');

    if (houseTitle) houseTitle.textContent = house.title;
    if (houseYear) houseYear.textContent = house.year;
    if (houseStage) houseStage.textContent = house.stage;
    if (housePrice) housePrice.textContent = house.price;
    if (houseArea) houseArea.textContent = house.area;
    if (houseFoundation) houseFoundation.textContent = house.foundation;
    if (houseFloors) houseFloors.textContent = house.floors;
    if (houseFinish) houseFinish.textContent = house.finish;

    if (mainImage) {
        mainImage.src = house.mainImage;
        mainImage.alt = house.title;
    }

    if (gallery1) {
        gallery1.src = house.gallery[0];
        gallery1.alt = `${house.title} фото 1`;
    }

    if (gallery2) {
        gallery2.src = house.gallery[1];
        gallery2.alt = `${house.title} фото 2`;
    }

    if (gallery3) {
        gallery3.src = house.gallery[2];
        gallery3.alt = `${house.title} фото 3`;
    }

    if (gallery4) {
        gallery4.src = house.gallery[3];
        gallery4.alt = `${house.title} фото 4`;
    }
} else {
    const houseTitle = document.getElementById('house-title');
    if (houseTitle) {
        houseTitle.textContent = 'Проект не найден';
    }
}