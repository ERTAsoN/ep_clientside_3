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
        cardToWorkReason: '',
        deadlineLock: false,
        firstColumn: [],
        secondColumn: [],
        thirdColumn: [],
        fourthColumn: [],
    },
    methods: {
        moveCardProcessor(index, column, columnTo) {
            this.card = this[column][index];

            if (column === 'firstColumn' && columnTo === 'secondColumn') {
                this.moveCard(index, column, columnTo);
            }
            else if (column === 'secondColumn' && columnTo === 'thirdColumn') {
                this.moveCard(index, column, columnTo);
            }
            else if (column === 'thirdColumn' && columnTo === 'fourthColumn') {
                if (this.card.deadline < new Date()) this.card.isOverdue = true;
                this.moveCard(index, column, columnTo);
            }
            else if (column === 'thirdColumn' && columnTo === 'secondColumn') {
                this.editedCardIndex = index;
                this.openModal('cardToWorkModal');
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
                isOverdue: false,
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

            this.card = this[column][index];

            this.card.title = this.editedCardTitle;
            this.card.description = this.editedCardDescription;
            this.card.deadline = new Date(this.editedCardDeadline);
            this.card.lastEditedTime = new Date().toLocaleString();

            this.saveDataToLocalStorage();

            this.closeModal('editCardModal');
        },
        saveToWorkReason() {
            const column = 'thirdColumn';
            const index = this.editedCardIndex;

            this.card = this[column][index];

            if (!this.cardToWorkReason)
            {
                alert("Заполните причину перемещения задачи");
                return;
            }

            this.card.cardToWorkReason = this.cardToWorkReason;
            this.cardToWorkReason = '';

            this.moveCard(index, 'thirdColumn', 'secondColumn');

            this.saveDataToLocalStorage();

            this.closeModal('cardToWorkModal');
        },
        checkCloseDeadline(deadline) {
            const differenceInMs = deadline - new Date();
            const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

            return differenceInDays < 2;
        },
        checkDeadlineLock() {
            let deadlineLock = false;

            for(const card of this.firstColumn) {
                if (this.checkCloseDeadline(card.deadline)) {
                    deadlineLock = true;
                }
            }
            for(const card of this.secondColumn) {
                if (this.checkCloseDeadline(card.deadline)) {
                    deadlineLock = true;
                }
            }
            for(const card of this.thirdColumn) {
                if (this.checkCloseDeadline(card.deadline)) {
                    deadlineLock = true;
                }
            }

            this.deadlineLock = deadlineLock;
        }
    },
    mounted() {
        this.loadDataFromLocalStorage();
    }
});
