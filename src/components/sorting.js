import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
	return (data, state, action) => {
		let field = null;
		let order = 'none';

		if (action && action.name === 'sort') {
			// @todo: #3.1 — запомнить выбранный режим сортировки
			field = action.dataset.field;  // Используем data-field атрибут
			const currentOrder = state.sortOrder === field ? state.sortDirection : 'none';
			order = sortMap[currentOrder] || 'up'; // Используем карту переключения

			// Сохраняем в state для запоминания
			state.sortField = field;
			state.sortOrder = order;


			// @todo: #3.2 — сбросить сортировки остальных колонок
			columns.forEach(column => {
				if (column !== action) {
					// Сбрасываем визуальное выделение других колонок
					column.dataset.value = 'none';
					column.classList.remove('sorted-asc', 'sorted-desc');
				}
			});

			// Визуально выделяем текущую колонку
			action.dataset.value = order;
			action.classList.remove('sorted-asc', 'sorted-desc');
			if (order === 'up') {
				action.classList.add('sorted-asc');
			} else if (order === 'down') {
				action.classList.add('sorted-desc');
			}

		} else {
			// @todo: #3.3 — получить выбранный режим сортировки
			field = state.sortField;
			order = state.sortOrder;
		}

		return sortCollection(data, field, order);
	}
}


