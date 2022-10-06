const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');

let todos = [];
let id = 0;


// 할일 추가하기

// todos 초기화
const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos =  () => {
    return todos;
}

// todos 렌더링함수
const appendTodos = (text) => {
    const newId = id++;
    /* concat(): 배열합치기
    var arr1 = new Array ("배열 1", "배열 2");
    var arr2 = new Array ("배열 3", "배열 4");
    var arr = arr1.concat(arr2);
    :   arr : 배열 1,배열 2,배열 3,배열 4
    */
    // 이전 todos배열을 가져와 새로운 todo와 합쳐 newTodos에 저장
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text});
    // 스프레드연산자 사용시
    // const newTodos = [...getAllTodos(), {id: newId, isCompleted: false, content: text }];
    setTodos(newTodos);
    paintTodos();
}
//

// 삭제 이벤트 처리 함수
const deleteTodo = (todoId) => {
    // filter() 배열에서 조건에 맞춰 찾기
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId);
    setTodos(newTodos);
    paintTodos();   // 삭제된 배열을 다시 렌더링
}


// 완료 처리 함수
const completeTodo = (todoId) => {
    // 삼항연산자 (조건문) ? true : false; 
    // true면, ...todo에 isCompleted: ! todo.isCompleted 반환
    const newTodos = getAllTodos().map(
        todo => todo.id === todoId ? {...todo, isCompleted: !todo.isCompleted} : todo)
    setTodos(newTodos);
    paintTodos();
}


// 수정
const onDbclickTodo = (e, todoId) => {
    const todoElem = e.target;
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');
    inputElem.value = inputText;
    // input이 원래 value를 가려지게 디자인
    inputElem.classList.add('edit-input');
    todoItemElem.appendChild(inputElem);

    inputElem.addEventListener('keypress', (e) =>{
        if(e.key === 'Enter'){
            updateTodo(e.target.value, todoId);
        }
    })
}

const updateTodo = (text, todoId) => {
    const newTodos = getAllTodos().map(todo => todoId === todo.id ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}



const paintTodos = () => {
    // html에 추가된 할 일 그리기
    todoListElem.innerHTML = null; // todoListElem html 초기화
    const allTodos = getAllTodos(); // todos배열

    // "todo-item"에 해당 html을 그려 리스트에 추가
    /*          <li class="todo-item checked" data-id="n">
                    <div class="checkbox">✔</div>
                    <div class="todo">todo.content</div>
                    <button class="delBtn">X</button>
                </li>
    */
   //numbers.forEach(A => fucn(A));
    allTodos.forEach(todo => {
        const todoItemElem = document.createElement('li');
        todoItemElem.classList.add('todo-item');

        todoItemElem.setAttribute('data-id', todo.id);

        const checkboxElem = document.createElement('div');
        checkboxElem.classList.add('checkbox');
        checkboxElem.addEventListener('click', () => completeTodo(todo.id));

        const todoElem = document.createElement('div');
        todoElem.classList.add('todo');
        // 더블클릭 이벤트
        todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todo.id))
        todoElem.innerText = todo.content;

        const delBtnElem = document.createElement('button');
        delBtnElem.classList.add('delBtn');
        // 할일 목록 삭제 이벤트 생성
        delBtnElem.addEventListener('click', () => deleteTodo(todo.id));
        delBtnElem.innerText = "X";

        if(todo.isCompleted){
            todoItemElem.classList.add('checked');
            checkboxElem.innerText = "✔";
        }

        todoItemElem.appendChild(checkboxElem);
        todoItemElem.appendChild(todoElem);
        todoItemElem.appendChild(delBtnElem);

        todoListElem.appendChild(todoItemElem);
    })
}




// keypress(입력)에 대한 이벤트 리스너 등록
//todos.js 실행시 바로 실행하는 함수
const init = () => {
    todoInputElem.addEventListener('keypress', (e) => {
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); e.target.value ='';
            //todoInputElem.value = ''; 할때 text칸이 비워지지 않음
        }
    })
}

init()