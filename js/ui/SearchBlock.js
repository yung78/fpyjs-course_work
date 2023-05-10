/**
 * Используется для взаимодействием со строкой ввода и поиска изображений
 */
class SearchBlock {
  constructor(element) {
    this.element = element;
    this.registerEvents();
  };
  
  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    let btnAdd = document.querySelector(".ui.primary.button.add");
    let btnReplace = document.querySelector(".ui.primary.button.replace");
    let input = btnReplace.previousElementSibling;
    let data = [];

    btnAdd.addEventListener("click", () => {
      let id = input.value.trim();
      if (id) {
        VK.get(input.value.trim(), (result) => {
          for ( let el of result ) {
            App.imageViewer.drawImages(el);
          };

          App.imageViewer.checkButtonText()
        });
      } else {return alert("Поле ввода не заполнено")};
    });

    btnReplace.addEventListener("click", () => {
      if (input.value.trim()) {
        VK.get(input.value.trim(), (result) => {
          App.imageViewer.clear();
          
          for ( let el of result ) {
            App.imageViewer.drawImages(el);
          };

          App.imageViewer.checkButtonText()
        });
      } else {return alert("Поле ввода не заполнено")};
    });
  };
};
