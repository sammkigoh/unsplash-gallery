import React from "react";

const Filter = ({ onFilterChange }) => {
	const categories = [
		"nature",
		"architecture",
		"people",
		"technology",
		"animals",
		"random",
	];

	return (
		<div className="filter-container">
			<select onChange={(e) => onFilterChange(e.target.value)}>
				{categories.map((category) => (
					<option key={category} value={category}>
						{category.charAt(0).toUpperCase() + category.slice(1)}
					</option>
				))}
			</select>
		</div>
	);
};

export default Filter;
