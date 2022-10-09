const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');
// 전체 투두 체크 엘리먼트
const completeAllBtnElem = document.querySelector('.complete-all-btn');
// 남은할일 개수 표시
const leftItemsElem = document.querySelector('.left-items');

const showAllBtnElem = document.querySelector('.show-all-btn selected');    // 전체 투두리스트
const showActiveBtnElem = document.querySelector('.show-active-btn');   // 완료되지 않은 리스트
const showCompletedBtnElem = document.querySelector('.show-completed-btn'); // 완료된 리스트
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn');   // 완료된거 삭제

// 완료되지 않은 할 일 리스트반환
const getActiveTodos = () => {
    return todos.filter(todo => todo.isCompleted === false);
}

const setLeftItems = () => {
    const leftTodos = getActiveTodos().length;
    leftItemsElem.innerHTML = `${leftTodos} items left`;
}

let todos = [];
let id = 0;

// 
let currentShowType = 'all';    // all or active or complet
const setCurrentShowType = (newShowType) => currentShowType = newShowType;

const onClickShowTodosType = (e) => {
    const currentBtnElem = e.target;
    const newShowType = currentBtnElem.dataset.type;
    if (currentShowType === newShowType) return;

    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem.classList.remove('selected');

    currentBtnElem.classList.add('selected');
    setCurrentShowType(newShowType);

    paintTodos();
}

// 할일 추가하기
// todos 초기화
const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos =  () => {
    return todos;
}

// * 전체표시 구현
let isAllCompleted = false; // 초기 전체 투두체크여부

const setIsAllCompleted = (bool) => { isAllCompleted = bool };

const completeAll = () => {
    completeAllBtnElem.classList.add('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true}));
    setTodos(newTodos);
}
const incompleteAll = () => {
    completeAllBtnElem.classList.remove('checked');
    // map 아마도 있으면 변경 없으면 추가?
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: false}));
    setTodos(newTodos);
}

// 전체 check여부
const checkIsAllCompleted = () => {
    if(getAllTodos.length === getCompletedTodos().length ){
        setIsAllCompleted(true);
        completeAllBtnElem.classList.add('checked');
    }else{
        setIsAllCompleted(false);
        completeAllBtnElem.classList.remove('checked');
    }
}

const onClickCompleteAll = () => {
    if(!getAllTodos().length) return;   // 투두배열 길이가 0이면 리턴
    if(isAllCompleted) {incompleteAll();
    } else {completeAll();}
    setIsAllCompleted(!isAllCompleted); // isAllCompleted 토글
    paintTodos();   // 새로운 todos렌더링
    setLeftItems(); // 남은 할 일 개수 표시
}

const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true);
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
    checkIsAllCompleted();  // 전체 투두완료상태 파악후 전체완료 처리버튼 css 반영
    setLeftItems(); // 남은할 일 개수 표시
    paintTodos();
}


// 삭제 이벤트 처리 함수
const deleteTodo = (todoId) => {
    // filter() 배열에서 조건에 맞춰 찾기
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId);
    setTodos(newTodos); 
    setLeftItems();
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
    setLeftItems();
    checkIsAllCompleted();  // 전체 투두완료상태 파악후 전체완료 처리버튼 css 반영
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

    inputElem.addEventListener('keypress', (e) => {
        if(e.key === 'Enter'){
            updateTodo(e.target.value, todoId);
            document.body.removeEventListener('click', onBodyClick);
        }
    })

    const onBodyClick = (e) => {
        if(e.target !== inputElem) {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener('click', onBodyClick);
        }
    }
    document.body.addEventListener('click', onBodyClick);
    todoItemElem.appendChild(inputElem);
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
    
    showAllBtnElem.addEventListener('click', onClickShowTodosType);
    showActiveBtnElem.addEventListener('click', onClickShowTodosType);
    showCompletedBtnElem.addEventListener('click', onClickShowTodosType);
    clearCompletedBtnElem.addEventListener('click', clearComplietedTodos);

    completeAllBtnElem.addEventListener('click', onClickCompleteAll); // 전체완료 클릭 이벤트 리스너
    setLeftItems();
}

init();