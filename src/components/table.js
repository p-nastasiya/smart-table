import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
	const { tableTemplate, rowTemplate, before, after } = settings;
	const root = cloneTemplate(tableTemplate);

	// @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
	// Добавляем блоки НАД таблицей (в обратном порядке)
	before.reverse().forEach(templateName => {
		root[templateName] = cloneTemplate(templateName);
		root.container.prepend(root[templateName].container);
	});

	// Добавляем блоки ПОД таблицей (в прямом порядке)
	after.forEach(templateName => {
		root[templateName] = cloneTemplate(templateName);
		root.container.append(root[templateName].container);
	});


	// @todo: #1.3 — обработать события и вызвать onAction()
	// Обработчик изменений в полях формы
	root.container.addEventListener('change', () => {
		onAction(); // Без аргументов - просто что-то изменилось
	});

	// Обработчик сброса формы
	root.container.addEventListener('reset', () => {
		setTimeout(onAction); // С задержкой - даем время полям очиститься
	});

	// Обработчик отправки формы
	root.container.addEventListener('submit', (e) => {
		e.preventDefault(); // Отменяем перезагрузку страницы
		onAction(e.submitter); // Передаем конкретную кнопку
	});

	const render = (data) => {
		// @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
		// Преобразуем данные в массив строк
		const nextRows = data.map(item => {
			// 1. Клонируем шаблон строки
			const row = cloneTemplate(rowTemplate);

			// 2. Заполняем шаблон данными
			Object.keys(item).forEach(key => {
				// Проверяем, есть ли в шаблоне элемент с таким именем
				if (row.elements[key]) {
					// Заполняем элемент данными
					row.elements[key].textContent = item[key];
				}
			});

			// 3. Возвращаем готовую строку
			return row.container;
		});

		// Заменяем старые строки на новые
		root.elements.rows.replaceChildren(...nextRows);
	}

	return { ...root, render };
}