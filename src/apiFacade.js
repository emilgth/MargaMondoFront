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

	const searchFlights = (searchData) => {
		const options = makeOptions("POST", false, searchData);
		console.log(options);
		return fetch(backend + "/api/flights/search", options).then(handleHttpErrors);
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
		fetchApiData,
		searchFlights
	}
}

const facade = apiFacade();
export default facade;
