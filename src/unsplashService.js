import axios from "axios";

const unsplashApi = axios.create({
	baseURL: "https://api.unsplash.com",
	headers: {
		Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_API_KEY}`,
	},
});
export const fetchImages = async (query = "random", page = 1) => {
	const response = await unsplashApi.get("/search/photos", {
		params: { query, per_page: 15, page },
	});
	return response.data.results;
};
