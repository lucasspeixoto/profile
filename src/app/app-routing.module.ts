import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PersonalComponent } from './personal/personal/personal.component';
import { AppMainComponent } from './app.main.component';
import { DetailComponent } from './personal/detail/detail.component';

@NgModule({
	imports: [
		RouterModule.forRoot(
			[
				{
					path: '',
					component: AppMainComponent,
					children: [
						{
							path: '',
							component: PersonalComponent,
						},
            {
							path: 'cv/:item',
							component: DetailComponent,
						},

					],
				},

				{ path: '**', redirectTo: '' },
			],
			{ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' },
		),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
