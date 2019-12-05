import {backend, endpointURL} from "./settings.js"

function handleHttpErrors(res) {
	if (!res.ok) {
		return Promise.reject({status: res.status, fullError: res.json()})
	}
	return res.json();
}

function apiFacade() {
	const setToken = (token) => {
		localStorage.setItem('jwtToken', token)
	};
	const getToken = () => {
		return localStorage.getItem('jwtToken')
	};

	const fetchAllFlights = () => {
		return fetch(backend + "/api/flights/global").then(handleHttpErrors);
	};

	const fetchAllLogs = () => {
		return fetch(backend + "/api/flights/log").then(handleHttpErrors);
	};

	const fetchAllSearchLogs = () => {
		return fetch(backend + "/api/flights/searchlog").then(handleHttpErrors);
	};

	const searchFlights = (searchData) => {
		const options = makeOptions("POST", false, searchData);
		console.log(options);
		return fetch(backend + "/api/flights/search", options).then(handleHttpErrors);
	};

	const logSearch = (data) => {
		const options = makeOptions("POST", false, data);
		console.log(data);
		return fetch(backend + "/api/flights/search/log", options).then(handleHttpErrors);
	};

	const logFlights = (flights) => {
		const options = makeOptions("POST", false, flights);
		console.log(flights);
		return fetch(backend + "/api/flights/booking/log", options).then(handleHttpErrors);
	};

	const fetchApiData = () => {
		const options = makeOptions("GET", true);
		return fetch(endpointURL, options).then(handleHttpErrors);
	};

	const makeOptions = (method, addToken, body) => {
		var opts = {
			method: method,
			headers: {
				"Content-type": "application/json",
				'Accept': 'application/json',
			}
		};
		if (body) {
			opts.body = JSON.stringify(body);
		}
		return opts;
	};
	return {
		makeOptions,
		setToken,
		getToken,
		fetchAllFlights,
		fetchAllLogs,
		fetchApiData,
		fetchAllSearchLogs,
		searchFlights,
		logSearch,
		logFlights
	}
}

const facade = apiFacade();
export default facade;
