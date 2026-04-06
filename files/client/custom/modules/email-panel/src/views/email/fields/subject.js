define('email-panel:views/email/fields/subject', ['views/fields/varchar'], (Dep) => {
    return class extends Dep {

        listLinkTemplate = 'email/fields/subject/list-link'

        inlineEditDisabled = true

        data() {
            const isRead = (this.model.get('sentById') === this.getUser().id) || this.model.get('isRead');

            return {
                ...super.data(),
                isRead: isRead || !this.model.has('isRead'),
                isImportant: this.model.has('isImportant') && this.model.get('isImportant'),
                isReplied: this.model.has('isReplied') && this.model.get('isReplied'),
                inTrash: this.model.has('inTrash') && this.model.get('inTrash'),
            };
        }

        getValueForDisplay() {
            return this.model.get('name');
        }

        getAttributeList() {
            return ['name', 'subject', 'isRead', 'isImportant', 'inTrash'];
        }

        setup() {
            super.setup();

            this.listenTo(this.model, 'change', () => {
                if (this.mode === 'list' || this.mode === 'listLink') {
                    if (this.model.hasChanged('isRead') || this.model.hasChanged('isImportant')) {
                        this.reRender();
                    }
                }
            });
        }

        fetch() {
            const data = super.fetch();
            data.name = data.subject;

            return data;
        }
    };
});