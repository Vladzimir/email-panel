define('email-panel:views/email-panel-settings', ['views/settings/record/edit'], (Dep) => {
    return class extends Dep {

        scope = 'Preferences'

        setup() {
            super.setup();

            this.buttonList = [
                {name: 'save', label: 'Save', style: 'primary'},
                {name: 'cancel', label: 'Cancel'},
            ];

            this.detailLayout = [
                {
                    label: this.translate('emailPanelSettingsTitle', 'labels'),
                    rows: [
                        [{name: 'emailPanelFilter'}],
                    ],
                },
            ];
        }

        actionSave() {
            const data = this.fetch();

            this.getPreferences().set(data);

            this.getPreferences().save().then(() => {
                Espo.Ui.success(this.translate('Saved'));
            });
        }

        actionCancel() {
            history.back();
        }
    };
});