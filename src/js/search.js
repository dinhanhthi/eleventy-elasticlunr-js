// add .selected to current li
const addSelected2 = (ulRes, li) => {
	// remove class "selected" from all li
	ulRes.querySelectorAll("li").forEach((item) => {
			item.classList.remove("selected");
		});
	// add class "selected" to the current li
	li.classList.add("selected");
}

(function (window, document) {
	"use strict";

	const search = (e) => {
		const results = window.searchIndex.search(e.target.value, {
			bool: "OR",
			expand: true,
		});

		const kw = e.target.value;
		var regEx = new RegExp(kw, "ig");
		var ae;

		const divRes = document.getElementById("nav-search__result-container"); // div (ul's father)
		const ulRes = document.getElementById("nav-search__ul"); // ul
		const noResEl = document.getElementById("nav-search__no-result");

		ulRes.innerHTML = "";
		if (kw != "") {
			divRes.style.display = "block";
			if (results != "") { // if there is result
				noResEl.style.display = "none";
				results.map((r) => {
					var { id, title, description } = r.doc; // use description instead

					const el = document.createElement("li");
					ulRes.appendChild(el);

					const divIcon = document.createElement("div");
					divIcon.setAttribute("class", "item__icon");
					el.appendChild(divIcon);
					const divIcon__img = document.createElement("img");
					divIcon__img.setAttribute("src", "/img/item.svg");
					divIcon.appendChild(divIcon__img);

					const divContent = document.createElement("div");
					divContent.setAttribute("class", "item__content");
					el.appendChild(divContent);

					const h3 = document.createElement("h3");
					divContent.appendChild(h3);
					const a = document.createElement("a");
					a.setAttribute("href", id);
					if (title && kw) {
						if (title.toLowerCase().includes(kw.toLowerCase())) {
							title = title.replace(regEx, function (x) {
								return '<mark>' + x + '</mark>';
							});
						}
					}
					a.innerHTML = title;
					h3.appendChild(a);

					const p = document.createElement("p");

					if (description && kw) {
						if (description.toLowerCase().includes(kw.toLowerCase())) {
							description = description.replace(regEx, function (x) {
								return ' <mark>' + x + '</mark>';
							});
						}
						if (description.indexOf("<mark>") > 10){
							description = "..." + description.substring(description.indexOf("<mark>") - 10);
						}
						// too long description or content
						// -- uncomment below if search on full content
						// if (description.length > 500) {
						// 	description = "..." + description.substring(0, description.indexOf("<mark>") + kw.length + 15) + "..."
						// }
					}
					p.innerHTML = description;
					divContent.appendChild(p);

					const enter = document.createElement("div");
					enter.setAttribute("class", "enter");
					el.appendChild(enter);
					const enter__img = document.createElement("img");
					enter__img.setAttribute("src", "/img/enter.png");
					enter.appendChild(enter__img);

				});

				ulRes.firstChild.classList.add("selected");

				// mouse hover trigger for li
				ulRes.querySelectorAll("li").forEach((item) => {
					item.addEventListener("mousemove", () => {
						addSelected2(ulRes, item);
					}, false);

					// if <a> focused by a Tab key
					item
						.getElementsByClassName("item__content")[0]
						.firstChild.firstChild.addEventListener("focus", () => {
							addSelected2(ulRes, item);
						}, false);
				});

			} else {
				noResEl.style.display = "block";
			}
		} else {
			divRes.style.display = "none";
		}

	};

	fetch("/pages/search-index.json").then((response) =>
		response.json().then((rawIndex) => {
			window.searchIndex = elasticlunr.Index.load(rawIndex);
			document.getElementById("nav-search__input").addEventListener("input", search);
		})
	);
})(window, document);