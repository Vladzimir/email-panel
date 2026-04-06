<div class="panel panel-default">
    <div class="panel-heading panel-heading-no-title">
        <div class="link-group">
            <a href="#Email" data-action="openEmail">{{translate 'View List'}}</a>
            <a role="button" tabindex="0" data-action="markAllEmailsRead">{{translate 'Mark all read'}}</a>
            <a href="#EmailPanelSettings" data-action="openSettings" title="{{translate 'Settings'}}"><span class="fas fa-cog"></span></a>
            <a role="button" tabindex="0" class="close-link" data-action="closePanel"><span class="fas fa-times"></span></a>
        </div>
        {{translate 'Email'}}
    </div>
    <div class="panel-body">
        <div class="list-container">
            <span class="text-soft fas fa-spinner fa-spin"></span>
        </div>
    </div>
</div>