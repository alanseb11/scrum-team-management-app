// script.js
const lists = document.querySelectorAll('.draggable-list');
let draggedItem = null;

lists.forEach(list => {
    list.addEventListener('dragstart', function (e) {
        if (e.target.tagName === 'LI') {
            draggedItem = e.target;
            setTimeout(() => {
                e.target.classList.add('dragging');
            }, 0);
        }
    });

    list.addEventListener('dragend', function (e) {
        if (e.target.tagName === 'LI') {
            setTimeout(() => {
                e.target.classList.remove('dragging');
                draggedItem = null;
            }, 0);
        }
    });

    list.addEventListener('dragover', function (e) {
        e.preventDefault(); // Prevent default to allow drop
        if (e.target.tagName === 'LI') {
            e.target.classList.add('over');
        }
    });

    list.addEventListener('dragleave', function (e) {
        if (e.target.tagName === 'LI') {
            e.target.classList.remove('over');
        }
    });

    list.addEventListener('drop', function (e) {
        e.preventDefault(); // Prevent default action (open as link for some elements)

        if (e.target.tagName === 'LI') {
            e.target.classList.remove('over');

            // Move dragged item to the dropped position
            if (draggedItem !== this) {
                let draggedIndex = [...this.parentNode.children].indexOf(draggedItem);
                let targetIndex = [...this.parentNode.children].indexOf(e.target);

                if (targetIndex > draggedIndex) {
                    this.insertBefore(draggedItem, e.target.nextSibling);
                } else {
                    this.insertBefore(draggedItem, e.target);
                }
            }
        }

        // If the drop happens on the list (not on an item), append the item at the end
        if (e.target === this && draggedItem !== null) {
            this.appendChild(draggedItem);
        }
    });
});
