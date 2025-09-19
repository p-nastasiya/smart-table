export function initSorting(columns) {
	return (query, state, action) => {
		let field = null;
		let order = 'none';

		if (action && action.name === 'sort') {
			// @todo: #3.1 — запомнить выбранный режим сортировки
			field = action.dataset.field;  // Обработка действия сортировки

			if (state.sortField === field) {
				order = state.sortOrder === 'up' ? 'down' : 'up';
			} else {
				order = 'up';
			} // Используем карту переключения

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
			if (order === 'asc') {
				action.classList.add('sorted-asc');
			} else if (order === 'desc') {
				action.classList.add('sorted-desc');
			}

		} else {
			// @todo: #3.3 — получить выбранный режим сортировки
			field = state.sortField;
			order = state.sortOrder;
		}

		// return sortCollection(data, field, order);
		const sort = (field && order !== 'none') ? `${field}:${order}` : null;

		return sort ? Object.assign({}, query, { sort }) : query;
	};
}


