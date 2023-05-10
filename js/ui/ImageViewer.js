/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.element = element;
    this.preview = document.querySelector(".column.six.wide");
    this.container = document.querySelectorAll(".row")[2];
    this.selectAll = document.querySelector(".select-all");
    this.send = document.querySelector(".send");
    this.show = document.querySelector(".show-uploaded-files");
    this.registerEvents();
  };

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    //Двойной клик по изображению
    this.container.addEventListener("dblclick", (e) => {
      e.preventDefault();

      if (e.target.tagName == "IMG") {
        this.preview.querySelector("img").src = e.target.src;
      };
    });

    //Одинарный клик по изображению
    this.container.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.tagName == "IMG") {
        e.target.className == "selected" ? e.target.className = "" :  e.target.className = "selected";

        this.checkButtonText();
      };
    });

    //Клик по кнопке "Выделить все"
    this.selectAll.addEventListener("click", (e) => {
      let allImages = document.querySelectorAll(".four.wide.column.ui.medium.image-wrapper");
      let selected = document.getElementsByClassName("selected")
      e.preventDefault();

      if (this.selectAll.className == "ui primary button select-all") {
        if (selected.length) {
          for (let el of allImages) {
            el.firstElementChild.className = "";
          };
        } else {
          for (let el of allImages) {
            el.firstElementChild.className = "selected";
          };
        };
      };
      this.checkButtonText();
    });

    //Клик по кнопке "Просмотреть..."
    this.show.addEventListener("click", () => {
      let previwer = App.getModal("filePreviewer");
      let data;

      let callback = (response) => {
        console.log(response)
        console.log(response.target.status);
        data = response.currentTarget.response.items.reverse();
        previwer.showImages(data);

        previwer.content.firstElementChild.remove();
      };
      
      // Получаем информацию по всем файлам папки Yandex.folderName
      Yandex.getUploadedFiles(callback);
      previwer.open();
    });

    //Клик по кнопке "Отправить на диск"
    this.send.addEventListener("click", () => {
      let sendImages = document.getElementsByClassName("selected");
      let uploader = App.getModal("fileUploader");
      uploader.open();

      for (let el of sendImages) {
        uploader.showImages( uploader.getImageHTML({
          url: el.src,
          id: el.getAttribute("data-id"),
        }));
      };

      // Запрос токена(запись в localStorage)
      Yandex.getToken(); 
    });
  };

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.container.innerHTML = "";
  };

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    let forShow = document.createElement("div");
    forShow.className = "four wide column ui medium image-wrapper";
    forShow.innerHTML = `<img src='${images.url}' data-id=${images.id} data-date=${images.date}г. />`;
    this.container.style.border = "2px solid blue";
    this.container.style.borderRadius = "10px";
    this.container.appendChild(forShow);
    
  };

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
    let allImages = document.getElementsByClassName("four wide column ui medium image-wrapper");

    if (allImages.length) {
      this.selectAll.className = "ui primary button select-all";
    };
    
    if (document.getElementsByClassName("selected").length == allImages.length) {
      this.selectAll.textContent = "Снять выделение";
    } else {
      this.selectAll.textContent = "Выбрать всё";
    };
    
    if (document.getElementsByClassName("selected").length) {
      this.send.className = "ui primary button send";
    } else {
      this.send.className = "ui primary disabled button send";
    };
  };
};