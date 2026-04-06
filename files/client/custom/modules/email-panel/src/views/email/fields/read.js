define('email-panel:views/email/fields/read', ['views/fields/base'], (Dep) => {
    return class extends Dep {

        type = 'read'

        listTemplate = 'email-panel:fields/read'

        detailTemplate = 'email-panel:fields/read'

        inlineEditDisabled = true

        data() {
            return {
                isRead: this.model.get('isRead'),
            };
        }
    };
});