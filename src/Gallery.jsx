import React from "react";
import { fetchImages } from "./unsplashService";
import { useState } from "react";
import { useEffect } from "react";
import "./Gallery.css";
import Filter from "./Filter";

const Gallery = () => {
	const [images, setImages] = useState([]);
	const [query, setQuery] = useState("random");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [showButton, setShowButton] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const [touchStartX, setTouchStartX] = useState(0);
	const [touchEndX, setTouchEndX] = useState(0);
	const [lightboxVisible, setLightboxVisible] = useState(false);

	const toggleDarkMode = () => {
		setDarkMode((prevMode) => !prevMode);
	};
	const handleTouchStart = (e) => {
		setTouchStartX(e.touches[0].clientX);
	};
	const handleTouchMove = (e) => {
		setTouchEndX(e.touches[0].clientX);
	};
	const handleTouchEnd = () => {
		// swipe diection determination
		if (touchStartX - touchEndX > 50) {
			// swipe left (next image)
			showNextImage();
		} else if (touchEndX - touchStartX > 50) {
			// swipe right (previous image)
			showPrevImage();
		}

		//resetting the touch coordinates
		setTouchStartX(0);
		setTouchEndX(0);
	};
	useEffect(() => {
		const handleScrollVisibility = () => {
			if (window.scrollY > 300) {
				setShowButton(true);
			} else {
				setShowButton(false);
			}
		};

		const loadImages = async () => {
			setLoading(true);
			const data = await fetchImages(query, page);
			setImages((prevImages) => [...prevImages, ...data]);
			setLoading(false);
		};
		loadImages();
		window.addEventListener("scroll", handleScroll);
		window.addEventListener("scroll", handleScrollVisibility);
		return () => {
			window.removeEventListener("scroll", handleScrollVisibility);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [query, page]);
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleFilterChange = (newQuery) => {
		setQuery(newQuery);
		setPage(1);
		setImages([]);
	};
	const handleSortChange = (sortType) => {
		const sortedImages = [...images];

		if (sortType === "likes") {
			sortedImages.sort((a, b) => b.likes - a.likes);
		} else if (sortType === "date") {
			sortedImages.sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
			);
		}

		setImages(sortedImages);
	};
	const handleScroll = () => {
		if (
			window.innerHeight + window.scrollY >=
				document.body.offsetHeight - 500 &&
			!loading
		) {
			setPage((prevPage) => prevPage + 1);
		}
	};
	const openLightbox = (image) => {
		console.log("image clicked:", image);
		setSelectedImage(image);
		setLightboxVisible(true);
	};

	const closeLightbox = () => {
		setSelectedImage(null);
		setLightboxVisible(false);
		//we delay the clearing selectedImage until the fadeout animation finishes
		setTimeout(() => setSelectedImage(null), 300);
	};

	const showPrevImage = (e) => {
		if (e) e.stopPropagation();
		const currentIndex = images.findIndex(
			(image) => image.id === selectedImage.id
		);
		if (currentIndex > 0) {
			setSelectedImage(images[currentIndex - 1]);
		}
	};

	const showNextImage = (e) => {
		if (e) e.stopPropagation();
		const currentIndex = images.findIndex(
			(image) => image.id === selectedImage.id
		);
		if (currentIndex < images.length - 1) {
			setSelectedImage(images[currentIndex + 1]);
		}
	};

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "ArrowLeft") showPrevImage();
			if (e.key === "ArrowRight") showNextImage();
			if (e.key === "Escape") closeLightbox();
		};
		if (selectedImage) {
			window.addEventListener("keydown", handleKeyDown);
		} else {
			window.removeEventListener("keydown", handleKeyDown);
		}
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedImage]);

	return (
		<>
			<header className="gallery-header">
				<p>Some beautiful images from Unsplash</p>
			</header>
			<div className={`gallery-container ${darkMode ? "dark-mode" : ""}`}>
				<button className="dark-mode-toggle" onClick={toggleDarkMode}>
					{darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
				</button>
				<Filter onFilterChange={handleFilterChange} />
				<div className="sorting-container">
					<select onChange={(e) => handleSortChange(e.target.value)}>
						<option value="relevance">Sort by Relevance</option>
						<option value="likes">Sort by Likes</option>
						<option value="date">Sort by Date</option>
					</select>
				</div>
				<div className="gallery-grid">
					{images.map((image, index) => (
						<div
							key={`${image.id}-${index}`}
							className="image-container"
							onClick={() => openLightbox(image)}
						>
							<img
								src={
									image?.urls?.thumb ||
									"https://via.placeholder.com/200"
								}
								alt={image.alt_description || "Image"}
								loading="lazy"
								className="gallery-image"
							/>
							<div className="hover-overlay">
								<p>
									{image.user?.name || "Unknown Photographer"}
								</p>
								<p>❤️ {image.likes || 0} Likes</p>
							</div>
						</div>
					))}
				</div>
				{loading && (
					<p className="loading-text">Loading more images...</p>
				)}
				{console.log("Selected Image:", selectedImage)}
				{selectedImage && (
					<div
						className={`lightbox ${
							lightboxVisible ? "lightbox-visible" : ""
						}`}
						onClick={closeLightbox}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<button
							className="close-btn"
							onClick={(e) => {
								e.stopPropagation();
								closeLightbox();
							}}
						>
							✖
						</button>
						<button
							className="nav-btn left"
							onClick={showPrevImage}
						>
							◀
						</button>
						<div
							className="lightbox-content"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="thumbnail-container">
								{images.map((image, index) => (
									<img
										key={`${image.id}-${index}-thumb`}
										src={
											image.urls.thumb ||
											"https://via.placeholder.com/200"
										}
										alt={
											image.alt_description || "Thumbnail"
										}
										className={`thumbnail ${
											image.id === selectedImage.id
												? "active-thumbnail"
												: ""
										}`}
										onClick={() => setSelectedImage(images)}
									/>
								))}
							</div>
							<p className="caption">
								{selectedImage.alt_description ||
									"No description available"}
							</p>
						</div>
						<button
							className="nav-btn right"
							onClick={showNextImage}
						>
							▶
						</button>
					</div>
				)}
				{showButton && (
					<button className="back-to-top" onClick={scrollToTop}>
						⬆ Back to Top
					</button>
				)}
			</div>
			<footer className="gallery-footer">
				<p>Built with 💖 by Samuel | Powered by Unsplash API</p>
			</footer>
		</>
	);
};

export default Gallery;
