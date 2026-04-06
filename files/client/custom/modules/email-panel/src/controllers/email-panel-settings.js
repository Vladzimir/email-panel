define('email-panel:controllers/email-panel-settings', ['controllers/record'], (Dep) => {
    return class extends Dep {

        defaultAction = 'index'

        beforeIndex() {
            this.handleCheckAccess('read');
        }

        checkAccess() {
            return this.getAcl().check('Email', 'read');
        }

        actionIndex() {
            this.main('views/settings/edit', {
                model: this.getPreferences(),
                recordView: 'email-panel:views/email-panel-settings',
                headerTemplate: 'email-panel:email-panel-settings-header',
            });
        }
    };
});