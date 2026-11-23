"use strict";
const el = (id) => document.getElementById(id);
// Подпись, значок и цвет для каждого слоя карты.
const kinds = {
  hotel: ["Отели", "▦", "#a55e42"],
  base: ["Базы отдыха", "⌂", "#806642"],
  spring: ["Термальные источники", "≈", "#2e7988"],
  park: ["Охраняемые территории", "♠", "#4c774e"],
};
const icon = (key, pin = false) =>
  '<span aria-hidden="true" class="symbol ' +
  (pin ? "placepin" : "") +
  '" style="--color:' +
  kinds[key][2] +
  '">' +
  kinds[key][1] +
  "</span>";
const regionSelect = el("region");
const citySelect = el("city");
REGIONS.forEach((r) => regionSelect.add(new Option(r.name, r.id)));
for (const [key, [title]] of Object.entries(kinds)) {
  el("layers").insertAdjacentHTML(
    "beforeend",
    '<label class="layer">' +
      icon(key) +
      title +
      '<input type="checkbox" checked value="' +
      key +
      '"></label>',
  );
}
// Географическая основа хранится в geography.js и работает без сети.
const map = L.map("map", {
  minZoom: 5,
  maxZoom: 12,
  scrollWheelZoom: false,
  zoomSnap: 0.25,
  maxBounds: [
    [39, 28],
    [54, 55],
  ],
});
map.attributionControl.setPrefix(false);
map.attributionControl.addAttribution("Natural Earth · обзорная карта");
for (const [key, color] of [
  ["land", "#e4e9d6"],
  ["lakes", "#b7d3d4"],
  ["rivers_lake_centerlines", "#9bbfc2"],
]) {
  L.geoJSON(GEOGRAPHY[key], {
    interactive: false,
    style: {
      color: key === "land" ? "#acbda7" : color,
      weight: 1,
      fillColor: color,
      fillOpacity: 1,
    },
  }).addTo(map);
}
L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);
const pins = L.layerGroup().addTo(map);
const labels = L.layerGroup().addTo(map);
const selectionArea = L.layerGroup().addTo(map);
function mapLabel(lat, lng, title, sea = false) {
  L.marker([lat, lng], {
    interactive: false,
    keyboard: false,
    zIndexOffset: -1000,
    icon: L.divIcon({
      className: "maplabel " + (sea ? "sea" : ""),
      html: title,
      iconAnchor: [-10, -6],
    }),
  }).addTo(labels);
}
function refreshLabels() {
  labels.clearLayers();
  const seen = [];
  const add = (lat, lng, title, sea = false) => {
    const p = map.latLngToContainerPoint([lat, lng]);
    if (seen.some((q) => Math.abs(q.x - p.x) < 80 && Math.abs(q.y - p.y) < 17)) return;
    mapLabel(lat, lng, title, sea);
    seen.push(p);
  };
  for (const cities of Object.values(CITIES))
    for (const { name, lat, lng } of cities) add(lat, lng, name);
  add(43.9, 36.6, "Чёрное море", true);
  add(46.1, 36.65, "Азовское море", true);
  add(45.3, 49, "Каспийское море", true);
}
map.on("zoomend", refreshLabels);
function updateCities() {
  citySelect.replaceChildren(new Option("Весь регион", ""));
  CITIES[regionSelect.value].forEach(({ name }) => citySelect.add(new Option(name, name)));
}
const number = (value) => value.toLocaleString("ru-RU");
// Сначала отбираем точки региона, затем применяем радиус города и выбранные слои.
function render(zoom = true) {
  const r = REGIONS.find((x) => x.id === regionSelect.value);
  const city = CITIES[r.id].find((city) => city.name === citySelect.value);
  const center = city && L.latLng(city.lat, city.lng);
  const parks = OOPT.filter(
    (p) => p.region.includes(r.name) || (r.id === "adygea" && p.region.includes("Адыгея")),
  ).map((p) => ({ ...p, type: "park" }));
  const regional = [...PLACES.filter((p) => p.region === r.id), ...parks];
  const nearby = regional.filter((p) => !center || center.distanceTo([p.lat, p.lng]) <= 25000);
  const active = new Set(
    [...document.querySelectorAll("#layers input:checked")].map((x) => x.value),
  );
  const visible = nearby.filter((p) => active.has(p.type));
  el("mapname").textContent = city ? city.name : r.name;
  el("count").textContent =
    "Точек на карте: " + visible.length + " из " + nearby.length + " в подборке";
  pins.clearLayers();
  selectionArea.clearLayers();
  el("catalog").replaceChildren();
  if (city)
    L.circle(center, {
      radius: 25000,
      color: "#6d8963",
      weight: 1,
      dashArray: "5 6",
      fillOpacity: 0.04,
      interactive: false,
    }).addTo(selectionArea);
  if (zoom) {
    const bounds = city
      ? center.toBounds(50000)
      : L.latLngBounds([
          ...regional.map((p) => [p.lat, p.lng]),
          ...CITIES[r.id].map((city) => [city.lat, city.lng]),
        ]);
    map.fitBounds(bounds, { padding: [30, 32], maxZoom: 10, animate: false });
  }
  refreshLabels();
  for (const p of visible) {
    const note =
      p.type === "park"
        ? p.category +
          ". Примерный центр ООПТ. Границы и режим участка уточняются по положению об этой территории."
        : "Ориентировочное положение. Проверьте адрес и текущий статус объекта.";
    const link =
      "https://www.openstreetmap.org/search?query=" +
      encodeURIComponent(p.name + " " + r.name);
    const marker = L.marker([p.lat, p.lng], {
      title: p.name,
      alt: p.name,
      icon: L.divIcon({
        className: "",
        html: icon(p.type, true),
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      }),
    }).addTo(pins);
    marker.bindPopup(
      "<b>" +
        p.name +
        "</b><br>" +
        kinds[p.type][0] +
        "<p>" +
        note +
        '</p><a target="_blank" rel="noopener" href="' +
        link +
        '">Найти на OpenStreetMap ↗</a>',
    );
    const button = document.createElement("button");
    button.className = "listbtn";
    button.innerHTML = icon(p.type) + p.name;
    button.onclick = () => {
      el("map").scrollIntoView({ block: "center" });
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 9), { animate: false });
      marker.openPopup();
    };
    el("catalog").append(button);
  }
  if (!visible.length)
    el("catalog").textContent = nearby.length
      ? "Все доступные слои скрыты."
      : "В подборке нет точек в этой зоне.";
  el("catalog").insertAdjacentHTML(
    "beforeend",
    '<p class="note">Справочная подборка с примерными координатами. Точки ООПТ обозначают центры территорий. Для проверки участка нужны официальные границы и режим охраны.</p>',
  );
  el("traffic").innerHTML =
    "<small>" +
    r.name +
    " · " +
    r.period +
    " год</small>" +
    r.estimates
      .map(
        (e) =>
          '<div class="stats"><div><b>' +
          number(e.value) +
          "</b><br><small>" +
          e.unit +
          '</small></div><a href="' +
          e.url +
          '" target="_blank" rel="noopener">' +
          e.who +
          " ↗</a></div>",
      )
      .join("") +
    '<p class="note">' +
    r.note +
    "</p>" +
    (city ? '<p class="note">Отдельной оценки для города в исходных данных нет.</p>' : "");
}
regionSelect.onchange = () => {
  updateCities();
  render();
};
citySelect.onchange = () => render();
el("layers").onchange = () => render(false);
el("reset").onclick = () => {
  regionSelect.selectedIndex = 0;
  document.querySelectorAll("#layers input").forEach((i) => (i.checked = true));
  updateCities();
  render();
};
// Постоянные расходы делим на доход с заказа после переменных затрат.
function calculate() {
  const inputs = ["price", "cost", "fixed"].map(el);
  const [price, cost, fixed] = inputs.map((i) => i.valueAsNumber);
  let result = "Введите три суммы для расчёта.";
  if (inputs.some((i) => !i.validity.valid)) result = "Укажите неотрицательные суммы.";
  else if ([price, cost, fixed].every(Number.isFinite)) {
    if (price > cost)
      result =
        "Заказов в месяц для покрытия затрат: " +
        number(Math.ceil(fixed / (price - cost))) +
        ".";
    else
      result =
        fixed === 0
          ? "При нуле заказов расходы покрыты."
          : "При такой цене заказы не покроют постоянные расходы.";
  }
  el("result").textContent = result;
}
el("calculator").oninput = calculate;
el("calculator").onsubmit = (e) => e.preventDefault();
updateCities();
render();
