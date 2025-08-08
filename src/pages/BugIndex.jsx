import { bugsService } from "../services/bug.service.remote.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { useState } from "react"
import { useEffect } from "react"
import { BugFilter } from "../cmps/BugFilter.jsx"
import { useSearchParams } from "react-router-dom"
import { getTruthyValues } from "../services/util.service.js"
import { Logger } from "sass"

export function BugIndex() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [bugs, setBugs] = useState([])
	const [filterBy, setFilterBy] = useState(
		bugsService.getFilterFromSrcParams(searchParams)
	)
	useEffect(() => {
		loadBugs()
		setSearchParams(getTruthyValues(filterBy))
	}, [filterBy])

	function onSetFilter(filterBy) {
		setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
	}

	async function loadBugs() {
		const bugs = await bugsService.query(filterBy)
		console.log("bugs", bugs)
		setBugs(bugs)
	}

	async function onRemoveBug(bugId) {
		if (!confirm("Are you sure?")) return

		try {
			await bugsService.remove(bugId)
			console.log("Deleted Succesfully!")
			setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
			showSuccessMsg("Bug removed")
		} catch (err) {
			console.log("Error from onRemoveBug ->", err)
			showErrorMsg("Cannot remove bug")
		}
	}

	async function onAddBug() {
		const bugTitle = prompt("Bug title?")
		if (!bugTitle) {
			showErrorMsg("Bug title is empty.")
			return
		}

		const bugDescription = prompt("Bug description?")
		if (!bugDescription) {
			showErrorMsg("Bug description is empty.")
			return
		}

		const bugSeverity = +prompt("Bug severity?")
		if (!bugSeverity) {
			showErrorMsg("Bug severity is empty.")
			return
		}

		const bug = {
			title: bugTitle,
			description: bugDescription,
			severity: bugSeverity,
		}
		try {
			const savedBug = await bugsService.save(bug)
			console.log("Added Bug", savedBug)
			setBugs(prevBugs => [...prevBugs, savedBug])
			showSuccessMsg("Bug added")
		} catch (err) {
			console.log("Error from onAddBug ->", err)
			showErrorMsg("Cannot add bug")
		}
	}

	async function onEditBug(bug) {
		const title = prompt("New title?")

		if (!title) {
			showErrorMsg("title is empty.")
			return
		}

		const description = prompt("New description?")

		if (!description) {
			showErrorMsg("Description is empty.")
			return
		}

		const severity = +prompt("New severity?")

		if (!severity) {
			showErrorMsg("Severity is empty.")
			return
		}

		const bugToSave = { ...bug, title, severity, description }

		try {
			const savedBug = await bugsService.save(bugToSave)
			console.log("IDAN Updated Bug:", savedBug)
			setBugs(prevBugs =>
				prevBugs.map(currBug =>
					currBug._id === savedBug._id ? savedBug : currBug
				)
			)
			showSuccessMsg("Bug updated")
		} catch (err) {
			console.log("Error from onEditBug ->", err)
			showErrorMsg("Cannot update bug")
		}
	}

	return (
		<main className="main-layout">
			<h3>Bugs App</h3>
			<main>
				<button onClick={onAddBug}>Add Bug</button>
				<BugFilter defaultFilter={filterBy} onSetFilter={onSetFilter} />
				<BugList
					bugs={bugs}
					onRemoveBug={onRemoveBug}
					onEditBug={onEditBug}
				/>
			</main>
		</main>
	)
}
