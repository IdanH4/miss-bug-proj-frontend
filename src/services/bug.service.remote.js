import Axios from "axios"

var axios = Axios.create({
	withCredentials: true,
})

const BASE_URL = "//localhost:3030/api/bug/"

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
	const url = BASE_URL + bugId + "/remove"
	var { data: res } = await axios.get(url)
	return res
}

async function save(bug) {
	const queryParams = `?_id=${bug._id || ""}&title=${bug.title}&severity=${
		bug.severity
	}&description=${bug.description}`
	const url = BASE_URL + "save" + queryParams
	console.log("url", url)

	const { data: savedBug } = await axios.get(url)
	return savedBug
}

function getEmptyBug(vendor = "", speed = "") {
	return { vendor, speed }
}

function getDefaultFilter() {
	return { txt: "", minSpeed: "" }
}
