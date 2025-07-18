// 手风琴折叠展开功能
 document.addEventListener('DOMContentLoaded', function() {
     const accordionHeaders = document.querySelectorAll('.accordion-header');

     // 默认展开第一个面板
     if (accordionHeaders.length > 0) {
         accordionHeaders[0].classList.add('active');
         const firstContent = accordionHeaders[0].nextElementSibling;
         if (firstContent) {
             firstContent.classList.add('active');
         }
     }

     accordionHeaders.forEach(header => {
         header.addEventListener('click', function() {
             // 切换当前面板状态
             const isActive = this.classList.contains('active');
             const content = this.nextElementSibling;

             // 关闭所有面板
             accordionHeaders.forEach(h => {
                 h.classList.remove('active');
                 const c = h.nextElementSibling;
                 if (c) c.classList.remove('active');
             });

             // 如果当前面板不是激活状态，则激活它
             if (!isActive) {
                 this.classList.add('active');
                 if (content) content.classList.add('active');
             }
         });
     });
 });