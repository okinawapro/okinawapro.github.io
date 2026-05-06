<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>RafaelT's Class Activities– HTML Index</title>

<style>
  body {
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: linear-gradient(135deg, #ff933a, #dfdfde);
    margin: 0;
    padding: 24px;
    color: #1f2937;
  }

  h1 {
    text-align: center;
    margin-bottom: 8px;
  }

  p {
    text-align: center;
    margin-bottom: 24px;
  }

  .card {
    max-width: 720px;
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 10px 0;
  }

  a {
    display: block;
    padding: 12px 16px;
    background: #2563eb;
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-weight: 600;
    transition: transform 0.1s ease, background 0.2s ease;
  }

  a:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  .loading {
    text-align: center;
    font-weight: bold;
  }

  .error {
    color: #b91c1c;
    text-align: center;
    font-weight: bold;
  }
</style>
</head>

<body>

<h1>Welcome to Class</h1>
<p>Here is a list of all class activities created. They are numbered by week. The list is Auto‑generated from all HTML pages in this repository</p>

<div class="card">
  <div id="status" class="loading">Loading pages…</div>
  <ul id="list"></ul>
</div>

<script>
const owner = "okinawapro";
const repo = "okinawapro.github.io";
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/`;

const listEl = document.getElementById("list");
const statusEl = document.getElementById("status");

fetch(apiUrl)
  .then(res => res.json())
  .then(files => {
    const htmlFiles = files
      .filter(f => f.type === "file")
      .map(f => f.name)
      .filter(name => name.endsWith(".html") && name !== "index.html")
      .sort((a, b) => a.localeCompare(b));

    if (htmlFiles.length === 0) {
      statusEl.textContent = "No HTML pages found.";
      return;
    }

    statusEl.remove();

    htmlFiles.forEach(file => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = file;
      a.textContent = file.replace(".html", "").replace(/[-_]/g, " ");
      li.appendChild(a);
      listEl.appendChild(li);
    });
  })
  .catch(err => {
    console.error(err);
    statusEl.textContent = "Failed to load page list.";
    statusEl.className = "error";
  });
</script>

</body>
</html>
