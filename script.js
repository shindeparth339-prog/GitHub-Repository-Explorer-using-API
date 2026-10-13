
var form = document.getElementById("searchForm");
var searchInput = document.getElementById("searchInput");
var languageFilter = document.getElementById("languageFilter");
var searchButton = document.getElementById("searchButton");
var results = document.getElementById("results");
var statusText = document.getElementById("status");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    searchRepositories();
});

function searchRepositories() {
    var keyword = searchInput.value.trim();
    var language = languageFilter.value;

    if (keyword === "") {
        statusText.textContent = "Please enter a search keyword.";
        return;
    }

    var query = keyword;

    if (language !== "") {
        query += " language:" + language;
    }

    var url = "https://api.github.com/search/repositories?q="
        + encodeURIComponent(query)
        + "&sort=stars&order=desc&per_page=12";

    statusText.textContent = "Loading repositories...";
    results.innerHTML = "";
    searchButton.disabled = true;

    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("GitHub API request failed.");
            }
            return response.json();
        })
        .then(function(data) {
            results.innerHTML = "";

            if (!data.items || data.items.length === 0) {
                statusText.textContent = "No repositories found.";
                return;
            }

            statusText.textContent =
                "Found " + data.total_count +
                " repositories. Showing up to " +
                data.items.length + " results.";

            data.items.forEach(function(repo) {
                var card = document.createElement("article");
                card.className = "repo-card";

                var title = document.createElement("h3");
                var link = document.createElement("a");

                link.href = repo.html_url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = repo.full_name;

                title.appendChild(link);
                card.appendChild(title);

                var description = document.createElement("p");
                description.textContent =
                    repo.description || "No description available.";
                card.appendChild(description);

                var info = document.createElement("div");
                info.className = "repo-info";

                var stars = document.createElement("span");
                stars.textContent = "Stars: " + repo.stargazers_count;
                info.appendChild(stars);

                var forks = document.createElement("span");
                forks.textContent = "Forks: " + repo.forks_count;
                info.appendChild(forks);

                var languageText = document.createElement("span");
                languageText.className = "language";
                languageText.textContent = repo.language || "Not specified";
                info.appendChild(languageText);

                card.appendChild(info);

                var owner = document.createElement("p");
                owner.textContent = "Owner: " + repo.owner.login;
                card.appendChild(owner);

                var viewLink = document.createElement("a");
                viewLink.href = repo.html_url;
                viewLink.target = "_blank";
                viewLink.rel = "noopener noreferrer";
                viewLink.className = "view-link";
                viewLink.textContent = "View Repository";

                card.appendChild(viewLink);
                results.appendChild(card);
            });
        })
        .catch(function(error) {
            statusText.textContent =
                "Unable to load repositories. Check your internet connection and try again.";
        })
        .then(function() {
            searchButton.disabled = false;
        });
}
