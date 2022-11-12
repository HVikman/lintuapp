import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from '../angular-material.module';
import { KaikkiComponent } from './havainto/kaikki/kaikki.component';
import { ToolsRoutingModule } from './tools-routing.module';

@NgModule({
  declarations: [KaikkiComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    AngularMaterialModule,
    ToolsRoutingModule,
  ],
})
export class ToolsModule {}
