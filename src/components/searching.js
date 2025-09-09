import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {

	// Создаем правило для поиска по нескольким полям
	const searchRule = rules.searchMultipleFields(
		searchField,
		['date', 'customer', 'seller', 'total'],
		false
	);
	// @todo: #5.1 — настроить компаратор
	const compare = createComparison(['skipEmptyTargetValues'], [searchRule]);



	return (data, state, action) => {
		// @todo: #5.2 — применить компаратор

		let filter_data = data.filter(row => {
			// Применяем компаратор
			return compare(row, state);
		});
		return filter_data;
	}
}