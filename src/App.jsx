import { useState } from "react";
import Gallery from "./Gallery";
import "./App.css";

function App() {
	return (
		<div className="App">
			<img src="./gallery.svg" alt="logo" />
			<h1>Unsplash Image Gallery </h1>
			<Gallery />
		</div>
	);
}

export default App;
