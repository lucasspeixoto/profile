import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import * as fromRoot from '@app/app.reducer';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { MenuItems } from './shared/models/menu-items.model';
import { menuItems } from './shared/helpers/menu-items-options';

@Component({
	selector: 'app-menu',
	template: `
		<div class="layout-menu-container">
			<!-- <span class="mb-2 ml-0 mr-0 ">
				{{ 'header.hello' | transloco }}
				<b style="color:var(--primary-color)">{{
					(user$ | async) ? (user$ | async) : ('header.username' | transloco)
				}}</b>
			</span> -->
			<ul class="layout-menu mt-5" role="menu" (keydown)="onKeydown($event)">
				<li
					app-menu
					class="layout-menuitem-category"
					*ngFor="let item of menuItems; let i = index"
					[item]="item"
					[index]="i"
					[root]="true"
					role="none"
				>
					<div class="layout-menuitem-root-text" [attr.aria-label]="item.label">
						{{ item.label }}
					</div>
					<ul role="menu">
						<li
							app-menuitem
							*ngFor="let child of item.items"
							[item]="child"
							[index]="i"
							role="none"
						></li>
					</ul>
				</li>
			</ul>
		</div>
	`,
})
export class AppMenuComponent implements OnInit {
	menuItems: MenuItems[];

	user$: Observable<string>;

	constructor(
		public appMain: AppMainComponent,
		private store: Store<fromRoot.AppState>,
	) {}

	ngOnInit() {

		this.menuItems = menuItems;
	}

	onKeydown(event: KeyboardEvent) {
		const nodeElement = <HTMLDivElement>event.target;
		if (event.code === 'Enter' || event.code === 'Space') {
			nodeElement.click();
			event.preventDefault();
		}
	}
}
