import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSearching } from "./components/searching.js";
import { initFiltering } from "./components/filtering.js";
import { initSorting } from "./components/sorting.js";


// @todo: подключение
const api = initData(sourceData); // Вызов initData(sourceData) присваиваем константе API


/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
	const state = processFormData(new FormData(sampleTable.container));

	const rowsPerPage = parseInt(state.rowsPerPage);    // приведём количество страниц к числу
	const page = parseInt(state.page ?? 1);                // номер страницы по умолчанию 1 и тоже число

	return {                                            // расширьте существующий return вот так
		...state,
		rowsPerPage,
		page
	};
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {  // Делаем функцию асинхронной
	try {
		let state = collectState(); // состояние полей из таблицы
		let query = {}; // копируем для последующего изменения

		query = applySearching(query, state, action); // result заменяем на query
		query = applyFiltering(query, state, action);
		query = applySorting(query, state, action);
		query = applyPagination(query, state, action); // обновляем query

		const { total, items } = await api.getRecords(query); // запрашиваем данные с собранными параметрами

		updatePagination(total, query); // перерисовываем пагинатор
		sampleTable.render(items);
	} catch (error) {
		console.error('Error in render:', error);
		sampleTable.render([]);
	}
}

const sampleTable = initTable({
	tableTemplate: 'table',
	rowTemplate: 'row',
	before: ['search', 'header', 'filter'],
	after: ['pagination']
}, render);

// @todo: инициализация поиска
const applySearching = initSearching('search'); // имя поля поиска в state



// @todo: инициализация пагинации
const { applyPagination, updatePagination } = initPagination(
	sampleTable.pagination.elements,             // передаём сюда элементы пагинации, найденные в шаблоне
	(el, page, isCurrent) => {                    // и колбэк, чтобы заполнять кнопки страниц данными
		const input = el.querySelector('input');
		const label = el.querySelector('span');
		input.value = page;
		input.checked = isCurrent;
		label.textContent = page;
		return el;
	}
);


// @todo: инициализация фильтрации
const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements)

// @todo: инициализация сортировки
const applySorting = initSorting([
	sampleTable.header.elements.sortByDate,     // Кнопки сортировки из шаблона header
	sampleTable.header.elements.sortByTotal
]);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Объявляем асинхронную функцию init()
async function init() {
	const indexes = await api.getIndexes();

	updateIndexes(sampleTable.filter.elements, {
		searchBySeller: indexes.sellers
	});
}

// Заменяем вызов render на init().then(render)
init().then(() => {
	render();
});
