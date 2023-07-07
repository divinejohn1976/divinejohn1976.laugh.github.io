const copyrightYear = document.querySelector(".year");
const searchField = document.querySelector("input[type='search']");
const ul = document.querySelector(".jokes ul");
const error = document.querySelector(".error");

document.addEventListener("DOMContentLoaded", () => {
	copyrightYear.innerText = new Date().getFullYear();
});

searchField.addEventListener("input", async (e) => {
	if (!navigator.onLine) {
		document.innerHTML = `
        <body style='color: white; background-color: black; display: flex; align-items: center; justify-content: center; font-size: 3rem;'><p>OFFLINE!</p></body>
        `;
		return;
	}

	error.style.display = "none";

	const returnedObject = await getJoke(e.target.value);

	setTimeout(() => {
		ul.innerHTML = "";
		if (e.target.value && returnedObject.error != true) {
			let jokes = returnedObject.jokes;
			for (let jokeObj of jokes) {
				if (jokeObj.type == "single") {
					ul.innerHTML += `<li>${jokeObj.joke}</li>`;
				} else if (jokeObj.type == "twopart") {
					let res = `<li><details>
                        <summary>${jokeObj.setup}</summary>
                        <p>${jokeObj.delivery}</p>
                    </details></li>`;
					ul.innerHTML += res;
				}
			}
		}
	}, 1000);

	if (returnedObject["error"] === true) {
		error.innerText = "Sorry, couldn't find searched keyword";
		error.style.display = "block";
	}
});

async function getJoke(keyword) {
	const url = `https://v2.jokeapi.dev/joke/Any?contains=${keyword}&amount=100`;

	const response = await fetch(url, {
		headers: {
			Accept: "application/json"
		}
	});
	const data = await response.json();
	return data;
}
