import { useEffect, useRef, useState } from "react"
import debounce from "debounce"

export function BugFilter({ defaultFilter, onSetFilter }) {
	const [filterByToEdit, setFilterByToEdit] = useState(defaultFilter)
	const onSetFilterDebounce = useRef(debounce(onSetFilter, 500)).current

	function handleChange({ target }) {
		let { value, name: field } = target
		switch (target.type) {
			case "range":
			case "number":
				value = +target.value
				break
			case "checkbox":
				value = target.checked
				break
		}
		setFilterByToEdit(prev => {
			const updatedFilter = { ...prev, [field]: value }
			onSetFilterDebounce(updatedFilter) // Debounced call
			return updatedFilter
		})
	}
	const { title, severity } = filterByToEdit

	return (
		<form className="bug-filter-container">
			<h2 style={{ alignSelf: "center" }}>Filter Bugs</h2>
			<label htmlFor="title" className="sr-only">
				Title
			</label>

			<input
				id="title"
				name="title"
				type="text"
				placeholder="Title"
				value={title}
				onChange={handleChange}
			/>

			<label htmlFor="severity" className="sr-only">
				Severity
			</label>
			<input
				id="severity"
				name="severity"
				type="number"
				placeholder="Severity"
				value={severity || ""}
				onChange={handleChange}
			/>
		</form>
	)
}
