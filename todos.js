const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');

let todos = [];
let id = 0;


// 할일 추가하기
const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos =  () => {
    return todos;
}

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


// html에 추가된 할 일 그리기
const paintTodos = () => {
    todoListElem.innerHTML = null; // todoListElem html 초기화
    const allTodos = getAllTodos(); // todos배열

    // "todo-item"에 해당 html을 그려 리스트에 추가
    /*          <li class="todo-item checked">
                    <div class="checkbox">✔</div>
                    <div class="todo">todo.content</div>
                    <button class="delBtn">X</button>
                </li>
    */
   //numbers.forEach(A => fucn(A));
    allTodos.forEach(todo => {
        const todoItemElem = document.createElement('li');
        todoItemElem.classList.add('todo-item');

        const checkboxElem = document.createElement('div');
        checkboxElem.classList.add('checkbox');

        const todoElem = document.createElement('div');
        todoElem.classList.add('todo');
        todoElem.innerText = todo.content;

        const delBtnElem = document.createElement('button');
        delBtnElem.classList.add('delBtn');
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
    todoInputElem.addEventListener('keypress', (e) =>{
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); e.target.value ='';
            //todoInputElem.value = ''; 할때 text칸이 비워지지 않음
        }
    })
}

init()