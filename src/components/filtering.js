export function initFiltering(elements) {
	const updateIndexes = (elements, indexes) => {
		Object.keys(indexes).forEach((elementName) => {
			if (elements[elementName]) {
				// Добавляем пустую опцию "Все"
				const emptyOption = document.createElement('option');
				emptyOption.value = '';
				emptyOption.textContent = 'Все';
				elements[elementName].appendChild(emptyOption);
				
				// Добавляем остальные опции
				Object.values(indexes[elementName]).forEach(name => {
						const el = document.createElement('option');
						el.textContent = name;
						el.value = name;
						elements[elementName].appendChild(el);
				});
			}
		});
	};

	const applyFiltering = (query, state, action) => {
		// код с обработкой очистки поля
		if (action && action.name === 'clear') {
			const fieldName = action.dataset.field;
			
			// Находим элемент по имени поля
			Object.keys(elements).forEach(key => {
					const element = elements[key];
					if (element && element.name === fieldName) {
							element.value = ''; // Очищаем значение
							
							// Также очищаем соответствующее поле в state
							if (state[fieldName]) {
									state[fieldName] = '';
							}
					}
			});
	}

		// @todo: — отфильтровать данные
		const filter = {};
		Object.keys(elements).forEach(key => {
			if (elements[key]) {
				if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
					filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
				}
			}
		})

		return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
	}

	return {
		updateIndexes,
		applyFiltering
	}
}