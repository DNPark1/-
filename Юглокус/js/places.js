// Города сгруппированы по коду региона из regions.js. lat — широта, lng — долгота.
const CITIES = {
  krasnodar: [
    {
      name: "Краснодар",
      lat: 45.035,
      lng: 38.975,
    },
    {
      name: "Сочи",
      lat: 43.585,
      lng: 39.724,
    },
    {
      name: "Анапа",
      lat: 44.895,
      lng: 37.317,
    },
    {
      name: "Геленджик",
      lat: 44.561,
      lng: 38.077,
    },
  ],
  crimea: [
    {
      name: "Ялта",
      lat: 44.495,
      lng: 34.166,
    },
    {
      name: "Феодосия",
      lat: 45.031,
      lng: 35.383,
    },
    {
      name: "Симферополь",
      lat: 44.95,
      lng: 34.1,
    },
  ],
  astrakhan: [
    {
      name: "Астрахань",
      lat: 46.349,
      lng: 48.036,
    },
    {
      name: "Ахтубинск",
      lat: 48.283,
      lng: 46.172,
    },
  ],
  rostov: [
    {
      name: "Ростов-на-Дону",
      lat: 47.222,
      lng: 39.719,
    },
    {
      name: "Таганрог",
      lat: 47.213,
      lng: 38.91,
    },
  ],
  volgograd: [
    {
      name: "Волгоград",
      lat: 48.708,
      lng: 44.514,
    },
    {
      name: "Волжский",
      lat: 48.786,
      lng: 44.77,
    },
  ],
  adygea: [
    {
      name: "Майкоп",
      lat: 44.609,
      lng: 40.101,
    },
    {
      name: "Адыгейск",
      lat: 44.884,
      lng: 39.19,
    },
  ],
  sevastopol: [
    {
      name: "Севастополь",
      lat: 44.616,
      lng: 33.525,
    },
    {
      name: "Инкерман",
      lat: 44.614,
      lng: 33.609,
    },
  ],
  kalmykia: [
    {
      name: "Элиста",
      lat: 46.308,
      lng: 44.269,
    },
    {
      name: "Лагань",
      lat: 45.393,
      lng: 47.371,
    },
  ],
};

// Подборка объектов с примерными координатами. Виды: hotel, base, spring.
const PLACES = [
  {
    region: "krasnodar",
    type: "hotel",
    name: "Гостиница «Приморская»",
    lat: 43.574,
    lng: 39.729,
  },
  {
    region: "krasnodar",
    type: "hotel",
    name: "Гранд Отель Анапа",
    lat: 44.909,
    lng: 37.321,
  },
  {
    region: "krasnodar",
    type: "hotel",
    name: "Гостиница «Интурист»",
    lat: 45.039,
    lng: 38.975,
  },
  {
    region: "krasnodar",
    type: "hotel",
    name: "Приморье Grand Resort Hotel",
    lat: 44.565,
    lng: 38.074,
  },
  {
    region: "krasnodar",
    type: "spring",
    name: "Термальный комплекс «Мостовской»",
    lat: 44.402,
    lng: 40.816,
  },
  {
    region: "crimea",
    type: "hotel",
    name: "Гостиница «Ялта-Интурист»",
    lat: 44.504,
    lng: 34.199,
  },
  {
    region: "crimea",
    type: "hotel",
    name: "Гостиница «Астория»",
    lat: 45.032,
    lng: 35.381,
  },
  {
    region: "astrakhan",
    type: "hotel",
    name: "Гостиница «Азимут»",
    lat: 46.345,
    lng: 48.023,
  },
  {
    region: "astrakhan",
    type: "base",
    name: "База отдыха «Успех»",
    lat: 47.38,
    lng: 47.23,
  },
  {
    region: "rostov",
    type: "hotel",
    name: "Конгресс-отель «Дон-Плаза»",
    lat: 47.226,
    lng: 39.734,
  },
  {
    region: "rostov",
    type: "hotel",
    name: "Гостиница «Таганрог»",
    lat: 47.23,
    lng: 38.9,
  },
  {
    region: "volgograd",
    type: "hotel",
    name: "Гостиница «Волгоград»",
    lat: 48.708,
    lng: 44.515,
  },
  {
    region: "adygea",
    type: "spring",
    name: "Термальные бассейны «Водная Ривьера»",
    lat: 44.47,
    lng: 40.12,
  },
  {
    region: "adygea",
    type: "base",
    name: "Турбаза «Горная»",
    lat: 44.29,
    lng: 40.18,
  },
  {
    region: "sevastopol",
    type: "hotel",
    name: "Гостиница «Севастополь»",
    lat: 44.616,
    lng: 33.524,
  },
  {
    region: "kalmykia",
    type: "hotel",
    name: "Гостиница «Элиста»",
    lat: 46.308,
    lng: 44.266,
  },
];
