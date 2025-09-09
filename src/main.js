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


// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

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
function render(action) {

	console.log('First few data items:', data.slice(0, 3)); // Посмотрим структуру данных
	let state = collectState(); // состояние полей из таблицы
	let result = [...data]; // копируем для последующего изменения

	result = applySearching(result, state, action);

	result = applyFiltering(result, state, action);

	result = applySorting(result, state, action);

	result = applyPagination(result, state, action);

	sampleTable.render(result);

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
const applyPagination = initPagination(
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
const applyFiltering = initFiltering(sampleTable.filter.elements, {    // передаём элементы фильтра
	searchBySeller: indexes.sellers,                                    // для элемента с именем searchBySeller устанавливаем массив продавцов
	searchByCustomer: indexes.customers,                                    // для элемента с именем searchByCustomer устанавливаем массив продавцов
	//searchByDate: indexes.purchase_records.date                                    // для элемента с именем searchByDate устанавливаем массив продавцов

});

// @todo: инициализация сортировки
const applySorting = initSorting([
	sampleTable.header.elements.sortByDate,     // Кнопки сортировки из шаблона header
	sampleTable.header.elements.sortByTotal
]);




const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
