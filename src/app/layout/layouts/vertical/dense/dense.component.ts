import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { UserService } from 'app/core/user/user.service';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil, filter } from 'rxjs';
import { SettingsComponent } from "../../../common/settings/settings.component";

@Component({
    selector     : 'dense-layout',
    templateUrl  : './dense.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports: [FuseLoadingBarComponent, FuseVerticalNavigationComponent, MatButtonModule, MatIconModule, FuseFullscreenComponent, SearchComponent, NotificationsComponent, UserComponent, NgIf, RouterOutlet, SettingsComponent],
})
export class DenseLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    navigationAppearance: 'default' | 'dense' = 'dense';
    logoSrc: string = 'assets/images/logo/logo.jpg';
    backgroundColor: string = 'rebeccapurple';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
    )
    {
    }

    ngOnInit(): void
    {
        this._userService.user$
            .pipe(
                filter(user => !!user),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((user) => {
                if (user.roles && user.roles.includes('admin')) {
                    this.logoSrc = 'assets/admin.png';
                    this.backgroundColor = 'rebeccapurple';
                } else {
                    this.logoSrc = 'assets/images/logo/logo.jpg';
                    this.backgroundColor = 'rebeccapurple';
                }
            });

        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) =>
            {
                this.navigation = navigation;
            });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                this.isScreenSmall = !matchingAliases.includes('md');
                this.navigationAppearance = this.isScreenSmall ? 'default' : 'dense';
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    toggleNavigation(name: string): void
    {
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            navigation.toggle();
        }
    }

    toggleNavigationAppearance(): void
    {
        this.navigationAppearance = (this.navigationAppearance === 'default' ? 'dense' : 'default');
    }
}
