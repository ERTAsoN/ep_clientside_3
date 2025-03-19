new Vue({
    el: '#app',
    data: {
        newCardTitle: '',
        newCardDescription: '',
        newCardDeadline: '',
        editedCardTitle: '',
        editedCardDescription: '',
        editedCardDeadline: '',
        editedCardIndex: null,
        editedCardColumn: '',
        firstColumn: [],
        secondColumn: [],
        thirdColumn: [],
        fourthColumn: [],
    },
    methods: {
        moveCardProcessor(index, column, columnTo) {
            if (column === 'firstColumn' && column === 'secondColumn') {
                this.moveCard(index, column, columnTo);
            }

            this.saveDataToLocalStorage();
        },
        moveCard(index, fromColumn, toColumn) {
            const card = this[fromColumn].splice(index, 1)[0];
            this[toColumn].push(card);
        },
        addCard() {
            if (!this.newCardTitle) {
                alert('Заполните название задачи');
                return;
            }

            if (!this.newCardDescription) {
                alert('Заполните описание задачи');
                return;
            }

            if (!this.newCardDeadline) {
                alert('Заполните дедлайн задачи')
                return;
            }

            const newCard = {
                id: Date.now(),
                creationDate: new Date().toLocaleString(),
                title: this.newCardTitle,
                description: this.newCardDescription,
                deadline: new Date(this.newCardDeadline),
            };

            this.firstColumn.push(newCard);

            this.closeModal('addCardModal');

            this.saveDataToLocalStorage();

            this.newCardTitle = '';
            this.newCardDescription = '';
            this.newCardDeadline = '';
        },
        deleteCard(index, column) {
            this[column].splice(index, 1);
            this.saveDataToLocalStorage();
        },
        saveDataToLocalStorage() {
            const data = {
                firstColumn: this.firstColumn.map(card => ({
                    ...card,
                    deadline: card.deadline.toISOString(),
                })),
                secondColumn: this.secondColumn.map(card => ({
                    ...card,
                    deadline: card.deadline.toISOString(),
                })),
                thirdColumn: this.thirdColumn.map(card => ({
                    ...card,
                    deadline: card.deadline.toISOString(),
                })),
                fourthColumn: this.fourthColumn.map(card => ({
                    ...card,
                    deadline: card.deadline.toISOString(),
                })),
            };

            localStorage.setItem('boardData', JSON.stringify(data));
        },
        loadDataFromLocalStorage() {
            const storedData = localStorage.getItem('boardData');
            if (storedData) {
                const data = JSON.parse(storedData);
                this.firstColumn = data.firstColumn.map(card => ({
                    ...card,
                    deadline: new Date(card.deadline),
                }));
                this.secondColumn = data.secondColumn.map(card => ({
                    ...card,
                    deadline: new Date(card.deadline),
                }));
                this.thirdColumn = data.thirdColumn.map(card => ({
                    ...card,
                    deadline: new Date(card.deadline),
                }));
                this.fourthColumn = data.fourthColumn.map(card => ({
                    ...card,
                    deadline: new Date(card.deadline),
                }));
            }
        },
        clearAllData() {
            this.firstColumn = [];
            this.secondColumn = [];
            this.thirdColumn = [];
            this.fourthColumn = [];
            localStorage.removeItem('boardData');
        },
        openModal(modalName) {
            document.getElementById(modalName).style.display = 'block';
        },
        closeModal(modalName) {
            document.getElementById(modalName).style.display = 'none';
        },
        openEditModal(index, column) {
            this.editedCardIndex = index;
            this.editedCardColumn = column;

            const card = this[column][index];
            this.editedCardTitle = card.title;
            this.editedCardDescription = card.description;
            this.editedCardDeadline = card.deadline;

            this.openModal('editCardModal');
        },
        saveEditedCard() {
            const column = this.editedCardColumn;
            const index = this.editedCardIndex;

            this[column][index].title = this.editedCardTitle;
            this[column][index].description = this.editedCardDescription;
            this[column][index].deadline = new Date(this.editedCardDeadline);
            this[column][index].lastEditedTime = new Date().toLocaleString();

            this.saveDataToLocalStorage();

            this.closeModal('editCardModal');
        }
    },
    mounted() {
        this.loadDataFromLocalStorage();
    }
});
