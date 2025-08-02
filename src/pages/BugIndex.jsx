import { bugsService } from "../services/bug.service.remote.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { useState } from "react"
import { useEffect } from "react"

export function BugIndex() {
	const [bugs, setBugs] = useState([])

	useEffect(() => {
		const intervalId = setTimeout(() => loadBugs(), 1000)

		return () => {
			console.log("Cleared")
			clearTimeout(intervalId)
		}
	}, [])

	async function loadBugs() {
		const bugs = await bugsService.query()
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
		const bug = {
			title: prompt("Bug title?"),
			description: prompt("Bug description?"),
			severity: +prompt("Bug severity?"),
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
		const description = prompt("New description?")
		const severity = +prompt("New severity?")
		const bugToSave = { ...bug, severity, description }
		try {
			const savedBug = await bugsService.save(bugToSave)
			console.log("Updated Bug:", savedBug)
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

	if (!bugs || bugs.length === 0)
		return <div className="loader">Loading...</div>

	return (
		<main className="main-layout">
			<h3>Bugs App</h3>
			<main>
				<button onClick={onAddBug}>Add Bug</button>
				<BugList
					bugs={bugs}
					onRemoveBug={onRemoveBug}
					onEditBug={onEditBug}
				/>
			</main>
		</main>
	)
}
