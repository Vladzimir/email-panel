define('email-panel:views/site/navbar/email-panel', ['view'], (Dep) => {
    return class extends Dep {

        templateContent = `
            <a role="button" tabindex="0" class="email-panel-button"
               data-action="openEmailPanel">
                <span class="fas fa-envelope icon"></span>
                <span class="badge number-badge hidden"></span>
            </a>
            <div class="email-panel-panel-container"></div>
        `

        checkInterval = 60

        setup() {
            super.setup();

            this.checkIntervalSeconds =
                this.getConfig().get('notificationsCheckInterval') || this.checkInterval;

            this.addActionHandler('openEmailPanel', () => this.openEmailPanel());

            this.once('remove', () => {
                if (this.unreadTimeout) {
                    clearTimeout(this.unreadTimeout);
                }

                $(document).off('mouseup.email-panel');
            });
        }

        afterRender() {
            super.afterRender();

            this.$number = this.$el.find('.number-badge');
            this.$button = this.$el.find('.email-panel-button');
            this.$button.attr('title', this.translate('emailPanelTitle', 'labels'));
            this.runCheckUnread();
        }

        runCheckUnread() {
            this.checkUnreadCount();

            this.unreadTimeout = setTimeout(
                () => this.runCheckUnread(),
                this.checkIntervalSeconds * 1000
            );
        }

        checkUnreadCount() {
            Espo.Ajax.getRequest('Email/inbox/notReadCounts').then(data => {
                const count = data.inbox || 0;

                if (count > 0) {
                    this.$number.removeClass('hidden').html(count.toString());
                    this.$button.attr('title',
                        this.translate('emailPanelUnreadTitle', 'labels').replace('{count}', count)
                    );
                } else {
                    this.$number.addClass('hidden').html('');
                    this.$button.attr('title', this.translate('emailPanelTitle', 'labels'));
                }
            });
        }

        openEmailPanel() {
            if (this.hasView('panel')) {
                this.closeEmailPanel();

                return;
            }

            const $container = $('<div>').attr('id', 'emails-panel');
            $container.appendTo(this.$el.find('.email-panel-panel-container'));

            this.createView('panel', 'email-panel:views/panels/email-panel',
                {el: '#emails-panel'},
                view => {
                    view.render();

                    this.listenToOnce(view, 'close', () => this.closeEmailPanel());

                    this.listenTo(view, 'all-read', () => {
                        view.collection.fetch();
                        this.checkUnreadCount();
                    });
                }
            );

            $(document).on('mouseup.email-panel', e => {
                if (!$container.is(e.target) && $container.has(e.target).length === 0) {
                    if (!$(e.target).closest('div.modal-dialog').length) {
                        this.closeEmailPanel();
                    }
                }
            });

            if (window.innerWidth < this.getThemeManager().getParam('screenWidthXs')) {
                this.listenToOnce(this.getRouter(), 'route', () => this.closeEmailPanel());
            }
        }

        closeEmailPanel() {
            this.clearView('panel');
            this.$el.find('.email-panel-panel-container').empty();
            $(document).off('mouseup.email-panel');
        }
    };
});