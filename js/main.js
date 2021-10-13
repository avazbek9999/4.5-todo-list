//select DOM elements
const elForm = document.querySelector('.form');
const elInput = document.querySelector('.input');
const elList = document.querySelector('.list');
const elAllCount = document.querySelector('.all-count');
const elCompletedCount = document.querySelector('.complited-count');
const elUncompletedCount = document.querySelector('.uncomplited-count');
const elCountWrapper = document.querySelector('.count-wrapper');

const localTodos = JSON.parse(window.localStorage.getItem('todos'));

const todos = localTodos || [];

function updateTodos() {
    window.localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos(todos, elList);
}
//event delegation counts
elCountWrapper.addEventListener('click', (evt) => {
    if (evt.target.matches('.btn-all')) {
        renderTodos(todos, elList);
    }

    if (evt.target.matches('.btn-complited')) {
        const completedTodo = todos.filter(todo => todo.isCompleted===true);
        
        renderTodos(completedTodo, elList);
    }

    if (evt.target.matches('.btn-uncomplited')) {
        const unCompletedTodo = todos.filter(todo => todo.isCompleted===false);
        
        renderTodos(unCompletedTodo, elList);
    }
});

//render count
function renderCount(arr) {
    elAllCount.textContent = arr.length || 0;
    let completedCount = 0;
    arr.forEach(todo => {
        if (todo.isCompleted) {
            completedCount++
        }
    });

    elCompletedCount.textContent = completedCount;
    elUncompletedCount.textContent = arr.length - completedCount;
}

//event delegation delete btn and iscompleted=======================
elList.addEventListener('click', (evt) => {
    if (evt.target.matches('.list__item__btn')) {
        const todoId = Number(evt.target.dataset.todoId);

        const foundTodoIndex = todos.findIndex(todo => todo.id === todoId);

        todos.splice(foundTodoIndex, 1);//hozir ishlamaydi chunki qayta render qilmadik

        updateTodos()
    } else if (evt.target.matches('.list__item__input')) {
        const todoId = Number(evt.target.dataset.todoId);

        const foundTodo = todos.find(todo => todo.id === todoId);

        foundTodo.isCompleted = !foundTodo.isCompleted;

        updateTodos()
    }
})

// render todos
function renderTodos(arr, node) {
    node.innerHTML = null;

    arr.forEach(todo => {
        const newLi = document.createElement('li');
        const newCheckBox = document.createElement('input');
        const newParagrf = document.createElement('p');
        const newDeletBtn = document.createElement('button');
 
        newParagrf.textContent = todo.title;
        newDeletBtn.textContent = 'Delete';
        newCheckBox.type = 'checkbox';

        newLi.setAttribute('class', 'list__item');
        newCheckBox.setAttribute('class','list__item__input')
        newParagrf.setAttribute('class', 'list__item__paragrf');
        newDeletBtn.setAttribute('class', 'list__item__btn');
               
        newDeletBtn.dataset.todoId = todo.id;
        newCheckBox.dataset.todoId = todo.id;
        
        if (todo.isCompleted) {
            newCheckBox.checked = true;
            newParagrf.style.textDecoration = 'line-through ';
            newParagrf.style.color = '#fff ';
            newLi.style.backgroundColor = '#888 ';
        }

        newLi.appendChild(newCheckBox);
        newLi.appendChild(newParagrf);
        newLi.appendChild(newDeletBtn);
        node.appendChild(newLi);
    });
    renderCount(todos);//har render bo'lganda sanab turadi
}

//listen Event
elForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    
    const UserInput = elInput.value.trim();
    elInput.value = null;

    //early return 
    if (UserInput <= 0 ) {
        elInput.style.border = '2px solid red'
        return;
    } else {
        elInput.style.border = '2px solid green'   
    }

    const newTodo = {
        id: todos[todos.length - 1]?.id + 1 || 0,
        title: UserInput,
        isCompleted: false
    }
    todos.push(newTodo);
    
    updateTodos()
});

renderTodos(todos, elList);