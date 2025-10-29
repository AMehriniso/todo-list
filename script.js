document.addEventListener('DOMContentLoaded', function () {
	var body = document.body;
	body.className = 'page';

	var main = document.createElement('div');
	main.className = 'container';
	body.appendChild(main);

	var header = document.createElement('header');
	header.className = 'header';
	var logo = document.createElement('img');
	logo.src = 'icons/calendar.png';
	logo.alt = 'Логотип';
	logo.className = 'logo';
	var h1 = document.createElement('h1');
	h1.textContent = 'Now or Later';
	header.appendChild(logo);
	header.appendChild(h1);
	main.appendChild(header);

	var addSection = document.createElement('section');
	addSection.className = 'card add-card';
	var addTitle = document.createElement('h2');
	addTitle.textContent = 'Добавить задачу';
	addSection.appendChild(addTitle);

	var form = document.createElement('form');
	form.className = 'add-form';

	var row1 = document.createElement('div');
	row1.className = 'add-row';
	var taskInput = document.createElement('input');
	taskInput.type = 'text';
	taskInput.placeholder = 'Введите задачу...';
	taskInput.required = true;
	taskInput.className = 'input wide';
	row1.appendChild(taskInput);

	var row2 = document.createElement('div');
	row2.className = 'add-row second-row';
	var dateInput = document.createElement('input');
	dateInput.type = 'date';
	dateInput.className = 'input short';
	var impLabel = document.createElement('label');
	impLabel.className = 'important-label';
	var impCheck = document.createElement('input');
	impCheck.type = 'checkbox';
	var impText = document.createElement('span');
	impText.textContent = 'Важно';
	impLabel.appendChild(impCheck);
	impLabel.appendChild(impText);
	row2.appendChild(dateInput);
	row2.appendChild(impLabel);

	var row3 = document.createElement('div');
	row3.className = 'add-row center-row';
	var addBtn = document.createElement('button');
	addBtn.type = 'submit';
	addBtn.className = 'btn';
	addBtn.textContent = 'Добавить';
	row3.appendChild(addBtn);

	form.appendChild(row1);
	form.appendChild(row2);
	form.appendChild(row3);
	addSection.appendChild(form);
	main.appendChild(addSection);

	var ctrl = document.createElement('section');
	ctrl.className = 'card controls';
	var topControls = document.createElement('div');
	topControls.className = 'upper-controls';

	var filterBox = document.createElement('div');
	var filterLabel = document.createElement('label');
	filterLabel.textContent = 'Фильтр:';
	var filterSel = document.createElement('select');
	filterSel.className = 'select short';
	[
		{ v: 'all', t: 'Все' },
		{ v: 'active', t: 'Активные' },
		{ v: 'completed', t: 'Выполненные' },
		{ v: 'important', t: 'Важные' },
	].forEach(o => {
		let opt = document.createElement('option');
		opt.value = o.v;
		opt.textContent = o.t;
		filterSel.appendChild(opt);
	});
	filterBox.appendChild(filterLabel);
	filterBox.appendChild(filterSel);

	var sortBox = document.createElement('div');
	var sortLabel = document.createElement('label');
	sortLabel.textContent = 'Сортировка:';
	var sortSel = document.createElement('select');
	sortSel.className = 'select short';
	[
		{ v: 'added-desc', t: 'По добавлению' },
		{ v: 'date-asc', t: 'По дате (близость)' },
		{ v: 'name-asc', t: 'По названию (A–Я)' },
	].forEach(o => {
		let opt = document.createElement('option');
		opt.value = o.v;
		opt.textContent = o.t;
		sortSel.appendChild(opt);
	});
	sortSel.value = 'added-desc';
	sortBox.appendChild(sortLabel);
	sortBox.appendChild(sortSel);

	topControls.appendChild(filterBox);
	topControls.appendChild(sortBox);

	var searchBox = document.createElement('div');
	searchBox.className = 'search-box';
	var searchIcon = document.createElement('img');
	searchIcon.src = 'icons/search.png';
	searchIcon.className = 'icon';
	var searchInput = document.createElement('input');
	searchInput.type = 'text';
	searchInput.placeholder = 'Поиск...';
	searchInput.className = 'input short';
	searchBox.appendChild(searchIcon);
	searchBox.appendChild(searchInput);
	ctrl.appendChild(topControls);
	ctrl.appendChild(searchBox);
	main.appendChild(ctrl);

	var listSection = document.createElement('section');
	listSection.className = 'card';
	var ul = document.createElement('ul');
	ul.className = 'task-list';
	listSection.appendChild(ul);
	main.appendChild(listSection);

	var footer = document.createElement('footer');
	footer.className = 'footer';
	var contacts = document.createElement('div');
	contacts.className = 'contacts';
	contacts.textContent = 'Контакты: m.azatjonova@yandex.ru | +7 (920) 860-50-65';
	var rights = document.createElement('div');
	rights.className = 'rights';
	rights.textContent = '© 2025 Now or Later. Все права защищены.';
	footer.appendChild(contacts);
	footer.appendChild(rights);
	body.appendChild(footer);

	var tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
	function saveTasks() {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	function sortByDate(a, b) {
		if (!a.date && !b.date) return 0;
		if (!a.date) return 1;
		if (!b.date) return -1;
		return new Date(a.date) - new Date(b.date);
	}

	function renderTasks() {
		while (ul.firstChild) {
  			ul.removeChild(ul.firstChild);
		}
		let shown = tasks.slice();

		if (filterSel.value === 'active') shown = shown.filter(t => !t.completed);
		else if (filterSel.value === 'completed') shown = shown.filter(t => t.completed);
		else if (filterSel.value === 'important') shown = shown.filter(t => t.important);

		let q = searchInput.value.trim().toLowerCase();
		if (q) shown = shown.filter(t => t.text.toLowerCase().includes(q));

		if (sortSel.value === 'added-desc') shown.sort((a, b) => b.id - a.id);
		else if (sortSel.value === 'date-asc') shown.sort(sortByDate);
		else if (sortSel.value === 'name-asc') shown.sort((a, b) => a.text.localeCompare(b.text));

		if (shown.length === 0) {
			let empty = document.createElement('li');
			empty.className = 'empty';
			empty.textContent = 'Задач нет. Добавьте первую!';
			ul.appendChild(empty);
			return;
		}

		shown.forEach(task => {
			let li = document.createElement('li');
			li.className = 'task-item';
			if (task.completed) li.classList.add('completed');
			if (task.important) li.classList.add('important');
			li.draggable = true;
			li.dataset.id = task.id;

			let left = document.createElement('div');
			left.className = 'task-left';
			let cb = document.createElement('input');
			cb.type = 'checkbox';
			cb.checked = task.completed;
			cb.addEventListener('change', function () {
				task.completed = cb.checked;
				saveTasks();
				renderTasks();
			});
			let content = document.createElement('div');
			content.className = 'task-content';
			let text = document.createElement('div');
			text.className = 'task-text';
			text.textContent = task.text;
			let date = document.createElement('div');
			date.className = 'task-date';
			date.textContent = task.date || '';
			content.appendChild(text);
			content.appendChild(date);
			left.appendChild(cb);
			left.appendChild(content);

			let right = document.createElement('div');
			right.className = 'task-right';
			let editBtn = document.createElement('button');
			editBtn.className = 'icon-btn';
			let editImg = document.createElement('img');
			editImg.src = 'icons/edit.png';
			editImg.className = 'icon';
			editBtn.appendChild(editImg);
			let delBtn = document.createElement('button');
			delBtn.className = 'icon-btn';
			let delImg = document.createElement('img');
			delImg.src = 'icons/delete.png';
			delImg.className = 'icon';
			delBtn.appendChild(delImg);
			right.appendChild(editBtn);
			right.appendChild(delBtn);

			li.appendChild(left);
			li.appendChild(right);
			ul.appendChild(li);

			editBtn.addEventListener('click', function () {
				while (li.firstChild) li.removeChild(li.firstChild);
				
				const editForm = document.createElement('form');
				editForm.className = 'edit-wrap';

				const textEdit = document.createElement('input');
				textEdit.type = 'text';
				textEdit.value = task.text;
				textEdit.required = true;
				textEdit.className = 'input wide';

				const dateEdit = document.createElement('input');
				dateEdit.type = 'date';
				dateEdit.value = task.date || '';
				dateEdit.className = 'input short';

				const impEdit = document.createElement('label');
				impEdit.className = 'important-label';
				const impEditCheck = document.createElement('input');
				impEditCheck.type = 'checkbox';
				impEditCheck.checked = task.important;
				const impEditText = document.createElement('span');
				impEditText.textContent = 'Важно';
				impEdit.appendChild(impEditCheck);
				impEdit.appendChild(impEditText);

				const saveBtn = document.createElement('button');
				saveBtn.type = 'submit';
				saveBtn.className = 'btn';
				saveBtn.textContent = 'Сохранить';

				const cancelBtn = document.createElement('button');
				cancelBtn.type = 'button';
				cancelBtn.className = 'btn cancel';
				cancelBtn.textContent = 'Отмена';

				editForm.append(textEdit, dateEdit, impEdit, saveBtn, cancelBtn);
				li.appendChild(editForm);

				editForm.addEventListener('submit', function (e) {
					e.preventDefault();
					task.text = textEdit.value.trim();
					task.date = dateEdit.value;
					task.important = impEditCheck.checked;
					saveTasks();
					renderTasks();
				});
				cancelBtn.addEventListener('click', renderTasks);
			});

			delBtn.addEventListener('click', function () {
				tasks = tasks.filter(t => t.id !== task.id);
				saveTasks();
				renderTasks();
			});

			li.addEventListener('dragstart', function () {
				li.classList.add('dragging');
			});
			li.addEventListener('dragend', function () {
				li.classList.remove('dragging');
				const order = Array.from(ul.children).map(el => Number(el.dataset.id));
				tasks = order.map(id => tasks.find(t => t.id === id)).filter(Boolean);
				saveTasks();
			});
		});
	}

	ul.addEventListener('dragover', function (e) {
		e.preventDefault();
		let dragging = document.querySelector('.dragging');
		if (!dragging) return;
		let after = Array.from(ul.children).find(li => {
			if (li === dragging) return false;
			let rect = li.getBoundingClientRect();
			return e.clientY < rect.top + rect.height / 2;
		});
		if (after) ul.insertBefore(dragging, after);
		else ul.appendChild(dragging);
	});

	let draggedEl = null;
	let startY = 0;
	let startIndex = null;
	
	ul.addEventListener('touchstart', function (e) {
		if (e.target.closest('button, input, label')) return;
		const li = e.target.closest('.task-item');
		if (!li) return;
	
		draggedEl = li;
		startY = e.touches[0].clientY;
		startIndex = Array.from(ul.children).indexOf(li);
		li.classList.add('dragging');
	});
	
	ul.addEventListener('touchmove', function (e) {
		if (!draggedEl) return;
		e.preventDefault();
	
		const touchY = e.touches[0].clientY;
		const afterElement = Array.from(ul.children).find(li => {
			if (li === draggedEl) return false;
			const rect = li.getBoundingClientRect();
			return touchY < rect.top + rect.height / 2;
		});
	
		if (afterElement) {
			ul.insertBefore(draggedEl, afterElement);
		} else {
			ul.appendChild(draggedEl);
		}
	});
	
	ul.addEventListener('touchend', function () {
		if (!draggedEl) return;
	
		draggedEl.classList.remove('dragging');
	
		const newOrder = Array.from(ul.children)
			.map(el => Number(el.dataset.id))
			.filter(Boolean);
	
		const reordered = [];
		newOrder.forEach(id => {
			const found = tasks.find(t => t.id === id);
			if (found) reordered.push(found);
		});
	
		if (reordered.length === tasks.length) {
			tasks = reordered;
			saveTasks();
		}
	
		draggedEl = null;
		startY = 0;
		startIndex = null;
	});
	
	form.addEventListener('submit', function (e) {
		e.preventDefault();
		let t = taskInput.value.trim();
		if (!t) return;
		let newTask = {
			id: Date.now(),
			text: t,
			date: dateInput.value,
			important: impCheck.checked,
			completed: false,
		};
		tasks.push(newTask);
		saveTasks();
		taskInput.value = '';
		dateInput.value = '';
		impCheck.checked = false;
		renderTasks();
	});

	filterSel.addEventListener('change', renderTasks);
	sortSel.addEventListener('change', renderTasks);
	searchInput.addEventListener('input', renderTasks);

	renderTasks();
});


