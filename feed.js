const currentUser = {
  name: "Ансар Ильясов",
  handle: "ansar.i",
  university: "ЕАГИ",
  initials: "АИ"
};

const posts = [
  {
    id: 1,
    author: "Айдана Мусина",
    handle: "aidana.m",
    initials: "АМ",
    university: "Astana IT University",
    time: "18 минут назад",
    category: "Проекты",
    text: "Наша команда готовит прототип платформы для совместного обучения. Ищем backend-разработчика — присоединяйтесь!",
    tags: ["HackAlem", "EdTech", "ИщемКоманду"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
    likes: 128,
    liked: false,
    saved: false,
    comments: [
      { author: "Данияр К.", initials: "ДК", text: "Написал вам в сообщения — могу помочь с API." },
      { author: "Мадина Е.", initials: "МЕ", text: "Очень сильная идея! Удачи команде 🔥" }
    ]
  },
  {
    id: 2,
    author: "ЕАГИ Student Council",
    handle: "eagi.campus",
    initials: "ЕС",
    university: "ЕАГИ",
    time: "1 час назад",
    category: "Новости",
    text: "В пятницу пройдёт открытая встреча студенческих клубов. Приходите познакомиться с командами и выбрать направление по интересам.",
    tags: ["ЕАГИ", "СтудКлубы", "Кампус"],
    image: "",
    likes: 74,
    liked: false,
    saved: true,
    comments: [{ author: "Аружан С.", initials: "АС", text: "Во сколько начинается встреча?" }]
  },
  {
    id: 3,
    author: "Данияр Касымов",
    handle: "daniyar.code",
    initials: "ДК",
    university: "ЕНУ · Computer Science",
    time: "3 часа назад",
    category: "Лекции",
    text: "Собрал короткий конспект по алгоритмам сортировки и добавил примеры на JavaScript. Если кому-то нужен разбор задачи — пишите в комментариях.",
    tags: ["Конспект", "JavaScript", "УчимсяВместе"],
    image: "",
    likes: 96,
    liked: false,
    saved: false,
    comments: []
  }
];

const icons = {
  heart: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  comment: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-9 8 9.8 9.8 0 0 1-3.8-.8L3 21l1.7-4.5A8 8 0 1 1 21 12Z"/></svg>',
  share: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  save: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/></svg>'
};

const feed = document.querySelector("#feed");
const postDialog = document.querySelector("#postDialog");
const commentsDialog = document.querySelector("#commentsDialog");
const postForm = document.querySelector("#postForm");
const commentForm = document.querySelector("#commentForm");
const commentsList = document.querySelector("#commentsList");
const toast = document.querySelector(".toast");
let activePostId = null;
let toastTimer;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeImageUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function postTemplate(post) {
  const commentsLabel = post.comments.length
    ? `Посмотреть комментарии (${post.comments.length})`
    : "Оставить первый комментарий";
  const image = safeImageUrl(post.image);

  return `
    <article class="card feed-post" id="post-${post.id}" data-post-id="${post.id}">
      <header class="post-head">
        <div class="avatar md">${escapeHtml(post.initials)}</div>
        <div class="post-meta"><strong>${escapeHtml(post.author)}</strong><span>${escapeHtml(post.university)} · ${escapeHtml(post.time)}</span></div>
        <span class="post-category">${escapeHtml(post.category)}</span>
        <button class="more" type="button" aria-label="Ещё действия">•••</button>
      </header>
      ${image ? `<img class="post-image" src="${escapeHtml(image)}" alt="Фото к публикации ${escapeHtml(post.author)}">` : ""}
      <div class="actions">
        <button class="action like${post.liked ? " liked" : ""}" type="button" data-action="like" aria-label="${post.liked ? "Убрать отметку Нравится" : "Нравится"}" aria-pressed="${post.liked}">${icons.heart}</button>
        <button class="action" type="button" data-action="comments" aria-label="Открыть комментарии">${icons.comment}</button>
        <button class="action" type="button" data-action="share" aria-label="Поделиться публикацией">${icons.share}</button>
        <button class="action save${post.saved ? " liked" : ""}" type="button" data-action="save" aria-label="${post.saved ? "Убрать из сохранённых" : "Сохранить"}" aria-pressed="${post.saved}">${icons.save}</button>
      </div>
      <div class="post-body">
        <div class="likes"><span>${post.likes}</span> отметок «Нравится»</div>
        <div class="caption"><strong>${escapeHtml(post.handle)}</strong> ${escapeHtml(post.text)}</div>
        <div class="tags">${post.tags.map(tag => `#${escapeHtml(tag)}`).join(" ")}</div>
        <button class="comments" type="button" data-action="comments">${commentsLabel}</button>
      </div>
    </article>`;
}

function renderFeed() {
  feed.innerHTML = posts.map(postTemplate).join("");
}

function renderComments() {
  const post = posts.find(item => item.id === activePostId);
  if (!post) return;
  document.querySelector("#commentsDialogTitle").textContent = `Комментарии · ${post.author}`;
  commentsList.innerHTML = post.comments.length
    ? post.comments.map(comment => `<article class="comment-item"><div class="avatar sm">${escapeHtml(comment.initials)}</div><div><strong>${escapeHtml(comment.author)}</strong><p>${escapeHtml(comment.text)}</p></div></article>`).join("")
    : '<div class="empty-comments"><b>Пока нет комментариев</b><span>Начните обсуждение первым.</span></div>';
}

function openPostDialog() {
  postDialog.showModal();
  setTimeout(() => document.querySelector("#postText").focus(), 0);
}

function openComments(postId) {
  activePostId = postId;
  renderComments();
  commentsDialog.showModal();
  setTimeout(() => document.querySelector("#commentText").focus(), 0);
}

feed.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const article = button.closest("[data-post-id]");
  const post = posts.find(item => item.id === Number(article.dataset.postId));
  if (!post) return;

  if (button.dataset.action === "like") {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    renderFeed();
    showToast(post.liked ? "Публикация понравилась" : "Отметка удалена");
  }
  if (button.dataset.action === "save") {
    post.saved = !post.saved;
    renderFeed();
    showToast(post.saved ? "Сохранено в закладки" : "Удалено из закладок");
  }
  if (button.dataset.action === "comments") openComments(post.id);
  if (button.dataset.action === "share") {
    const link = `${location.href.split("#")[0]}#post-${post.id}`;
    navigator.clipboard?.writeText(link)
      .then(() => showToast("Ссылка на публикацию скопирована"))
      .catch(() => showToast("Ссылка готова: скопируйте её из адресной строки"));
    history.replaceState(null, "", `#post-${post.id}`);
  }
});

postForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = document.querySelector("#postText").value.trim();
  const category = document.querySelector("#postCategory").value;
  const rawImage = document.querySelector("#postImage").value.trim();
  const image = safeImageUrl(rawImage);
  if (rawImage && !image) {
    showToast("Укажите корректную ссылку на изображение");
    return;
  }

  posts.unshift({
    id: Date.now(),
    author: currentUser.name,
    handle: currentUser.handle,
    initials: currentUser.initials,
    university: currentUser.university,
    time: "только что",
    category,
    text,
    tags: category === "Проекты" ? ["НовыйПроект", "ЕАГИ"] : [category.replaceAll(" ", ""), "ЕАГИ"],
    image,
    likes: 0,
    liked: false,
    saved: false,
    comments: []
  });
  postForm.reset();
  postDialog.close();
  renderFeed();
  feed.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Публикация добавлена в ленту");
});

commentForm.addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#commentText");
  const text = input.value.trim();
  const post = posts.find(item => item.id === activePostId);
  if (!post || !text) return;
  post.comments.push({ author: currentUser.name, initials: currentUser.initials, text });
  input.value = "";
  renderComments();
  renderFeed();
  showToast("Комментарий опубликован");
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => document.querySelector(`#${button.dataset.close}`).close());
});

document.querySelectorAll("dialog").forEach(dialog => {
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelectorAll("#createPost, #composer, .composer .quick").forEach(button => button.addEventListener("click", openPostDialog));

document.querySelectorAll("[data-page]").forEach(button => button.addEventListener("click", () => {
  const group = button.closest("nav");
  group.querySelectorAll("[data-page]").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  showToast(button.dataset.page === "Главная" ? "Вы уже на главной" : `${button.dataset.page} — следующий экран продукта`);
}));

document.querySelectorAll(".suggestion button").forEach(button => button.addEventListener("click", () => {
  button.classList.toggle("followed");
  button.textContent = button.classList.contains("followed") ? "Вы подписаны" : "Подписаться";
}));

document.querySelectorAll(".story").forEach(button => button.addEventListener("click", () => showToast("Истории появятся в следующей версии")));
document.querySelector("#viewTeam").addEventListener("click", () => showToast("Открываем AI-подбор команды"));

renderFeed();
