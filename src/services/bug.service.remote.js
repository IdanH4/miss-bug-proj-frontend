import Axios from "axios"

var axios = Axios.create({
	withCredentials: true,
})

const BASE_URL = "http://localhost:3030/api/bug/"

export const bugsService = {
	query,
	get,
	remove,
	save,
	getEmptyBug,
	getDefaultFilter,
	getById: get,
	getFilterFromSrcParams,
}

function getFilterFromSrcParams(srcParams) {
	const title = srcParams.get("title") || ""
	const severity = srcParams.get("severity") || ""
	return {
		title,
		severity,
	}
}

async function query(filterBy = {}) {
	var { data: bugs } = await axios.get(BASE_URL)

	if (filterBy.title) {
		const regExp = new RegExp(filterBy.title, "i")
		bugs = bugs.filter(bug => regExp.test(bug.title))
	}

	if (filterBy.severity) {
		bugs = bugs.filter(bug => bug.severity === filterBy.severity)
	}
	return bugs
}

async function get(bugId) {
	const url = BASE_URL + bugId

	var { data: bug } = await axios.get(url)
	return bug
}

async function remove(bugId) {
	const url = BASE_URL + bugId
	var { data: res } = await axios.delete(url)
	return res
}

async function save(bug) {
	// const queryParams = `?_id=${bug._id || ""}&title=${bug.title}&severity=${
	// 	bug.severity
	// }&description=${bug.description}`

	console.log("bug from front-end", bug)

	try {
		const { data: savedBug } = await axios.post(BASE_URL, bug) // const { data: savedBug } = await axios.post(BASE_URL + queryParams, bug)
		console.log("savedBug from front-end", savedBug)
		return savedBug
	} catch (err) {
		console.error("Error saving bug from front-end:", err)
		throw err
	}
}

function getEmptyBug(vendor = "", speed = "") {
	return { vendor, speed }
}

function getDefaultFilter() {
	return { txt: "", minSpeed: "" }
}
