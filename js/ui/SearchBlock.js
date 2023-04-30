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
        VK.get(input.value.trim(), (result) => data = result);

        setTimeout(() => {        // не разобрался как на промисах сделать методы с аргументами и колбеками, сделал с таймаутом 
          for (let el of data) {  // буду рад подсказке или примерному наброску скелета в комментариях при отправке на доработку)))

            App.imageViewer.drawImages(el);
          };

          App.imageViewer.checkButtonText()
        }, 250);
      } else {return alert("Поле ввода не заполнено")};
    });

    btnReplace.addEventListener("click", () => {
      if (input.value.trim()) {
        VK.get(input.value.trim(), (result) => data = result);
        
        setTimeout(() => {      // то же самое)
          App.imageViewer.clear();
          
          for (let el of data) {
            App.imageViewer.drawImages(el);
          };

          App.imageViewer.checkButtonText()
        }, 250);
      } else {return alert("Поле ввода не заполнено")};
    });
  };
};
