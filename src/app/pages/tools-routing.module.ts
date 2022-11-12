import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KaikkiComponent } from './havainto/kaikki/kaikki.component';

const routes: Routes = [{ path: 'kaikki', component: KaikkiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolsRoutingModule {}
