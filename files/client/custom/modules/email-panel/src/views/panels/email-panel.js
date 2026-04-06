define('email-panel:views/panels/email-panel', ['view'], (Dep) => {
    return class extends Dep {

        template = 'email-panel:panel'

        events = {
            'click [data-action="markAllEmailsRead"]': function () {
                Espo.Ajax
                    .postRequest('Email/inbox/read', {all: true})
                    .then(() => this.trigger('all-read'));
            },
            'click [data-action="openEmail"]': function () {
                this.getRouter().navigate('#Email', {trigger: true});
                this.close();
            },
            'click [data-action="closePanel"]': function () {
                this.close();
            },
            'click [data-action="openSettings"]': function () {
                this.close();
            },
            'keydown': function (e) {
                if (e.code === 'Escape') {
                    this.close();
                }
            },
        }

        setup() {
            super.setup();

            this.wait(true);

            this.getCollectionFactory().create('Email', collection => {
                this.collection = collection;
                collection.maxSize = this.getConfig().get('recordsPerPageSmall') || 5;

                const filter = this.getPreferences().get('emailPanelFilter') || 'all';

                collection.where = [
                    {type: 'inFolder', attribute: 'folderId', value: 'inbox'},
                ];

                if (filter === 'unread') {
                    collection.where.push({type: 'isFalse', attribute: 'isRead'});
                }

                this.wait(false);

                this.listenTo(this.collection, 'sync', () => {
                    this.trigger('collection-fetched');
                });
            });

            this.navbarPanelHeightSpace = this.getThemeManager().getParam('navbarPanelHeightSpace') || 100;
            this.navbarPanelBodyMaxHeight = this.getThemeManager().getParam('navbarPanelBodyMaxHeight') || 600;

            this.once('remove', () => {
                $(window).off('resize.emails-height');

                if (this.overflowWasHidden) {
                    $('body').css('overflow', 'unset');
                    this.overflowWasHidden = false;
                }
            });
        }

        processSizing() {
            const windowHeight = $(window).height();
            const windowWidth = $(window).width();
            const diffHeight = this.$el.find('.panel-heading').outerHeight();
            const cssParams = {};

            if (windowWidth <= this.getThemeManager().getParam('screenWidthXs')) {
                cssParams.height = (windowHeight - diffHeight) + 'px';
                cssParams.overflow = 'auto';
                $('body').css('overflow', 'hidden');
                this.overflowWasHidden = true;
                this.$el.find('.panel-body').css(cssParams);

                return;
            }

            cssParams.height = 'unset';
            cssParams.overflow = 'none';

            if (this.overflowWasHidden) {
                $('body').css('overflow', 'unset');
                this.overflowWasHidden = false;
            }

            if (windowHeight - this.navbarPanelBodyMaxHeight < this.navbarPanelHeightSpace) {
                cssParams.maxHeight = (windowHeight - this.navbarPanelHeightSpace) + 'px';
            }

            this.$el.find('.panel-body').css(cssParams);
        }

        afterRender() {
            super.afterRender();

            this.createView('list', 'views/email/record/list-expanded', {
                el: this.options.el + ' .list-container',
                collection: this.collection,
                showCount: false,
                editDisabled: true,
                skipBuildRows: true,
                listLayout: {
                    rows: [
                        [
                            {
                                name: 'name',
                                view: 'email-panel:views/email/fields/subject',
                                link: true,
                                params: {containerEl: this.options.el},
                            },
                        ],
                        [
                            {
                                name: 'dateSent',
                                view: 'views/fields/datetime-short',
                                params: {containerEl: this.options.el},
                            },
                            {
                                name: 'personStringData',
                                view: 'views/email/fields/person-string-data-for-expanded',
                                params: {containerEl: this.options.el},
                            },
                        ],
                    ],
                    right: {
                        name: 'read',
                        view: 'email-panel:views/email/fields/read',
                        width: '10px',
                    },
                },
            }, view => {
                view.getSelectAttributeList(selectAttributeList => {
                    if (selectAttributeList) {
                        this.collection.data.select = selectAttributeList.join(',');
                    }

                    this.collection.fetch().then(() => view.render());
                });
            });

            $(window).off('resize.emails-height')
                .on('resize.emails-height', () => this.processSizing());

            this.processSizing();
        }

        onRemove() {
            $('#navbar li.emails-badge-container').removeClass('open');
        }

        close() {
            this.trigger('close');
        }
    };
});