class App {
	constructor() {		
		this.nameIn = document.querySelector(".input input[type='text']")
		this.anzahlIn = document.querySelector(".input input[type='number']")
		this.tableOut = document.querySelector(".todos table")

		this.nameIn.addEventListener("keydown", this.nameEnter.bind(this));
		this.anzahlIn.addEventListener("keydown", this.anzahlEnter.bind(this));
		this.tableOut.addEventListener("click", this.listClick.bind(this));

		this.key = "todo.js";

		this.todos = this.load();
		this.render()
	}

	nameEnter(event) {
		if (event.key !== "Enter") return;

		const { value  } = this.nameIn;
		if (value.length) {
			this.anzahlIn.focus();
		}
	}

	anzahlEnter(event) {
		if (event.key !== "Enter") return;

		if (!this.nameIn.value.length) {
			this.nameIn.focus();
			return;
		}

		if (!this.anzahlIn.value.length) {
			return;
		}

		const name = this.nameIn.value;
		const anzahl = parseInt(this.anzahlIn.value, 10);
		this.nameIn.value = "";
		this.anzahlIn.value = 0;
		this.addTodo({ name, anzahl });
	}

	listClick(event) {
		if (!event.target) return;

		const { target } = event;

		switch (target.nodeName) {
			case "TD":
				const index = parseInt(target.parentNode.attributes.key.value, 10);
				this.removeTodo(index);
				break;
			case "INPUT":
				const key = target.parentNode.parentNode.attributes.key.value;
				switch (target.attributes.action.value) {
					case "inc":
						this.todos[key].anzahl++;
						this.render();
						break;
					case "dec":
						this.todos[key].anzahl--;
						this.render();
						break;
				}
				break;
		}
	}

	addTodo(todo) {
		this.todos.push(todo);
		this.render();
	}

	removeTodo(todoOrIdx) {
		let idx;
		switch (typeof todoOrIdx) {
			case "number":
				idx = todoOrIdx;
				break;
			case "object":
				idx = this.todos.indexOf(todoOrIdx);
				break;
			default:
				throw new Error("wtf? you want to remove a todo with that?");
		}
		this.todos.splice(idx, 1);
		this.render();
	}

	save() {
		console.log("saving todos under ", this.key);
		localStorage.setItem(this.key, JSON.stringify(this.todos || []));
	}

	load() {
		return JSON.parse(localStorage.getItem(this.key) || "[]");
	}


	render() {
		this.save();

		let renderedTodos = this.todos.reduce((out, todo, idx) => {
			return out + renderTodo(idx, todo);
		}, "");

		this.tableOut.innerHTML = renderedTodos;
	}
}

function renderTodo(idx, todo) {
	let { name, anzahl } = todo;
	return (
		`<tr key='${idx}' anzahl='${anzahl}'>` +
			`<td>${name}</td>` +
			`<td><input type='button' action='inc' value='+' /></td>` +
			`<td>${anzahl}</td>` +
			`<td><input type='button' action='dec' value='-' /></td>` +
		`</tr>`
	);
}

let app;
function init() {
	registerServiceWorker();
	app = new App();
}

function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		if (navigator.serviceWorker.controller != null) {
			console.log("serviceworker already loaded");
			return;
		}

		navigator.serviceWorker
			.register("service-worker.js")
			.then(() => {
				console.dir(navigator.serviceWorker);
				console.log("offline support");
			});
	} else {
		console.log("no offline support =(");
	}
}

document.addEventListener("DOMContentLoaded", init);