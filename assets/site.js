async function loadPosts() {
  const path = window.location.pathname.includes("/archive/") ? "../data/posts.json" : "data/posts.json";
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load posts manifest: ${res.status}`);
  return await res.json();
}

function renderCards(posts, targetId) {
  const root = document.getElementById(targetId);
  if (!root) return;
  root.innerHTML = posts.map(post => `
    <article class="post-card">
      <div class="post-meta">${post.published}</div>
      <h3><a href="/research-blog/${post.public_path}">${post.title}</a></h3>
      <p>${post.summary}</p>
      <div class="tags">${(post.tags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
    </article>
  `).join("");
}

(async function init() {
  try {
    const posts = await loadPosts();
    renderCards(posts.slice(0, 10), "latest-posts");
    renderCards(posts, "archive-posts");
  } catch (err) {
    console.error(err);
  }
})();
