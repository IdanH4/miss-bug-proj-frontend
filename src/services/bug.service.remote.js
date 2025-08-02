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
}

async function query(filterBy = {}) {
	var { data: bugs } = await axios.get(BASE_URL)

	if (filterBy.txt) {
		const regExp = new RegExp(filterBy.txt, "i")
		bugs = bugs.filter(bug => regExp.test(bug.vendor))
	}

	if (filterBy.minSpeed) {
		bugs = bugs.filter(bug => bug.speed >= filterBy.minSpeed)
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

	const { data: savedBug } = await axios.get(url)
	return savedBug
}

function getEmptyBug(vendor = "", speed = "") {
	return { vendor, speed }
}

function getDefaultFilter() {
	return { txt: "", minSpeed: "" }
}
