import { createComparison } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор специально для фильтрации
const compare = createComparison([
	'skipEmptyTargetValues',      // Пропускаем пустые значения фильтров
	'caseInsensitiveStringIncludes', // Поиск без учета регистра
	'skipNonExistentSourceFields',
	'failOnEmptySource',
	'arrayAsRange',
	'stringIncludes',
	'exactEquality'
]);

export function initFiltering(elements, indexes) {
	// @todo: #4.1 — заполнить выпадающие списки опциями
	Object.keys(indexes).forEach((elementName) => {
		if (elements[elementName]) {
			const options = Object.values(indexes[elementName]).map(name => {
				const option = document.createElement('option');
				option.value = name;
				option.textContent = name;
				return option;
			});

			const emptyOption = document.createElement('option');
			emptyOption.value = '';
			emptyOption.textContent = 'Все';
			elements[elementName].append(emptyOption, ...options);
		}
	});

	return (data, state, action) => {
		// @todo: #4.2 — обработать очистку поля
		if (action && action.name === 'clear') {
			const fieldName = action.dataset.field;
			const parent = action.closest('.filter-group');

			if (parent) {
				const input = parent.querySelector('input, select');
				if (input) {
					input.value = '';
					state[fieldName] = '';
				}
			}
		}

		// @todo: #4.5 — отфильтровать данные используя компаратор
		return data.filter(row => {
			// Создаем объект для сравнения - преобразуем имена полей
			const filterCriteria = {};

			// Преобразуем имена фильтров в имена полей данных
			Object.keys(state).forEach(filterKey => {
				if (filterKey === 'searchBySeller') {
					filterCriteria['seller'] = state[filterKey];
				} else if (filterKey === 'searchByCustomer') {
					filterCriteria['customer'] = state[filterKey];
				} else if (filterKey === 'searchByDate') {
					filterCriteria['date'] = state[filterKey];
				} else if (filterKey !== 'page' && filterKey !== 'rowsPerPage') {
					// Для остальных полей (если есть)
					filterCriteria[filterKey] = state[filterKey];
				}
			});

			// @todo: Обработка диапазона totalFrom и totalTo
			if (state.totalFrom || state.totalTo) {
				filterCriteria['total'] = [
					state.totalFrom || '', // from (если пусто, то '')
					state.totalTo || ''    // to (если пусто, то '')
				];
			}

			return compare(row, filterCriteria);
		});
	}
}