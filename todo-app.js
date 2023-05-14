(() => {
  // Список дел по умолчанию
  let listArray = [],
    listName = '';

  // Создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerText = title;
    return appTitle;
  }

  // Создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.innerText = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener('input', function() {
      if (input.value !== '') {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    })

    return {
      form,
      input,
      button,
    }
  }

  // Создаем и возвращаем список элементов
  function createTodoList() {
    const list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // Создаем и возвращаем элементы списка
  function createTodoItem(obj) {
    const item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.innerText = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.innerText = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.innerText = 'Удалить';

    if (obj.done == true) {
      item.classList.add('list-group-item-success');
    }

    // добавляем обработчик на кнопки
    doneButton.addEventListener('click', function() {
      item.classList.toggle('list-group-item-success');

      for (const listItem of listArray) {
        if (listItem.id == obj.id) {
          listItem.done = !listItem.done;
        }
      }
      saveList(listArray, listName); // сохранение данных при добавлении элемента списка
    });
    deleteButton.addEventListener('click', function() {
      if (confirm('Вы уверены?')) {
        item.remove();

        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) {
            listArray.splice(i, 1);
          }
        }
        saveList(listArray, listName); // сохранение данных при удалении элемента списка
      }
    });

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  // Создание уникального ID для элемента списка
  function getNewID(arr) {
    let max = 0;

    for (const item of arr) {
      if (item.id > max) {
        max = item.id;
      }
    }
    return max + 1;
  }

  // Сохранение данных в local storage
  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  // Создание независимого списка
  function createTodoApp(container, title = 'Список дел', keyName, defArray = []) {
  let todoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();

  listName = keyName;
  listArray = defArray;

  // const todoItems = [createTodoItem('Сходить за хлебом'), createTodoItem('Купить молоко')];

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);
  // todoList.append(todoItems[0].item);
  // todoList.append(todoItems[1].item);

  let localData = localStorage.getItem(listName);
  // проверка на пустоту (для пустого значения расшифровка не делается, иначе будет ошибка)
  if (localData !== null && localData !== '') {
    listArray = JSON.parse(localData);
  }

  for (const itemList of listArray) {
    let todoItem = createTodoItem(itemList);
    todoList.append(todoItem.item);
  }

  // браузер создает событие submit на форме, по нажатию на Enter или на кнопку создания дела
  todoItemForm.form.addEventListener('submit', function(e) {
    // эта строчка необходима, чтобы предотвратить стандартное действие браузера
    // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
    e.preventDefault();

    // игнорируем создание элемента, если пользователь ничего не ввел в поле
    if (!todoItemForm.input.value) {
      return;
    }

    // Генерация списка по умолчанию
    let newItem = {
      id: getNewID(listArray),
      name: todoItemForm.input.value,
      done: false
    };

    let todoItem = createTodoItem(newItem);

    listArray.push(newItem);

    saveList(listArray, listName);

    // создаем и добавляем в список новое дело с названием из поля для ввода
    todoList.append(todoItem.item);

    // деактивируем кнопку отправки
    todoItemForm.button.disabled = true;

    // обнуляем значение в поле, чтобы не пришлось стирать его вручную
    todoItemForm.input.value = '';
  });
  }

  // document.addEventListener('DOMContentLoaded', function() {
  //   createTodoApp(document.getElementById('my-todos'), 'Мои дела');
  //   createTodoApp(document.getElementById('mom-todos'), 'Дела мамы');
  //   createTodoApp(document.getElementById('dad-todos'), 'Дела папы');
  // });

  // регистрация функции в глобальном объекте window, чтобы получить доступ к функции из других скриптов
  window.createTodoApp = createTodoApp;
})();
