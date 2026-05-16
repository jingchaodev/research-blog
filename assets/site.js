const SITE_BASE_PATH = window.location.pathname.startsWith("/research-blog/") ? "/research-blog/" : "/";
const POSTS_MANIFEST_PATH = window.location.pathname.includes("/archive/") ? "../data/posts.json" : "data/posts.json";

function sitePath(path = "") {
  return `${SITE_BASE_PATH}${path}`;
}

async function loadPosts() {
  const res = await fetch(POSTS_MANIFEST_PATH);
  if (!res.ok) throw new Error(`Failed to load posts manifest: ${res.status}`);
  return await res.json();
}

function createNode(tagName, text) {
  const node = document.createElement(tagName);
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderMessage(targetId, message, extraClass) {
  const root = document.getElementById(targetId);
  if (!root) return;

  const card = createNode("article");
  card.classList.add("post-card", "status-message");
  if (extraClass) {
    card.classList.add(extraClass);
  }

  const copy = createNode("p", message);
  card.appendChild(copy);
  root.replaceChildren(card);
}

function createTagNode(tag) {
  const tagNode = createNode("span", tag);
  tagNode.classList.add("tag");
  return tagNode;
}

function createPostCard(post) {
  const article = createNode("article");
  article.classList.add("post-card");

  const meta = createNode("div", post.published || "");
  meta.classList.add("post-meta");
  article.appendChild(meta);

  const heading = createNode("h3");
  const link = createNode("a", post.title || "Untitled");
  link.setAttribute("href", sitePath(post.public_path || ""));
  heading.appendChild(link);
  article.appendChild(heading);

  article.appendChild(createNode("p", post.summary || ""));

  const tags = createNode("div");
  tags.classList.add("tags");
  for (const tag of post.tags || []) {
    tags.appendChild(createTagNode(tag));
  }
  article.appendChild(tags);

  return article;
}

function renderCards(posts, targetId) {
  const root = document.getElementById(targetId);
  if (!root) return;

  if (!posts.length) {
    renderMessage(targetId, "No posts yet.", "empty-state");
    return;
  }

  root.replaceChildren(...posts.map(createPostCard));
}

(async function init() {
  try {
    const posts = await loadPosts();
    renderCards(posts.slice(0, 10), "latest-posts");
    renderCards(posts, "archive-posts");
  } catch (err) {
    console.error(err);
    renderMessage("latest-posts", "Unable to load posts right now.", "error-state");
    renderMessage("archive-posts", "Unable to load posts right now.", "error-state");
  }
})();
