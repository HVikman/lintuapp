import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HavaintoComponent } from './pages/havainto/havainto.component';
import { KaikkiComponent } from './pages/havainto/kaikki/kaikki.component';
import { IndexComponent } from './pages/index.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'havainto', component: HavaintoComponent, canActivate: [AuthGuard] },
  { path: 'kaikki', component: KaikkiComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'tools',
    loadChildren: () =>
      import('./pages/tools-routing.module').then((m) => m.ToolsRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
